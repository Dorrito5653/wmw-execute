import * as ex from '../../node_modules/excalibur/build/dist/excalibur.js'


class LoadSocket implements ex.Loadable<WebSocket> {
    data: WebSocket;
    onopen: (ev: Event) => any
    
    constructor (onopen: (ev: Event) => any) {
        this.onopen = onopen
    }

    async load() {
        socket = new WebSocket('ws://127.0.0.1:5555')
        socket.onopen = this.onopen
        return socket
    }

    isLoaded(): boolean {
        return this.data.readyState == this.data.OPEN
    }
}

let socket: WebSocket;

function socketSend(data: WebSocketMessage) {
    socket.send(JSON.stringify(data))
    
}

function edit(edits: EditMessage) {
    socketSend({
        type: 'edit',
        value: edits
    })
}

function join(data: JoinMessage) {
    socketSend({
        type: 'join',
        value: data
    })
}

function init(data: any){
    socketSend({
        type: 'init',
        value: data
    })
}

export { edit, socketSend, socket, LoadSocket, join, init }
