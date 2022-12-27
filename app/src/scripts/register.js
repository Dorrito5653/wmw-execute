async function registerBySubmit(){
    let email = document.querySelector('#email').value
    let password = document.querySelector('#password').value
    let username = document.querySelector('#username').value

    if (password.length > 20 || username.length > 20) {
        alert('Passwords or usernames cannot be greater than length: 20') 
        return
    }

    const req = new XMLHttpRequest()
    req.open("GET", `http://localhost:3000/acc/${username}`, true)
    req.send()
    req.onload = function(){
        //return since request loaded so user exists
        if (req.status == 201){ 
            alert('User already exists')
            return
        }
    }

    let data = {
        'username': username,
        'password': password,
        'email': email,
        'VIP': false,
        'created_date': Date.now(),
        'updated_date': Date.now(),
        'xp': 0,
        'level': 0,
        'resources': [
            {
                id: 1,
                amount: 6
            },
            {
                id: 14,
                amount: 2
            }
        ]
    }
    const postreq = new XMLHttpRequest()
    postreq.open("POST", `http://localhost:3000/acc`, true)
    postreq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    postreq.send(JSON.stringify(data))

    alert("Account successfully created")
}

