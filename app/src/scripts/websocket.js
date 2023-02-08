import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io("ws://localhost:5555");


socket.io.on('connect', () => {
    socket.send('hello world!')
})

socket.io.on('error', (error) => {
    console.error(error)
})

