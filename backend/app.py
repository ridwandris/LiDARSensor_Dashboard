from flask import Flask, jsonify, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from rplidar import RPLidar, RPLidarException
from matplotlib import colors, colormaps, cm
import numpy as np
import random
import time
import threading
# import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

#SERIAL_PORT = 'COM8'
#BAUDRATE = 115200
#TIMEOUT: int = 1

#lidar = RPLidar(SERIAL_PORT, baudrate=BAUDRATE)
#lidar_data = []

latest_robot_status = {}  # Global variable to store the latest robot status
latest_lidar_data = {}  # Global variable to store the latest lidar data

# frontend_folder = os.path.join(os.path.getcwd(), "..", "frontend", "dist")

#@app.route('/')
#def home():
#    return "Hello, Flask!"

@app.route('/')
def index():
    return "LiDAR Flask Backend Running!"

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        "message": "Hello from Flask!",
        "Grusse": "Hallo aus Flask!"
    }
    return jsonify(data)

@app.route('/api/robot_status', methods=['GET'])
def get_robot_status():
    return jsonify(latest_robot_status)

@app.route('/api/lidar_data', methods=['GET'])
def get_lidar_data():
    return jsonify(latest_lidar_data)

lidar_data = []  # Global variable to store the lidar data

def fetch_lidar_data():
    global lidar_data
    try:
        print('Starting Lidar Scanning...')
        for scan in lidar.iter_scans():
            lidar_data = [
                {"angle": measurement[1], "distance": measurement[2]}
                for measurement in scan
            ]
            socketio.emit('lidar_data', lidar_data)  # Emit data to frontend
            time.sleep(0.1) 
    except Exception as e:
        print(f"Error fetching Lidar data: {e}")
    finally:
        lidar.stop()
        lidar.disconnect()

# Start Lidar data fetching in a separate thread
threading.Thread(target=fetch_lidar_data, daemon=True).start()

@app.route('/api/rplidar_sim', methods=['GET'])
def get_rplidar_sim():
    global lidar_data
    return jsonify(lidar_data)


def simulate_robot_status():
    global latest_robot_status
    while True:
        try:
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
            latest_robot_status = robot_status  # Update the global variable
            socketio.emit('robot_status', robot_status, namespace='/')
        except Exception as e:
            print(f"Error in simulate_robot_status: {e}")
        time.sleep(1)

def simulate_lidar_data():
    global latest_lidar_data
    while True:
        try:
            lidar_data = {
                "distances": [random.uniform(0, 100) for _ in range(360)],
                "safety_zones": ["green" if d > 70 else "yellow" if d > 30 else "red" for d in range(360)]
            }
            latest_lidar_data = lidar_data  # Update the global variable
            socketio.emit('lidar_data', lidar_data, namespace='/')
        except Exception as e:
            print(f"Error in simulate_lidar_data: {e}")
        time.sleep(1)

if __name__ == '__main__':
    print("Starting Lidar Scanning...")
    threading.Thread(target=fetch_lidar_data).start()
    threading.Thread(target=simulate_robot_status).start()
    threading.Thread(target=simulate_lidar_data).start()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)