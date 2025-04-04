import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Papa from "papaparse"; // Library to parse CSV files

const GraphScreen = () => {
  const [qDistanceAngleData, setQDistanceAngleData] = useState([]);

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        // this part fetches the CSV file from the backend that contains the Q, Distance, and Angle data
        const response = await axios.get("http://localhost:5000/q_distance_angle_csv", {
          responseType: "text", // Ensure the response is treated as plain text
        });

        // Parse the CSV file
        Papa.parse(response.data, {
          header: true, // Use the first row as headers
          skipEmptyLines: true, // Skip empty lines
          complete: (result) => {
            const parsedData = result.data.map((row) => ({
              quality: parseInt(row.Quality, 10),
              angle: parseFloat(row.Angle),
              distance: parseFloat(row.Distance),
            }));
            console.log("Parsed CSV Data:", parsedData); // Debug parsed data
            setQDistanceAngleData(parsedData);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    };

    fetchCsvData();
  }, []);

  const renderQDistanceAngleChart = () => {
    if (!qDistanceAngleData || qDistanceAngleData.length === 0) {
      return <p>Loading Q, Distance, and Angle Graph...</p>;
    }

    console.log("Data passed to LineChart:", qDistanceAngleData); // Debug data passed to the chart

    return (
      <div className="mt-10">
        <h2 className="text-2xl">Q, Distance, and Angle Data</h2>
        <LineChart width={800} height={400} data={qDistanceAngleData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="angle" label={{ value: "Angle (Theta)", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "Values", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="quality" stroke="#ff7300" name="Quality (Q)" />
          <Line type="monotone" dataKey="distance" stroke="#387908" name="Distance" />
        </LineChart>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        <span className="bg-gradient-to-r from-green-500 to-green-800 text-transparent bg-clip-text">
          Sensor Data Visualization
        </span>
      </h1>
      {renderQDistanceAngleChart()}
    </div>
  );
};

export default GraphScreen;