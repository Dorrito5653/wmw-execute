import * as ex from '../../../node_modules/excalibur/build/esm/excalibur.js'
import { BiomesByElevation } from '../map-generator.js'

let graphicsArray: ex.Rectangle[] = []

for (let biome of BiomesByElevation) {
    let color = biome.color
    let r = color[0],
        g = color[1],
        b = color[2]
    graphicsArray.push(new ex.Rectangle({
        color: new ex.Color(r, g, b),
        width: 20,
        height: 20
    }))
}


export class TileMapClass extends ex.TileMap {
    rawData: MapTile[][]

    constructor(map: MapTile[][]) {
        super({
            columns: 600,
            rows: 800,
            tileHeight: 1,
            tileWidth: 1
        })
        this.changeMap(map)
    }

    changeMap(map: MapTile[][]) {
        this.rawData = map

        for (const tile of this.tiles) {
            let data = this.rawData[tile.y][tile.x],
                color = data.color
            tile.data = data
            tile.clearGraphics()
            let r = color[0],
                g = color[1],
                b = color[2],
                graphic
            
            for (let gr of graphicsArray) {
                if (
                    gr.color.r == r &&
                    gr.color.g == g &&
                    gr.color.b == b
                ) {
                    graphic = gr
                    break
                }
            }
            
            tile.addGraphic(graphic)
            console.log(data)
        }
    }
}
