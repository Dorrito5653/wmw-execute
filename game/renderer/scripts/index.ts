class LoadSocket implements ex.Loadable<WebSocket> {
    data: WebSocket;

    async load() {
        socket = new WebSocket('ws://127.0.0.1:5555')
        socket.onopen = onSocketOpen
        return socket
    }

    isLoaded(): boolean {
        return this.data.readyState == this.data.OPEN
    }
}

let socket: WebSocket;
const canvas = document.querySelector('canvas')
const game = new ex.Engine({
    canvasElement: canvas,
})

var countryNameElement = document.getElementById('country-name')

function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

document.querySelectorAll('.sidemenu button').forEach(element => {
    element.setAttribute('title', toTitleCase(element.id.replace('-', ' ')))
    element.addEventListener('click', ev => {
        let content = element.querySelector('div')
        
        if (content.style.display === 'none') {
            content.style.display = 'inherit'
        } else {
            content.style.display = 'none'
        }
    })
});

function socketSend(data: WebSocketMessage) {
    socket.send(JSON.stringify(data))
}

function edit(edits: EditMessage) {
    socketSend({
        type: 'edit',
        value: edits
    })
}

function onSocketOpen(ev: Event) {
    socketSend({
        type: 'init',
        value: { 'country-name': countryNameElement.innerText }
    })
}

countryNameElement.oninput = (ev) => {
    edit({ "country-name": countryNameElement.innerText })
}

const loader = new ex.Loader()

loader.addResource(new LoadSocket())


loader.playButtonText = 'Play!'
loader.backgroundColor = 'linear-gradient(to right, black, navy)'

game.start(loader)
