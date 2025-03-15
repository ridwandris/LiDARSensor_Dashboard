export const fetchRobotStatus = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/robot_status');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching robot status:', error);
    return {};
  }
};