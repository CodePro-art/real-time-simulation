import asyncio
import websockets
import json, math, time, random

robot_x, robot_y, angle = 0, 0, 0
async def handler(websocket):
    print("Client connected")
    try:
        while True:
            # Move robot in a circle
            global robot_x, robot_y, angle
            angle += 0.1
            robot_x = 50 * math.cos(angle)
            robot_y = 50 * math.sin(angle)

            data = {
                "type": "update",
                "temp": round(20 + 5 * random.random(), 1),
                "battery": round(70 + 30 * random.random(), 1),
                "dist": round(100 + 20 * random.random(), 1),
                "robot": {
                    "x": robot_x,
                    "y": robot_y,
                    "dir": angle
                }
            }

            await websocket.send(json.dumps(data))
            await asyncio.sleep(1)
    except websockets.exceptions.ConnectionClosedOK:
        print("Client disconnected")

async def main():
    async with websockets.serve(handler, "localhost", 5500):
        print("WebSocket server started at ws://localhost:5500")
        await asyncio.Future()

asyncio.run(main())
