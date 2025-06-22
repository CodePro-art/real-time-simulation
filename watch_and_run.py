import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
import time
import sys

# Replace this with the actual path to your Python executable inside your conda env
PYTHON_PATH = sys.executable  # This grabs the current Python path

COMMAND = [PYTHON_PATH, "run.py"]

class ChangeHandler(FileSystemEventHandler):
    def __init__(self):
        self.process = subprocess.Popen(COMMAND)

    def restart(self):
        print("🔁 Detected change, restarting...")
        self.process.kill()
        self.process = subprocess.Popen(COMMAND)

    def on_any_event(self, event):
        if event.src_path.endswith((".py", ".html", ".js")):
            self.restart()

if __name__ == "__main__":
    path = "."
    event_handler = ChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=path, recursive=True)
    observer.start()

    print("👀 Watching for file changes...")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        event_handler.process.kill()
    observer.join()
