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

const CONTINENT_FREQUENCY = 0.0085; // how often continents appear
const ELEVATION_FREQUENCY = 0.0095; // how often elevation changes

export function generateMap(width: number, height: number) {
    let map: number[][] = [];

    for (let x = 0; x < width; x++) {
        let row: number[] = [];
        for (let y = 0; y < height; y++) {
            const noiseValue = noise2D(x * CONTINENT_FREQUENCY, y * CONTINENT_FREQUENCY);
            const elevation = noise2D(x * ELEVATION_FREQUENCY, y * ELEVATION_FREQUENCY) + 0.5;
            const distanceToCenter = Math.sqrt((x - width / 2) ** 2 + (y - height / 2) ** 2) / Math.sqrt(width ** 2 + height ** 2);
            const continentThreshold = 0.5 - distanceToCenter;

            if (noiseValue > continentThreshold) {
                let tileType = TileType.deepWater;
                if (elevation < 0.1) {
                    tileType = TileType.shallowWater;
                } else if (elevation < 0.15) {
                    tileType = TileType.beaches;
                } else if (elevation < 0.7) {
                    tileType = TileType.plains;
                } else if (elevation < 0.8) {
                    tileType = TileType.hills;
                } else {
                    tileType = TileType.mountains;
                }
                row.push(tileType);
            } else {
                row.push(TileType.deepWater);
            }
        }
        map.push(row);
    }

    return map;
}
