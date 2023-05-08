import { createNoise2D } from '../../node_modules/simplex-noise/dist/esm/simplex-noise.js';

const noise2D = createNoise2D();

export enum TileType {
    deepWater = -0.5,
    shallowWater = -0.2,
    beaches = 0,
    plains = 0.2,
    hills = 0.4,
    mountains = 0.6,
}

const ELEVATION_FREQUENCY = 0.0045; // how often elevation changes
const LAKE_FREQUENCY = 0.008;

function getNoise(x: number, y: number, octaves: number = 7): number {
    let amplitudes: number[] = []
    let octave_coormultipliers: number[] = []

    for (let i = 1; i < octaves; i++) {
        octave_coormultipliers.push(i)
        amplitudes.push(1 / i)
    }

    let noise = 0

    octave_coormultipliers.forEach((coormultiplier, idx) => {
        let amplitude = amplitudes[idx]
        noise += noise2D(x * coormultiplier * ELEVATION_FREQUENCY, y * coormultiplier * ELEVATION_FREQUENCY) * amplitude
    })
    noise = Math.tanh(noise)

    return noise
}

export function generateMap(width: number, height: number) {
    let map: number[][] = [];

    for (let x = 0; x < width; x++) {
        let row: number[] = [];
        for (let y = 0; y < height; y++) {
            const elevation = getNoise(x, y)

            let tileType = TileType.deepWater;
            if (elevation < -0.1) {
                tileType = TileType.deepWater
            } else if (elevation < 0) {
                tileType = TileType.shallowWater;
            } else if (elevation < 0.1) {
                tileType = TileType.beaches;
            } else if (elevation < 0.55) {
                tileType = TileType.plains;
            } else if (elevation < 0.75) {
                tileType = TileType.hills;
            } else {
                tileType = TileType.mountains;
            }
            row.push(tileType);
        }
        map.push(row);
    }
    return map;
}