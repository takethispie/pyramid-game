const express = require('express')
const app = express()
const port = 3200
const actions = []

app.use(require('body-parser').json())

app.post('/actions', (req, res) => {
    const index = req.body.index
    console.log('[' + actions.length + '] received: [' + index + '] ' + req.body.action.type)
    if (actions.length == index) {
        if (req.body.action.type != 'SYNC') {
            console.log('accepted -> push action')
            actions.push(req.body.action)
        }
        res.end()
    } else {
        console.log('client is out-of-date -> send history')
        res.status(409).json({
            index: index,
            actions: actions.slice(index)
        })
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`))