import hashlib
import os
import random
import string
import base64
import secrets

salt = os.urandom(30)


def hash_string(string: str):
    """Hash the string and the salt using the SHA-256 algorithm"""
    hashed_string = f"{base64.encodebytes(b'sha256').decode()}${hashlib.sha256(string.encode()).hexdigest()}${base64.encodebytes(salt).decode()}"
    return hashed_string


def gen_token():
    characters = string.ascii_lowercase + string.ascii_uppercase + string.digits

    token = hash_string(''.join(random.choice(characters) for i in range(14)))

    return token


def compare_hash_and_string(string: str, hash: str):
    hash_algorithm, hashed_string, salt = hash.split('$')

    hash_algorithm = base64.decodebytes(hash_algorithm.encode()).decode()
    salt = base64.decodebytes(salt.encode()).decode()

    if hash_algorithm == 'sha256':
        return hashlib.sha256(string.encode()).hexdigest() == hashed_string
