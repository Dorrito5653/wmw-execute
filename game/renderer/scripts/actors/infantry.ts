import * as ex from '../../../node_modules/excalibur/build/esm/excalibur.js'
import { Unit } from './unit.js'

export const infantryImage = new ex.ImageSource('../assets/unit-icons/infantry.png')

export class Infantry extends Unit {
    constructor({
        number = 10_000,
        level = 1,
    }) {
        super({
            width: 10,
            height: 10,
            number: number || 200,
            level: level || 1,
            icon: infantryImage
        })
    }
}
