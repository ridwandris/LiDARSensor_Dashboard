import requests
import matplotlib.pyplot as plt
import numpy as np

# Fetch the robot_status data from the Flask server
robot_status_response = requests.get('http://localhost:5000/api/robot_status')
robot_status = robot_status_response.json()

# Fetch the lidar_data from the Flask server
lidar_data_response = requests.get('http://localhost:5000/api/lidar_data')
lidar_data = lidar_data_response.json()

# Visualize the robot_status data
def visualize_robot_status(robot_status):
    fig, ax = plt.subplots(2, 1, figsize=(12, 10))

    # Plot the robot position
    ax[0].scatter(robot_status['position']['x'], robot_status['position']['y'], c='blue', label='Position', s=100, edgecolors='w', linewidth=1.5)
    ax[0].set_title('Robot Position', fontsize=16)
    ax[0].set_xlabel('X', fontsize=14)
    ax[0].set_ylabel('Y', fontsize=14)
    ax[0].grid(True)
    ax[0].legend(fontsize=12)

    # Plot the joint angles
    joint_angles = [robot_status['joint_angles'][f'joint{i+1}'] for i in range(4)]
    ax[1].bar(range(1, 5), joint_angles, color='green', edgecolor='black', linewidth=1.5, label='Joint Angles')
    ax[1].set_title('Robot Joint Angles', fontsize=16)
    ax[1].set_xlabel('Joint', fontsize=14)
    ax[1].set_ylabel('Angle', fontsize=14)
    ax[1].set_xticks(range(1, 5))
    ax[1].grid(True)
    ax[1].legend(fontsize=12)

    plt.tight_layout()
    plt.show()

# Visualize the lidar_data
def visualize_lidar_data(lidar_data):
    fig, ax = plt.subplots(figsize=(12, 8))

    # Plot the lidar distances
    angles = np.linspace(0, 360, len(lidar_data['distances']))
    ax.plot(angles, lidar_data['distances'], label='Distances', color='blue', linewidth=2)

    # Color the safety zones
    safety_zones = np.array(lidar_data['safety_zones'])
    colors = {'green': 'green', 'yellow': 'yellow', 'red': 'red'}
    for zone in np.unique(safety_zones):
        mask = safety_zones == zone
        ax.fill_between(angles, 0, np.array(lidar_data['distances'])[mask], color=colors[zone], alpha=0.3, label=f'Safety Zone: {zone}')

    ax.set_title('Lidar Data', fontsize=16)
    ax.set_xlabel('Angle (degrees)', fontsize=14)
    ax.set_ylabel('Distance', fontsize=14)
    ax.grid(True)
    ax.legend(fontsize=12)

    plt.tight_layout()
    plt.show()

# Visualize the data
visualize_robot_status(robot_status)
visualize_lidar_data(lidar_data)