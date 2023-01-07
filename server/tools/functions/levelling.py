import math

level_to_xp = [
    0, 10, 25, 50, 100, 200, 500, 1000, 1600, 2400, 3500, 5000, 8750, 10350, 13700, 17500, 25000, 36000, 50000
]

def getLevel(current_xp: int):
    return current_xp // (100 * current_xp)
