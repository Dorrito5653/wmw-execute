import * as ex from '../../../node_modules/excalibur/build/esm/excalibur.js'
import { Unit } from './unit.js'

export const shipImage = new ex.ImageSource('../assets/unit-icons/navy.png')

interface ConstructorArgs {
    number?: number,
    level?: number,
    type?: NavyType,
}

export class Ship extends Unit {
    type: NavyType

    constructor(args: ConstructorArgs) {
        super({
            width: 10,
            height: 10,
            number: args.number || 100,
            level: args.level || 1,
            icon: shipImage
        })
        this.type = args.type
    }
}
