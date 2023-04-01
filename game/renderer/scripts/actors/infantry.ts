import * as ex from '../../../node_modules/excalibur/build/dist/excalibur.js'

export class Infantry extends ex.Actor {
    soldiers: number
    level: number
    // https://excaliburjs.com/docs/actors/#custom-actors
    constructor({
        soldiers = 10_000,
        level = 1,
    }) {
        super({
            width: 10,
            height: 10,
        })
        this.soldiers = soldiers
        this.level = level
    }
}
