const express = require("express");
const router = express.Router();
const Account = require('../models/accounts')
const bcrypt = require("bcrypt")

router.get('/', async(req, res) => {
    try {
        if (req.headers['sessionId']) {
            const accBySessionId = await Account.find({ sessionId: req.headers['sessionId'] })
            res.json(accBySessionId)
        } else {
            res.status(403).json("Nice try, but we won't give you all of our account info lol.")
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:username', getAcc, async (req, res) => {
    let user = await Account.find(req.body.username)
    if (!req.headers['password']) return;
    const check = await bcrypt.compare(req.headers['password'], user[0].password);
    if (check == false) {
        res.status(403).json("Incorrect Password")
        return
    }
    res.status(201).json(res.acc)
})

router.post('/', async (req, res) => {
    const acc = new Account({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        VIP: req.body.VIP,
        sessionId: req.body.sessionId,
        created_date: Date.now(),
        updated_date: Date.now(),
        country: {
            name: "",
            terrain: []
        },
        resources: [],
        commanders: [],
        buildings: [],
        weapons: [],
        recruits: [],
    })
})

async function getAcc(req, res, next){
    let acc;
    try {
        acc = await Account.find({ username: req.params.username })
        if (acc.length == 0) {
            return res.status(404).json({ message: "Cannot find account"})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.acc = acc;
    next()
}

module.exports = router;