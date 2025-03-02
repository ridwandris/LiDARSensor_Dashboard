from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
import threading
from sensor_data import simulate_robot_status, simulate_lidar_data

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

import routes  # Import routes to register them with the Flask app

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    threading.Thread(target=simulate_robot_status).start()
    threading.Thread(target=simulate_lidar_data).start()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)