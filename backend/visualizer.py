#this is for testing the the lidar data and the csv file that will be created for the frontend to visualize the data in the frontend
import open3d as o3d
import numpy as np
import csv
import os


file_path = 'q_distance_angle.csv'

# Check if the file exists
if not os.path.exists(file_path):
    print(f"❌ Error: File '{file_path}' not found.")
    exit(1)

# Initialize lists for polar coordinates and Cartesian coordinates
angles = []
distances = []
qualities = []

# Read the CSV file
try:
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        next(reader)  # Skip header row

        for row in reader:
            # Skip empty rows or rows with missing columns
            if len(row) < 3:
                print(f"⚠️ Skipping invalid row (not enough columns): {row}")
                continue

            try:
                quality = int(row[0])  # Quality
                angle = float(row[1])  # Angle in degrees
                distance = float(row[2])  # Distance in millimeters

                if distance > 0:  # Only process valid distance readings
                    qualities.append(quality)
                    angles.append(np.deg2rad(angle))  # Convert angle to radians
                    distances.append(distance)
            except ValueError:
                print(f"⚠️ Skipping invalid row (invalid data types): {row}")
except Exception as e:
    print(f"❌ Error reading file: {e}")
    exit(1)

# Check if any valid data was processed
if not distances:
    print("❌ No valid data found in the CSV file.")
    exit(1)

# Convert polar coordinates to Cartesian (2D)
x_coords = np.array(distances) * np.cos(angles)
y_coords = np.array(distances) * np.sin(angles)
z_coords = np.zeros_like(x_coords)  # Flat plane for 2D Lidar data

# Stack into point cloud format
points = np.vstack((x_coords, y_coords, z_coords)).T

# Normalize distances for coloring
max_distance = max(distances) if distances else 1  # Avoid division by zero
colors = np.array([[dist / max_distance, 0.2, 1.0 - dist / max_distance] for dist in distances])

# Create Open3D point cloud object
pcd = o3d.geometry.PointCloud()
pcd.points = o3d.utility.Vector3dVector(points)
pcd.colors = o3d.utility.Vector3dVector(colors)

# Visualize the point cloud
print("✅ Visualizing point cloud...")
o3d.visualization.draw_geometries([pcd])
