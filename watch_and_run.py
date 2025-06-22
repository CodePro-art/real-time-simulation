import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
import time
import sys

PYTHON_PATH = sys.executable

# Commands to run
COMMANDS = [
    [PYTHON_PATH, "run.py"],
    [PYTHON_PATH, "server_logic.py"]
]

class ChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.processes = []
        self.start_processes()

    def start_processes(self):
        # Start all commands
        self.processes = [subprocess.Popen(cmd) for cmd in COMMANDS]

    def restart(self):
        print("🔁 Detected change, restarting all processes...")
        for p in self.processes:
            p.kill()
        self.start_processes()

    def on_any_event(self, event):
        if event.src_path.endswith((".py", ".html", ".js")):
            self.restart()

if __name__ == "__main__":
    path = "."
    event_handler = ChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=path, recursive=True)
    observer.start()

    print("👀 Watching for file changes and managing both servers...")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        for p in event_handler.processes:
            p.kill()
    observer.join()
    print("🛑 Stopped watching and killed all processes.")