import os
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(f"MongoDB Connection Error: {e}")

db = client.get_database('careerforge') # Defaults to 'careerforge'

applicants_collection = db.applicants
employees_collection = db.employees

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/applicants', methods=['GET'])
def get_applicants():
    applicants = list(applicants_collection.find({}, {'_id': 0}))
    return jsonify(applicants)

@app.route('/api/applicants/<app_id>', methods=['GET'])
def get_applicant_by_id(app_id):
    applicant = applicants_collection.find_one({'appId': app_id}, {'_id': 0})
    if applicant:
        return jsonify(applicant)
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/applicants', methods=['POST'])
def save_applicant():
    data = request.json
    existing = applicants_collection.find_one({'appId': data.get('appId')})
    if existing:
        applicants_collection.update_one({'appId': data.get('appId')}, {'$set': data})
    else:
        applicants_collection.insert_one(data.copy())
    
    if '_id' in data:
        del data['_id']
    return jsonify(data), 201

@app.route('/api/applicants/<app_id>', methods=['PUT'])
def update_applicant(app_id):
    data = request.json
    applicants_collection.update_one({'appId': app_id}, {'$set': data})
    updated = applicants_collection.find_one({'appId': app_id}, {'_id': 0})
    return jsonify(updated)

@app.route('/api/employees', methods=['GET'])
def get_employees():
    employees = list(employees_collection.find({}, {'_id': 0}))
    return jsonify(employees)

@app.route('/api/employees', methods=['POST'])
def add_employee():
    data = request.json
    existing = employees_collection.find_one({'empId': data.get('empId')})
    if existing:
        employees_collection.update_one({'empId': data.get('empId')}, {'$set': data})
    else:
        employees_collection.insert_one(data.copy())
    
    if '_id' in data:
        del data['_id']
    return jsonify(data), 201

@app.route('/api/employees/<emp_id>', methods=['PUT'])
def update_employee(emp_id):
    data = request.json
    employees_collection.update_one({'empId': emp_id}, {'$set': data})
    updated = employees_collection.find_one({'empId': emp_id}, {'_id': 0})
    return jsonify(updated)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
