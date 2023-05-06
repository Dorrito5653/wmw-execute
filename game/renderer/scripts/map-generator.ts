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

export function generateMap(width: number, height: number) {
    let map: number[][] = [];

    for (let x = 0; x < width; x++) {
        let row: number[] = [];
        for (let y = 0; y < height; y++) {
            const elevation = noise2D(x * ELEVATION_FREQUENCY, y * ELEVATION_FREQUENCY);

            let tileType = TileType.deepWater;
            if (elevation < -0.2) {
                tileType = TileType.deepWater
            } else if (elevation < 0) {
                tileType = TileType.shallowWater;
            } else if (elevation < 0.1) {
                tileType = TileType.beaches;
            } else if (elevation < 0.5) {
                tileType = TileType.plains;
            } else if (elevation < 0.8) {
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
