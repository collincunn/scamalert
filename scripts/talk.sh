#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOSTS_FILE="/etc/hosts"
HOSTS_MARKER_BEGIN="# BEGIN ScamAlert talk hosts"
HOSTS_MARKER_END="# END ScamAlert talk hosts"
PORT="${SCAMALERT_PORT:-80}"
PID_FILE="$ROOT_DIR/.talk-server.pid"
LOG_FILE="$ROOT_DIR/.talk-server.log"
HEALTH_URL="http://127.0.0.1:$PORT/fake-xfinity-support.html"

DOMAINS=(
  "xfinitysupport.com"
  "www.xfinitysupport.com"
  "safebank.com"
  "www.safebank.com"
  "irs-refund.com"
  "www.irs-refund.com"
)

PAGES=(
  "http://xfinitysupport.com/"
  "http://safebank.com/"
  "http://irs-refund.com/"
  "http://safebank.com/bank-demo.html"
  "http://xfinitysupport.com/login-demo.html"
  "http://xfinitysupport.com/romance-scam.html"
  "http://xfinitysupport.com/fake-teams.html"
)

usage() {
  cat <<EOF
Usage: scripts/talk.sh <command>

Commands:
  start       Start the local talk web server on port $PORT
  stop        Stop the local talk web server
  restart     Stop and start the local talk web server
  status      Show hosts and server status
  hosts       Print the host entries this talk uses
  install-hosts
              Add talk host entries to /etc/hosts. Requires sudo.
  urls        Print demo URLs

Run before the talk:
  sudo scripts/talk.sh install-hosts
  sudo scripts/talk.sh start
EOF
}

hosts_block() {
  printf "%s\n" "$HOSTS_MARKER_BEGIN"
  cat "$ROOT_DIR/hosts.talk" | sed '/^#/d; /^$/d'
  printf "%s\n" "$HOSTS_MARKER_END"
}

hosts_installed() {
  grep -qF "$HOSTS_MARKER_BEGIN" "$HOSTS_FILE" &&
    grep -qF "$HOSTS_MARKER_END" "$HOSTS_FILE"
}

install_hosts() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "install-hosts must be run with sudo because it edits $HOSTS_FILE." >&2
    exit 1
  fi

  if hosts_installed; then
    local tmp
    tmp="$(mktemp)"
    SCAMALERT_HOSTS_TALK="$ROOT_DIR/hosts.talk" awk \
      -v begin="$HOSTS_MARKER_BEGIN" \
      -v end="$HOSTS_MARKER_END" '
        $0 == begin {
          print begin
          while ((getline line < ENVIRON["SCAMALERT_HOSTS_TALK"]) > 0) {
            if (line !~ /^#/ && line !~ /^$/) print line
          }
          print end
          skip = 1
          next
        }
        $0 == end {
          skip = 0
          next
        }
        !skip { print }
      ' "$HOSTS_FILE" > "$tmp"
    cat "$tmp" > "$HOSTS_FILE"
    rm -f "$tmp"
    dscacheutil -flushcache >/dev/null 2>&1 || true
    killall -HUP mDNSResponder >/dev/null 2>&1 || true
    echo "Updated talk host entries in $HOSTS_FILE."
    return
  fi

  {
    printf "\n"
    hosts_block
  } >> "$HOSTS_FILE"

  dscacheutil -flushcache >/dev/null 2>&1 || true
  killall -HUP mDNSResponder >/dev/null 2>&1 || true
  echo "Installed talk host entries in $HOSTS_FILE."
}

print_hosts() {
  hosts_block
}

server_running() {
  [[ -f "$PID_FILE" ]] || return 1
  local pid
  pid="$(cat "$PID_FILE")"
  [[ -n "$pid" ]] || return 1
  ps -p "$pid" >/dev/null 2>&1
}

server_responding() {
  curl --noproxy "*" -fsS "$HEALTH_URL" >/dev/null 2>&1
}

start_server() {
  if [[ "$PORT" == "80" && "$(id -u)" -ne 0 ]]; then
    echo "Starting on port 80 requires sudo. Run: sudo scripts/talk.sh start" >&2
    exit 1
  fi

  if server_running; then
    echo "Talk server is already running with PID $(cat "$PID_FILE")."
    return
  fi

  if server_responding; then
    echo "Talk server is already responding on port $PORT."
    return
  fi

  cd "$ROOT_DIR"
  python3 scripts/talk_server.py --host 127.0.0.1 --port "$PORT" > "$LOG_FILE" 2>&1 &
  echo "$!" > "$PID_FILE"
  sleep 0.5

  if ! server_running; then
    echo "Talk server failed to start. See $LOG_FILE." >&2
    exit 1
  fi

  echo "Talk server started on port $PORT with PID $(cat "$PID_FILE")."
  echo "Main fake support page: http://xfinitysupport.com/"
  echo "SafeBank page: http://safebank.com/"
}

stop_server() {
  if ! server_running; then
    echo "Talk server is not running."
    rm -f "$PID_FILE"
    return
  fi

  local pid
  pid="$(cat "$PID_FILE")"
  kill "$pid"
  rm -f "$PID_FILE"
  echo "Stopped talk server PID $pid."
}

print_urls() {
  printf "%s\n" "${PAGES[@]}"
  printf "%s\n" "https://natashaskitchen.com/quick-creme-brulee-recipe/"
  printf "\nChrome extension folder:\n%s\n" "$ROOT_DIR/xfinity-serp-extension"
}

status() {
  echo "Host mappings:"
  for domain in "${DOMAINS[@]}"; do
    local resolved
    resolved="$(dscacheutil -q host -a name "$domain" 2>/dev/null | awk '/ip_address/ { print $2; exit }' || true)"
    if [[ "$resolved" == "127.0.0.1" ]]; then
      echo "  OK  $domain -> $resolved"
    else
      echo "  NO  $domain -> ${resolved:-not found}"
    fi
  done

  if server_running; then
    echo "Server: running on port $PORT with PID $(cat "$PID_FILE")"
  elif server_responding; then
    echo "Server: responding on port $PORT, but no managed PID was found"
  else
    echo "Server: not running"
  fi
}

command="${1:-}"
case "$command" in
  start)
    start_server
    ;;
  stop)
    stop_server
    ;;
  restart)
    stop_server
    start_server
    ;;
  status)
    status
    ;;
  hosts)
    print_hosts
    ;;
  install-hosts)
    install_hosts
    ;;
  urls)
    print_urls
    ;;
  ""|-h|--help|help)
    usage
    ;;
  *)
    echo "Unknown command: $command" >&2
    usage >&2
    exit 1
    ;;
esac
