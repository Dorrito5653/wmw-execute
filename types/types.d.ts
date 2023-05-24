type messageType = "edit" | "init" | "join"

interface EditMessage {
    'country-name'?: string
}

interface JoinMessage {
    id: number
}

type SocketMessageValue = EditMessage | JoinMessage

interface JoinSocketMessage {
    type: "join",
    value: JoinMessage
}

interface InitSocketMessage {
    type: "init",
    value: any,
}

interface EditSocketMessage {
    type: "edit",
    value: EditMessage,
}

type WebSocketMessage = InitSocketMessage | JoinSocketMessage | EditSocketMessage

interface IntToObject {
    [key: number]: {
        
    };
}


declare class Game {
    id: number

    constructor (
        id: number
    )
}

interface MapTile extends Map<string, any> {
    biome: string,
    elevation_range: [number, number],
    color: [number, number, number],
    elevation: number
}
