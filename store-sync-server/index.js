const express = require('express')
const app = express()
const port = 3200
const actions = []
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3201 });
wss.on('connection', function connection(ws) {
    console.log('Connected: ' + ws)
});

app.use(require('body-parser').json())

app.post('/actions', (req, res) => {
    const index = req.body.index
    console.log('[' + actions.length + '] received: [' + index + '] ' + req.body.action.type)
    if (req.body.action.type == 'MULTI_ACTION') {
        for (const action of req.body.action.payload.actions) {
            console.log('\t' + action.type)
        }
    }
    if (actions.length == index) {
        if (req.body.action.type != 'SYNC') {
            console.log('accepted -> push action')
            actions.push(req.body.action)
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('SYNC');
                }
            });
        }
        res.end()
    } else {
        const start = index < actions.length ? index : 0
        console.log('client is out-of-date -> send history starting at ' + start)
        console.log(actions.slice(start))
        res.status(409).json({
            index: index,
            actions: actions.slice(start)
        })
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`))