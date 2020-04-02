import WebSocket from 'ws'

const port = 3200
const history: { [id: string]: any } = {}
const wss = new WebSocket.Server({ port: port })

console.log('[' + (new Date).toISOString() + '] Listening on ' + port)

wss.on('connection', (ws: any) => {

    console.log('[' + (new Date).toISOString() + '] New client')

    ws.on('close', () => {
        console.log('[' + (new Date).toISOString() + '] Client disconnected')
    })

    ws.on('message', (data: any) => {
        console.log('[' + (new Date).toISOString() + '] Received: ' + data)
        const message = JSON.parse(data)
        switch (message.type) {
            case 'CONNECT':
                console.log('[' + (new Date).toISOString() + '] Client connected on ' + message.payload.storeId)
                ws.storeId = message.payload.storeId
                if (history[message.payload.storeId] == undefined) {
                    history[message.payload.storeId] = []
                }
                for (const data of history[message.payload.storeId]) {
                    ws.send(JSON.stringify(data))
                }
                ws.send(JSON.stringify({
                    type: 'CONNECTED',
                    payload: {
                        storeId: message.payload.storeId
                    }
                }))
                break
            case 'BROADCAST':
                history[message.payload.storeId].push(message.payload.action)
                wss.clients.forEach((client: any) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN && client.storeId == message.payload.storeId) {
                        client.send(JSON.stringify(message.payload.action));
                    }
                });
                break
        }
    });
})
