import * as ex from '../../../node_modules/excalibur/build/esm/excalibur.js'
import { BiomesByElevation } from '../map-generator.js'

class Tile extends ex.Tile {
    data: MapTile
}

export class TileMapClass extends ex.TileMap {
    rawData: MapTile[][]
    tiles: Tile[]

    constructor(map: MapTile[][]) {
        super({
            rows: map.length,
            columns: map[0].length,
            tileHeight: 1,
            tileWidth: 1
        })
        this.rawData = map
    }

    onInitialize(_engine: ex.Engine): void {
        for (const tile of this.tiles) {
            tile.data = this.rawData[tile.y][tile.x]
        }
    }
    
    draw(ctx: ex.ExcaliburGraphicsContext, elapsedMilliseconds: number): void {
        for (const tile of this.tiles) {
            ctx.drawRectangle(
                new ex.Vector(tile.x * tile.width, tile.y * tile.height),
                tile.width,
                tile.height,
                new ex.Color(...tile.data.color)
            )
        }
    }
}
