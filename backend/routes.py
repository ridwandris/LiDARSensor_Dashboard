from flask import Flask, jsonify
from app import app

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        "message": "Hello from Flask!",
        "Grusse": "Hallo aus Flask!"
    }
    return jsonify(data)