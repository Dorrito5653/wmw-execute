var countryNameElement = document.getElementById('country-name')
if (countryNameElement == null) throw new Error("country name is null");


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
        if (content == null) throw new Error("element is null");
        
        if (content.style.display === 'none') {
            content.style.display = 'inherit'
        } else {
            content.style.display = 'none'
        }
    })
});

const socket = new WebSocket('ws://127.0.0.1:5555')

function socketSend(data: WebSocketMessage) {
    socket.send(JSON.stringify(data))
}

function edit(edits: EditMessage) {
    socketSend({
        type: 'edit',
        value: edits
    })
}

socket.onopen = (ev) => {
    if (countryNameElement == null) throw new Error("country name is null");
    socketSend({
        type: 'init',
        value: { 'country-name': countryNameElement.innerText }
    })
}

countryNameElement.oninput = (ev) => {
    if (countryNameElement == null) throw new Error("country name is null");
    edit({ "country-name": countryNameElement.innerText })
}
