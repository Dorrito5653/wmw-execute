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

