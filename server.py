import asyncio
import websockets

async def handler(websocket):
    print("Client connected")
    try:
        async for data in websocket:
            print(f"Received: {data}")
            reply = f"Data received as: {data}!"
            await websocket.send(reply)
    except websockets.exceptions.ConnectionClosedOK:
        print("Connection closed")

async def main():
    async with websockets.serve(handler, "localhost", 5500):
        print("WebSocket server started at ws://localhost:5500")
        await asyncio.Future()  # run forever

asyncio.run(main())
