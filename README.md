# DOBOT Web Dashboard

This project is a real-time web-based interface for controlling the DOBOT MG400 robot and visualizing LiDAR data.

## Features

- ✅ Real-time LiDAR visualization
- ❌ Manual control of DOBOT MG400 (Optional)
- ❌ Safety alerts for obstacle detection (furter updates needed)
- ✅ WebSocket-based real-time updates

## Installation

### Backend

1. Navigate to the `backend` directory:
    ```sh
    cd backend
    ```

2. Create a virtual environment and activate it:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Run the backend server:
    ```sh
    python app.py
    ```

### Frontend

1. Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```

2. Install the required dependencies:
    ```sh
    npm install
    ```

3. Run the frontend development server:
    ```sh
    npm run dev
    ```

## Usage

- Open your web browser and navigate to the URL provided by the Vite development server (usually `http://localhost:3000`).
- The backend server will be running on `http://localhost:5000`.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Flask](https://flask.palletsprojects.com/)
- [Socket.IO](https://socket.io/)
