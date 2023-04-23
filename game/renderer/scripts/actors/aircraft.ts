import * as ex from '../../../node_modules/excalibur/build/esm/excalibur.js'
import { Unit } from './unit.js'

export const aircraftImage = new ex.ImageSource('../assets/unit-icons/aircraft.png')

interface ConstructorArgs {
    number?: number,
    level?: number,
    type?: AircraftType,
}


export class Aircraft extends Unit {
    type: AircraftType

    constructor(args: ConstructorArgs) {
        super({
            width: 10,
            height: 10,
            number: args.number || 100,
            level: args.level || 1,
            icon: aircraftImage
        })
        this.type = args.type
    }
}