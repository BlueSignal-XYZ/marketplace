#!/usr/bin/env python3
"""
BlueSignal Pipeline Dashboard — Local Server

Serves the dashboard UI and provides a REST API for reading/writing
the JSON data files and executing terminal commands.

Usage:
    python serve.py              # Starts on http://localhost:8080
    python serve.py --port 3000  # Custom port

API Endpoints:
    GET  /data/<filename>.json   — Read a data file
    PUT  /data/<filename>.json   — Write/update a data file (JSON body)
    GET  /api/files              — List all data files
    POST /api/exec               — Execute a shell command (JSON: {"command": "..."})
"""

import argparse
import json
import os
import subprocess
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse

DASHBOARD_DIR = Path(__file__).parent.resolve()
DATA_DIR = DASHBOARD_DIR / "data"
REPO_DIR = DASHBOARD_DIR.parent  # The agentic-harness root


class DashboardHandler(SimpleHTTPRequestHandler):
    """Serves static files, data API, and terminal execution."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DASHBOARD_DIR), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        if path == "/api/files":
            self._list_data_files()
        else:
            super().do_GET()

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path.startswith("/data/") and path.endswith(".json"):
            self._write_data_file(path)
        else:
            self.send_error(405, "PUT only supported for /data/*.json")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        if path == "/api/exec":
            self._exec_command()
        else:
            self.send_error(404, "Not found")

    def _json_response(self, data, status=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _list_data_files(self):
        files = []
        if DATA_DIR.exists():
            for f in sorted(DATA_DIR.iterdir()):
                if f.suffix == ".json" and f.is_file():
                    stat = f.stat()
                    files.append({
                        "name": f.name,
                        "size": stat.st_size,
                        "modified": stat.st_mtime,
                    })
        self._json_response(files)

    def _write_data_file(self, path):
        filename = path.split("/data/", 1)[1]
        if ".." in filename or "/" in filename:
            self.send_error(400, "Invalid filename")
            return

        target = DATA_DIR / filename
        if target.suffix != ".json":
            self.send_error(400, "Only .json files are supported")
            return

        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            self.send_error(400, "Empty body")
            return

        raw = self.rfile.read(content_length)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            self._json_response({"error": f"Invalid JSON: {e}"}, 400)
            return

        DATA_DIR.mkdir(parents=True, exist_ok=True)
        with open(target, "w") as f:
            json.dump(data, f, indent=2)
            f.write("\n")

        self._json_response({"status": "ok", "file": filename})

    def _exec_command(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            self._json_response({"error": "Empty body"}, 400)
            return

        raw = self.rfile.read(content_length)
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            self._json_response({"error": "Invalid JSON"}, 400)
            return

        command = payload.get("command", "").strip()
        if not command:
            self._json_response({"error": "No command provided"}, 400)
            return

        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30,
                cwd=str(REPO_DIR),
            )
            self._json_response({
                "stdout": result.stdout,
                "stderr": result.stderr,
                "code": result.returncode,
            })
        except subprocess.TimeoutExpired:
            self._json_response({"error": "Command timed out (30s limit)"})
        except Exception as e:
            self._json_response({"error": str(e)})

    def log_message(self, format, *args):
        status = args[1] if len(args) > 1 else ""
        if str(status) != "200" or self.path.startswith("/api"):
            super().log_message(format, *args)

    def handle_one_request(self):
        try:
            super().handle_one_request()
        except BrokenPipeError:
            pass  # Browser disconnected mid-response (common on mobile)


def main():
    parser = argparse.ArgumentParser(description="BlueSignal Pipeline Dashboard Server")
    parser.add_argument("--port", type=int, default=8080, help="Port (default: 8080)")
    parser.add_argument("--host", default="0.0.0.0", help="Host (default: 0.0.0.0)")
    args = parser.parse_args()

    os.chdir(DASHBOARD_DIR)

    server = HTTPServer((args.host, args.port), DashboardHandler)
    print(f"BlueSignal Pipeline Dashboard")
    print(f"  http://localhost:{args.port}")
    print(f"  Data: {DATA_DIR}")
    print(f"  Repo: {REPO_DIR}")
    print(f"  Ctrl+C to stop\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
        server.shutdown()


if __name__ == "__main__":
    main()
