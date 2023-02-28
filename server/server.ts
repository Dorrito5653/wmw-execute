import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 5555 });
const games: IntToObject = {}

function join(gameId: number) {
    
}

server.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', function message(data: WebSocketMessage) {
        console.log('recieved: %s', data)
        if (data.type == 'join') {
            join(data.value.id)
        }
    })
})