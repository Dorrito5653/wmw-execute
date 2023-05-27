import { createNoise2D } from '../../node_modules/simplex-noise/dist/esm/simplex-noise.js';

const noise2D = createNoise2D();
const tileSize = 1;

export const BiomesByElevation = [
    {
        biome: "ocean",
        elevation_range: [-1, -0.1],
        color: [0, 0, 255]
    },
    {
        biome: "lake",
        elevation_range: [-0.1, 0],
        color: [39, 142, 173]
    },
    {
        biome: "beach",
        elevation_range: [0, 0.1],
        color: [255, 255, 0]
    },
    {
        biome: "plains",
        elevation_range: [0.1, 0.55],
        color: [0, 128, 0]
    },
    {
        biome: "hills",
        elevation_range: [0.55, 0.75],
        color: [0, 100, 0]
    },
    {
        biome: "mountains",
        elevation_range: [0.75, 0.85],
        color: [128, 128, 128]
    },
    {
        biome: "snowy_mountains",
        elevation_range: [0.85, 1],
        color: [255, 255, 255]
    }
] as const

export const BiomesByMoisture = []

const ELEVATION_FREQUENCY = 0.0043; // how often elevation changes

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
    let map: MapTile[][] = [];

    for (let y = 0; y < height; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            const elevation = getNoise(x, y)

            let tileType = determineBiome(elevation)
            row.push(tileType);
        }
        map.push(row);
    }

    return map;
}

function determineBiome(elevation: number) {
    let tileType = BiomesByElevation.find(biome => biome.biome === "ocean")
    for (const biome of BiomesByElevation) {
        if (elevation >= biome.elevation_range[0] && elevation < biome.elevation_range[1]) {
            biome["elevation"] = elevation;
            tileType = biome
        }
    }
    return tileType
}
