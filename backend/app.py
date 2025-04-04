import csv
import os
import serial
import time
from flask import Flask, Response, send_file
import math
from flask_cors import CORS

# COM Port and baud rate settings for the RPLidar A1 M8 Lidar
PORT = 'COM5' # Adjust this to your Lidar's COM port. '/dev/ttyUSB0' For Linux or MacOS
BAUD_RATE = 115200

app = Flask(__name__)
CORS(app)

# Initialize serial connection
ser = None
try:
    ser = serial.Serial(PORT, BAUD_RATE, timeout=1, dsrdtr=False)
    ser.dtr = False  # this disables the DTR signal of the lidar. This will avoid the Lidar motor from stopping the spinning . Gave me some issues at the beginning.
    time.sleep(2)

    print("✅ Successfully connected to the Lidar.")

    # Send start scan command
    ser.write(b'\xA5\x20')
    time.sleep(0.5)  # Give Lidar time to start spinning
    print("✅ Lidar is now streaming data. Press Ctrl+C to stop.")

except serial.SerialException as e:
    print(f"❌ Failed to connect to the Lidar: {e}")
    ser = None

# File paths for CSV files that will be created for storing stream data that I used for testing purpose in the frontend. its actually dinamic and will be created when the app is running.
DATA_CSV_FILE = "data.csv"
Q_DISTANCE_ANGLE_CSV_FILE = "q_distance_angle.csv"

# Check if the CSV files already exist, if not, they will be created
if not os.path.exists(DATA_CSV_FILE):
    with open(DATA_CSV_FILE, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Frame", "X", "Y", "Z"])  # Header for /data

if not os.path.exists(Q_DISTANCE_ANGLE_CSV_FILE):
    with open(Q_DISTANCE_ANGLE_CSV_FILE, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Quality", "Angle", "Distance"])  # Header for /q_distance_angle

# Flask route to stream live LIDAR data and write to CSV
@app.route('/data', methods=['GET'])
def get_live_data():
    if ser is None or not ser.is_open:
        return Response("Error: Serial port is not open.", status=500)

    def generate():
        frame_number = 0
        while True:
            frame_number += 1
            data_chunk = ser.read(5)  # Read 5 bytes at a time

            if len(data_chunk) == 5:
                # Decode the data chunk
                quality = data_chunk[0] >> 2
                check_bit = data_chunk[0] & 0b01
                angle = ((data_chunk[1] >> 1) | (data_chunk[2] << 7)) / 64.0
                distance = ((data_chunk[3]) | (data_chunk[4] << 8)) / 4.0

                if check_bit == 1 and distance > 0:
                    # Convert polar coordinates to Cartesian (XYZ)
                    x = distance * math.cos(math.radians(angle))
                    y = distance * math.sin(math.radians(angle))
                    z = 0  # Assuming a 2D plane for LIDAR data

                    # Write to CSV
                    with open(DATA_CSV_FILE, mode="a", newline="") as file:
                        writer = csv.writer(file)
                        writer.writerow([frame_number, x, y, z])

                    # Stream the data as JSON when we run ip localhost:5000/data in the browser
                    yield f'data: {{"Frame": {frame_number}, "X": {x:.2f}, "Y": {y:.2f}, "Z": {z:.2f}}}\n\n'

            time.sleep(0.01)  # Simulate real-time streaming

    return Response(generate(), content_type='text/event-stream')

# Flask route to stream Q (Quality), Distance, and Angle data and write to CSV
@app.route('/q_distance_angle', methods=['GET'])
def get_q_distance_angle():
    def generate():
        while True:
            data_chunk = ser.read(5)  # Read 5 bytes at a time

            if len(data_chunk) == 5:
                # Decode the data chunk
                quality = data_chunk[0] >> 2
                check_bit = data_chunk[0] & 0b01
                angle = ((data_chunk[1] >> 1) | (data_chunk[2] << 7)) / 64.0
                distance = ((data_chunk[3]) | (data_chunk[4] << 8)) / 4.0

                if check_bit == 1 and distance > 0:
                    # Write to CSV
                    with open(Q_DISTANCE_ANGLE_CSV_FILE, mode="a", newline="") as file:
                        writer = csv.writer(file)
                        writer.writerow([quality, angle, distance])

                    # Format the data as requested
                    formatted_data = f"Q: {quality:<3} | Theta: {angle:>6.2f}° | Dist: {distance:>7.2f} mm\n"
                    yield formatted_data

            time.sleep(0.01)  # Simulate real-time streaming

    return Response(generate(), content_type='text/plain')

@app.route('/q_distance_angle_csv', methods=['GET'])
def get_q_distance_angle_csv():
    return send_file("q_distance_angle.csv", as_attachment=False)

@app.route('/data_csv', methods=['GET'])
def get_data_csv():
    return send_file("data.csv", as_attachment=False)

if __name__ == '__main__':
    try:
        # Run the Flask app
        app.run(host='0.0.0.0', port=5000)
    finally:
        # Properly stop the Lidar motor and close the serial connection
        if ser and ser.is_open:
            ser.write(b'\xA5\x25')  # Stop the Lidar motor
            ser.close()
            print("✅ Serial port closed.")
