import { createNoise2D } from '../../node_modules/simplex-noise/dist/esm/simplex-noise';

// initialize the noise function
const noise2D = createNoise2D();

export function generateMap(width: number, height: number) {
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
    deepWater = -0.5,
    hill = 0.2,
    mountain = 0.45,
    beaches = -0.09,
    shallowWater = -0.2,
    plains = 0.09
    // any thing between beaches and
    // hill will be a regular plains/flatlands
}
