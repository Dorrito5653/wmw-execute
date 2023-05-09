import { createNoise2D } from '../../node_modules/simplex-noise/dist/esm/simplex-noise.js';

const noise2D = createNoise2D();
const tileSize = 1;
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

export const BiomesByElevation = [
    {
        biome: "ocean",
        elevation_range: [-1, -0.1],
        color: "blue"
    },
    {
        biome: "lake",
        elevation_range: [-0.1, 0],
        color: "rgb(39, 142, 173)"
    },
    {
        biome: "beach",
        elevation_range: [0, 0.1],
        color: "yellow"
    },
    {
        biome: "plains",
        elevation_range: [0.1, 0.55],
        color: "green"
    },
    {
        biome: "hills",
        elevation_range: [0.55, 0.75],
        color: "darkgreen"
    },
    {
        biome: "mountains",
        elevation_range: [0.75, 0.85],
        color: "gray"
    },
    {
        biome: "snowy_mountains",
        elevation_range: [0.85, 1],
        color: "white"
    }
]

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
    let map: {biome: string, elevation_range: [], color: string, elevation: number}[][] = [];
    let poles: number[][] = [[], []];
    const north_pole_ratio = 1/15;
    const south_pole_ratio = 14/15;

    for (let x = 0; x < width; x++) {
        let row = [];
        for (let y = 0; y < height; y++) {
            const elevation = getNoise(x, y)

            let tileType = determineBiome(elevation)
            row.push(tileType);
        }
        map.push(row);
    }

    for (let i = 0; i < map.length; i++) {
        const row = map[i];
        for (let j = 0; j < row.length; j++) {
            const color = map[i][j].color;
            ctx.fillStyle = color;
            ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize)
        }
    }

    return map;
}

function determineBiome(elevation: number) {
    let tileType = BiomesByElevation.find(biome => biome.biome = "ocean")
    for (const biome of BiomesByElevation) {
        if (elevation >= biome.elevation_range[0] && elevation < biome.elevation_range[1]) {
            biome["elevation"] = elevation;
            tileType = biome
        }
    }
    return tileType
}