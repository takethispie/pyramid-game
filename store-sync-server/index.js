const port = 3200
const WebSocket = require('ws')

const history = {}

const wss = new WebSocket.Server({ port: port })

console.log('Listening on ' + port)

wss.on('connection', ws => {

    ws.on('close', () => {
        console.log('Client disconnected')
    })

    ws.on('message', function incoming(data) {
        console.log('Received: ' + data)
        const message = JSON.parse(data)
        switch (message.type) {
            case 'CONNECT':
                console.log('Client connected on ' + message.payload.storeId)
                ws.storeId = message.payload.storeId
                if (history[message.payload.storeId] == undefined) {
                    history[message.payload.storeId] = []
                }
                for (const data of history[message.payload.storeId]) {
                    ws.send(JSON.stringify(data))
                }
                break
            case 'BROADCAST':
                history[message.payload.storeId].push(message.payload.action)
                wss.clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN && client.storeId == message.payload.storeId) {
                        client.send(JSON.stringify(message.payload.action));
                    }
                });
                break
        }
    });
})
