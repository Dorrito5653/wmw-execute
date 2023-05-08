import * as ex from '../../node_modules/excalibur/build/esm/excalibur.js'
import * as socket from './socket.js'
import { Infantry, infantryImage } from './actors/infantry.js'
import { Aircraft, aircraftImage } from './actors/aircraft.js'
import { Tank, tankImage } from './actors/tank.js'
import { generateMap, TileType } from './map-generator.js'

const tileSize = 1

function drawTile(type: TileType, x: number, y: number) {
    let color = '#ffffff'
    switch (type) {
        case TileType.deepWater:
            color = 'blue'
            break
        case TileType.shallowWater:
            color = 'rgb(39, 142, 173)'
            break
        case TileType.beaches:
            color = 'yellow'
            break
        case TileType.plains:
            color = 'green'
            break
        case TileType.hills:
            color = 'darkgreen'
            break
        case TileType.mountains:
            color = 'gray'
            break
    }
    ctx.fillStyle = color
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
}

const canvas = document.querySelector('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
const map_noise_grid = generateMap(1280, 1280)


for (let i = 0; i < map_noise_grid.length; i++) {
    const row = map_noise_grid[i]
    for (let j = 0; j < row.length; j++) {
        const noise = map_noise_grid[i][j]
        drawTile(noise, j, i)
    }
}

// const game = new ex.Engine({
//     canvasElement: canvas,
// })

// var countryNameElement = document.getElementById('country-name')

function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        } 
    );
}    
document.querySelectorAll('.sidemenu button').forEach(element => {
    element.setAttribute('title', toTitleCase(element.id.replace('-', ' ')))
    element.addEventListener('click', ev => {
        let content = element.querySelector('div')

        if (content.style.display === 'none') {
            content.style.display = 'inherit'
        } else {
            content.style.display = 'none'
        }
    })
});

// countryNameElement.oninput = (ev) => {
//     socket.edit({ "country-name": countryNameElement.innerText })
// }

// const loader = new ex.Loader()

// loader.addResource(new socket.LoadSocket(function () { }))
// loader.addResource(tankImage)
// loader.addResource(infantryImage)
// loader.addResource(aircraftImage)

// loader.playButtonText = 'Play!'
// loader.backgroundColor = 'linear-gradient(to right, black, navy)'
// loader.logo = 'data:image/png;base64,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'
// loader.logoHeight = 400
// loader.logoWidth = 400
// // loader.logoPosition = new ex.Vector()

// var tank = new Tank({
//     type: "Heavy Tank"
// })
// tank.pos.x = 150
// tank.pos.y = 100
// tank

// game.start(loader)

// game.currentScene.add(tank)
