const express = require('express')
const router = express.Router()
const fs = require("fs")
let jsonArray = []
const functionFolders = fs.readdirSync('info/json')
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`info/json/${folder}`).filter(file => file.endsWith('json'))
    let objOfFiles = { type: folder, data: [] };
    for (const file of functionFiles) {
        const functionRead = fs.readFileSync(`info/json/${folder}/${file}`)
        const data = JSON.parse(functionRead)
        objOfFiles.data.push(data);
    }
    jsonArray.push(objOfFiles)
}

router.get('/', async (req, res) => {
    res.json(jsonArray)
})

router.get('/:type', getJSON, async (req, res) => {
    res.status(201).json(res.data)
})

router.get('/:type/:id', getJSONFiles, async (req, res) => {
    res.status(201).json(res.data)
})

function getJSON(req, res, next) {
    let json;
    try {
        json = jsonArray.find(obj => obj.type === req.params.type)
        if (!json) {
            return res.status(404).json({ message: "Invalid Folder" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.data = json;
    next()
}

function getJSONFiles(req, res, next) {
    let json;
    try {
        json = jsonArray.find(obj => obj.type === req.params.type);
        if (!json) {
            return res.status(404).json({ message: "Invalid Folder" });
        }
        const data = json.data;
        json = data.filter(function (entry) {
            if (Number(entry.id) === Number(req.params.id)) {
                return true;
            }
            return false;
        })
        if (!json) {
            return res.status(403).json({ message: "Invalid File" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.data = json[0];
    next()
}

module.exports = router;
