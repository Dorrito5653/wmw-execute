const token = localStorage.getItem('token')

if (token) {
    const http = new XMLHttpRequest()
    http.open("GET", `localhost:5000/users/`, true)
    http.setRequestHeader('token', token)
    http.onload = () => {
        const response = JSON.parse(http.response)
        document.getElementById('player-username').innerHTML = response.username
    }
    
} else {
    const welcome = document.getElementById('welcome')
    welcome.remove()
}
