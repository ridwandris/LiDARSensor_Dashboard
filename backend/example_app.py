from flask import Flask, render_template, jsonify  # Added jsonify import
import json
from flask_sock import Sock
from rplidar import RPLidar, RPLidarException
import numpy as np
from matplotlib import colors, colormaps, cm

SERIAL_PORT = 'COM8'  # Change the port for Windows system
BAUDRATE = 115200

app = Flask(__name__)
sock = Sock(app)

latest_lidar_data = []  # Global variable to store the latest LiDAR data

class DataIncoming:
    """
    handles incoming serial data
    """

    def __init__(self):
        self.x = 0
        self.y = 0
        self.z = 0
        self.xyz = [0, 0, 0]

    def update(self, phi: float, theta: float, r: int):
        sinPhi = r * np.sin(phi)
        self.y = r * np.cos(phi)
        self.z = sinPhi * np.cos(theta)
        self.x = sinPhi * np.sin(theta)
        self.xyz[0] = self.x
        self.xyz[1] = self.y
        self.xyz[2] = self.z

di = DataIncoming()

# assuming the max distance will be 500 cm and min distance will be 5cm
norm = colors.Normalize(vmin=5, vmax=500)
f2rgb = cm.ScalarMappable(norm=norm, cmap=colormaps['plasma'])

class IDX:
    """
    keeps track of completion
    """

    def __init__(self, size):
        self.size = size
        self.idx = 0

    def update(self, val=1):
        self.idx += val
        self.idx = self.idx % self.size

counter = IDX(54000)  # 600 * 90
cInv = 100 / 54000

@app.route("/api/lidar", methods=['GET'])
def get_lidar_data():
    print("GET /api/lidar called")
    return jsonify(latest_lidar_data)

@sock.route('/lidar')
def echo(sock):
    global latest_lidar_data
    lidar = RPLidar(SERIAL_PORT, baudrate=BAUDRATE)
    try:
        print('Starting Lidar Scanning...')
        for scan in lidar.iter_scans():
            for (_, angle, distance) in scan:
                data = {
                    'angle': angle,
                    'distance': distance
                }
                latest_lidar_data.append(data)  # Update the global variable
                print(f"running...: {counter.idx * cInv:.2f}%, distance: {distance}")
                sock.send(json.dumps(data))
                counter.update()
    except RPLidarException as e:
        print(f"RPLidarException: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        lidar.stop()
        lidar.disconnect()

if __name__ == "__main__":
    app.run(debug=True)
