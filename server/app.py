from datetime import datetime
import json
import time
import traceback
from typing import Mapping
import dotenv
import re
import os
import pymongo
from flask import Flask, request, Response
from tools.functions import hashing

dotenv.load_dotenv()

secret_user_attributes = ['email', 'password', 'token']
connectionString: str = os.getenv('DATABASE_URL', os.getenv('DBTOKEN'))
client = pymongo.MongoClient(connectionString)
database = client['wmw-execut-main-db-0cf8f257b7d']
users_db = database.users

app = Flask(__name__)


@app.route("/users")
def return_users():
    try:
        return_value = 'Username - Rank\n'
        for user in users_db.find({}):
            user: Mapping[str]
            user = {k: v for k, v in user.items() if k not in secret_user_attributes}
            return_value += ' - '.join(user.keys())
    except Exception:
        traceback.print_exc()
        return {
            'message': 'There was an error while fetching users'
        }, 500
    else:
        return {
            'message': return_value
        }, 200


@app.route("/users/<id>")
def return_user():
    user_id = request.url.split('/')[-1]
    try:
        user = users_db.find_one({"id": user_id})
        if not user:
            return {
                'message': 'User not found'
            }, 404
    except Exception:
        traceback.print_exc()
        return {
            'message': 'unable to find the specified id'
        }, 500
    else:
        user = {k: v for k, v in user.items() if k not in secret_user_attributes}
        return user, 200


@app.route("/users/searchByUsername/<username>")
def return_user_by_username():
    try: 
        username_to_search = request.url.split('/')[-1]
        search_results = list(users_db.find({'username': {'$regex': username_to_search}}))
        if not search_results:
            return {
                'No user exists with the given username'
            }, 404
    except Exception:
        traceback.print_exc()
        return {
            'message': 'An error has occured while searching'
        }, 500
    else:
        return search_results


@app.route('/users', methods=['POST'])
def create_user():
    try:
        username = request.args.get('username')
        password = request.headers.get('password')
        email = request.args.get('email')
        data = {
            'username': username,
            'password': password,
            'email': email,
            'token': hashing.gen_token(),
            'created': time.time(),
            'updated': time.time(),
            'friends': [],
            'stats': []
        }
        result = users_db.insert_one(data)
    except Exception:
        traceback.print_exc()
        return {
            'message': "There was an error while creating the user"
        }, 500
    else:
        return {
            'message': 'user created successfully',
        }, 200, data


@app.route('/users', methods=['DELETE'])
async def delete_user():
    token = request.headers.get('token')
    user = users_db.find_one({ "token": token })
    if user is None:
        return {
            'message': 'Could not delete nonexistent user'
        }, 404
    try:
        users_db.delete_one({ 'token': token })
    except Exception:
        traceback.print_exc()
        return {
            'message': 'There was an error while deleting the user'
        }, 500
    else:
        return Response(json.dumps({
            "message": "User deleted successfully",
            "user": user
        }, default=str), 200, mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True)
