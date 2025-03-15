import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const GraphScreen = () => {
  const [robotStatus, setRobotStatus] = useState(null);
  const [lidarData, setLidarData] = useState(null);

  useEffect(() => {
    const fetchRobotStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/robot_status");
        setRobotStatus(response.data);
      } catch (error) {
        console.error("Error fetching robot status:", error);
      }
    };

    const fetchLidarData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/lidar_data");
        setLidarData(response.data);
      } catch (error) {
        console.error("Error fetching lidar data:", error);
      }
    };

    fetchRobotStatus();
    fetchLidarData();
  }, []);

  const renderRobotStatusCharts = () => {
    if (!robotStatus) return null;

    const jointAnglesData = {
      labels: ["Joint 1", "Joint 2", "Joint 3", "Joint 4"],
      datasets: [
        {
          label: "Joint Angles",
          data: [
            robotStatus.joint_angles.joint1,
            robotStatus.joint_angles.joint2,
            robotStatus.joint_angles.joint3,
            robotStatus.joint_angles.joint4,
          ],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const positionData = {
      datasets: [
        {
          label: "Position",
          data: [
            { x: robotStatus.position.x, y: robotStatus.position.y },
          ],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          pointRadius: 10,
        },
      ],
    };

    return (
      <div className="mt-10">
        <h2 className="text-2xl">Robot Status</h2>
        <div className="mt-6">
          <h3 className="text-xl">Position</h3>
          <Scatter data={positionData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Robot Position' } }, scales: { x: { title: { display: true, text: 'X' } }, y: { title: { display: true, text: 'Y' } } } }} />
        </div>
        <div className="mt-6">
          <h3 className="text-xl">Joint Angles</h3>
          <Bar data={jointAnglesData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Robot Joint Angles' } } }} />
        </div>
        <div className="mt-6">
          <p>Speed: {robotStatus.speed}</p>
          <p>Movement Status: {robotStatus.movement_status}</p>
          <p>Safety Zone: {robotStatus.safety_zone}</p>
        </div>
      </div>
    );
  };

  const renderLidarDataChart = () => {
    if (!lidarData) return null;

    const lidarDistancesData = {
      labels: Array.from({ length: 360 }, (_, i) => i),
      datasets: [
        {
          label: "Distances",
          data: lidarData.distances,
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    };

    return (
      <div className="mt-10">
        <h2 className="text-2xl">Lidar Data</h2>
        <Line data={lidarDistancesData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Lidar Distances' } } }} />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        <span className="bg-gradient-to-r from-green-500 to-green-800 text-transparent bg-clip-text">
         Robot and Sensor Data
        </span>
      </h1>
      {renderRobotStatusCharts()}
      {renderLidarDataChart()}
    </div>
  );
};

export default GraphScreen;