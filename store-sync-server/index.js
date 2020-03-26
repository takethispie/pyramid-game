const port = 3200
const WebSocket = require('ws')

const history = []

const wss = new WebSocket.Server({ port: port })
console.log('Listening on ' + port)

wss.on('connection', ws => {
    console.log('Client connected (' + [...wss.clients].length + ' clients connected)')

    ws.on('close', () => {
        console.log('Client disconnected (' + [...wss.clients].length + ' clients connected)')
    })

    for (const data of history) {
        ws.send(data)
    }

    ws.on('message', function incoming(data) {
        history.push(data)
        console.log('Received: ' + data)
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
})

