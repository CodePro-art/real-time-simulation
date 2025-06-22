import asyncio
import websockets
import json, math, time, random

robot_x, robot_y, angle = 0, 0, 0
async def handler(websocket):
    print("Client connected")
    global robot_x, robot_y, angle

    try:
        while True:
            # Move robot in a circle
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
            # print("➡️ Sending:", data)
            await websocket.send(json.dumps(data))
            await asyncio.sleep(1)

    except websockets.exceptions.ConnectionClosedOK:
        print("🔌 Client disconnected cleanly (ConnectionClosedOK)")

    except websockets.exceptions.ConnectionClosedError as e:
        print(f"❌ Connection closed with error: {e}")

    except Exception as e:
        print(f"🔥 Unexpected error in handler: {type(e).__name__} - {e}")

    finally:
        print("🛑 Exiting handler loop")


async def main():
    async with websockets.serve(handler, "localhost", 5500):
        print("WebSocket server started at ws://localhost:5500")
        await asyncio.Future()

asyncio.run(main())
