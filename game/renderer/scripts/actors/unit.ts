import * as ex from '../../../node_modules/excalibur/build/esm/excalibur.js'

export abstract class Unit extends ex.Actor {
    number: number
    level: number
    combatExperience: number
    terrainEffects: object
    icon: ex.ImageSource
    sprite: ex.Sprite

    constructor({
        number = 10_000,
        level = 1,
        width,
        height,
        icon
    }) {
        super({
            width: width,
            height: height,
        })
        this.number = number
        this.level = level
        this.combatExperience = 0
        this.icon = icon

        this.sprite = this.icon.toSprite()
        this.sprite.width = 25
        this.sprite.height = 25

        this.graphics.use(this.sprite)
    }
}
