import os
import pymongo
from flask import Flask

connectionString: str = os.getenv('DBTOKEN')
client = pymongo.MongoClient(connectionString)


app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, World!'