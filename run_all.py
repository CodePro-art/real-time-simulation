import asyncio
import websockets
import http.server
import socketserver
import threading
import webbrowser

# === WebSocket server ===

async def ws_handler(websocket):
    print("Client connected")
    try:
        async for message in websocket:
            print(f"Received: {message}")
            reply = f"Data received as: {message}!"
            await websocket.send(reply)
    except websockets.exceptions.ConnectionClosedOK:
        print("Connection closed")

async def start_ws_server():
    async with websockets.serve(ws_handler, "localhost", 5500):
        print("WebSocket server started at ws://localhost:5500")
        await asyncio.Future()  # run forever

# === HTTP server ===

def start_http_server():
    PORT = 8000
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"HTTP server running at http://localhost:{PORT}")
        httpd.serve_forever()

# === Launch everything ===

def main():
    # Start HTTP server in a separate thread
    http_thread = threading.Thread(target=start_http_server, daemon=True)
    http_thread.start()

    # Optionally open the browser
    webbrowser.open("http://localhost:8000/client.html")

    # Start WebSocket server in the main asyncio loop
    asyncio.run(start_ws_server())

if __name__ == "__main__":
    main()