import * as ex from '../../../node_modules/excalibur/build/esm/excalibur.js'
import { Unit } from './unit.js'

export const tankImage = new ex.ImageSource('../assets/unit-icons/tank.png')

interface ConstructorArgs {
    number?: number,
    level?: number,
    type?: TankType,
}

export class Tank extends Unit {
    type: TankType

    constructor(args: ConstructorArgs) {
        super({
            width: 10,
            height: 10,
            number: args.number || 200,
            level: args.level || 1,
            icon: tankImage
        })
        this.type = args.type || "Light Tank"
    }
}
