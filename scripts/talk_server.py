#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import os


ROOT = Path(__file__).resolve().parent.parent

HOST_HOME_PAGES = {
    "xfinitysupport.com": "/fake-xfinity-support.html",
    "www.xfinitysupport.com": "/fake-xfinity-support.html",
    "safebank.com": "/bank-demo.html",
    "www.safebank.com": "/bank-demo.html",
    "irs-refund.com": "/irs-refund.html",
    "www.irs-refund.com": "/irs-refund.html",
}


class TalkRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        self._route_host_home()
        super().do_GET()

    def do_HEAD(self):
        self._route_host_home()
        super().do_HEAD()

    def _route_host_home(self):
        host = self.headers.get("Host", "").split(":", 1)[0].lower()
        if self.path in ("", "/") and host in HOST_HOME_PAGES:
            self.path = HOST_HOME_PAGES[host]

    def log_message(self, format, *args):
        host = self.headers.get("Host", "-")
        super().log_message("[%s] " + format, host, *args)


def main():
    parser = argparse.ArgumentParser(description="Serve ScamAlert talk demo pages.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=80)
    args = parser.parse_args()

    os.chdir(ROOT)
    server = ThreadingHTTPServer((args.host, args.port), TalkRequestHandler)
    print(f"Serving ScamAlert talk pages on http://{args.host}:{args.port}/", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
