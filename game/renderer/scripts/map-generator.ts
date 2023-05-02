import { createNoise2D } from 'simplex-noise';

// initialize the noise function
const noise2D = createNoise2D();

function generateMap(width: number, height: number) {
    let map: number[][] = []

    for (let x = 0; x < width; x++) {
        let row: number[] = []
        for (let y = 0; y < height; y++) {
            const value = noise2D(x, y)
            row.push(value)
        }
        map.push(row)
    }

    return map
}

export enum TileType {
    deepWater = -0.6,
    hill = 0.25,
    mountain = 0.6,
    beaches = -0.1,
    shallowWater = -0.2,
    // any thing between beaches and
    // hill will be a regular plains/flatlands
}
