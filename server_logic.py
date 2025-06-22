import asyncio
import websockets
import json
import random

connected_clients = set()

async def simulate_and_send():
    while True:
        data = {
            "type": "sensor",
            "temp": round(random.uniform(20.0, 30.0), 2),
            "distance": random.randint(0, 100),
            "battery": round(random.uniform(60.0, 100.0), 1)
        }
        if connected_clients:
            message = json.dumps(data)
            await asyncio.wait([client.send(message) for client in connected_clients])
        await asyncio.sleep(1)  # every second

async def handler(websocket):
    print("Client connected")
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            print(f"Received: {message}")
            # Optional: handle joystick commands here
            await websocket.send(json.dumps({"type": "ack", "msg": f"Command received: {message}"}))
    except websockets.exceptions.ConnectionClosedOK:
        print("Connection closed")
    finally:
        connected_clients.remove(websocket)

async def main():
    async with websockets.serve(handler, "localhost", 5500):
        print("WebSocket server started at ws://localhost:5500")
        await simulate_and_send()

asyncio.run(main())
