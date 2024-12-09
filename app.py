from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import logging

app = Flask(__name__) 
CORS(app) 

client = MongoClient('mongodb+srv://sinharitika009:eK9IYLpKUXCDHtWY@viz-cluster.lbmkh.mongodb.net/')
db = client.viz_database 
collection = db.viz_collection


@app.route('/data', methods=['GET'])
def get_data():
    level = request.args.get('level')  # Get level from query parameters
    parent_id = request.args.get('parent_id')  # Get parent_id from query parameters

    logging.info(f"Fetching data for level: {level}, parent_id: {parent_id}")

    if level == 'L0':
        # Fetch only L0 nodes (top-level nodes)
        data = list(db.viz_collection.find(
            {"level": "L0"},  # Query for L0 nodes
            {"_id": 1, "name": 1, "value": 1, "level": 1}  # Project required fields
        ))
        logging.info(f"Fetched L0 data: {data}")

    else:
        # Fetch nodes matching the specified parent_id and level
        data = list(db.viz_collection.find(
            {"parent_id": parent_id, "level": level},  # Query for child nodes
            {"_id": 1, "name": 1, "value": 1, "level": 1, "parent_id": 1}  # Project required fields
        ))
        logging.info(f"Fetched data for level {level}, parent_id {parent_id}: {data}")

    # Return the fetched data as a JSON response
    return jsonify(data)




@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
