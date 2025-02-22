from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import json
#import numpy as np
#from matplotlib import colors, colormaps, cm
#import serial
import time
import threading
import random

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        "message": "Hello from Flask!"
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
        socketio.emit('robot_status', robot_status)
        time.sleep(1)

def simulate_lidar_data():
    while True:
        lidar_data = {
            "distances": [random.uniform(0, 100) for _ in range(360)],
            "safety_zones": ["green" if d > 70 else "yellow" if d > 30 else "red" for d in range(360)]
        }
        socketio.emit('lidar_data', lidar_data)
        time.sleep(1)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    threading.Thread(target=simulate_robot_status).start()
    threading.Thread(target=simulate_lidar_data).start()
    socketio.run(app, debug=True, port=5000)