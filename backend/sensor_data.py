from app import app, simulate_lidar_data, simulate_robot_status
from flask import jsonify
import random
import time
import threading
from flask_socketio import emit


def home():
    return "Hello, Flask!"

def get_data():
    data = {
        "message": "Hello from Flask!",
        "Grusse": "Hallo aus Flask!"
    }
    return jsonify(data)

def simulate_robot_status():
    while True:
        robot_status = {
            "position": {
                "x": random.uniform(0, 100),
                "y": random.uniform(0, 100),
                "z": random.uniform(0, 100)
            },
            "joint_angles": {
                "joint1": random.uniform(0, 180),
                "joint2": random.uniform(0, 180),
                "joint3": random.uniform(0, 180),
                "joint4": random.uniform(0, 180)
            },
            "speed": random.uniform(0, 10),
            "movement_status": random.choice(["idle", "running", "error"]),
            "safety_zone": random.choice(["green", "yellow", "red"])
        }
        emit('robot_status', robot_status, broadcast=True)
        time.sleep(1)

def simulate_lidar_data():
    while True:
        lidar_data = {
            "distances": [random.uniform(0, 100) for _ in range(360)],
            "safety_zones": ["green" if d > 70 else "yellow" if d > 30 else "red" for d in range(360)]
        }
        emit('lidar_data', lidar_data, broadcast=True)
        time.sleep(1)