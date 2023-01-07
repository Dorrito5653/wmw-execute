let leaderboardString

const table = document.querySelector('#table')

const http = new XMLHttpRequest()
http.open("GET", `localhost:5000/users`, true)
http.onload = () => {
    leaderboardString = JSON.parse(http.response).message
}
