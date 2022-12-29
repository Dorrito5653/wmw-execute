import hashlib
import os
import random
import string

salt = os.urandom(30)


def hash_string(string: str):
    """Hash the string and the salt using the SHA-256 algorithm"""
    hashed_string = hashlib.sha256((string.encode() + salt)).hexdigest()
    return hashed_string


def gen_token():
    characters = string.ascii_lowercase + string.ascii_uppercase + string.digits

    token = hash_string(''.join(random.choice(characters) for i in range(14)))

    return token
