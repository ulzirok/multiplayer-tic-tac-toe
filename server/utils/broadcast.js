module.exports = (aWss, roomId, data) => {
    aWss.clients.forEach(client => {
        if (client.roomId === roomId) {
            client.send(JSON.stringify(data));
        }
    });
};
