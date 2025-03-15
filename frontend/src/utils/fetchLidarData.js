export const fetchLidarData = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/lidar_data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching LiDAR data:', error);
    return [];
  }
};