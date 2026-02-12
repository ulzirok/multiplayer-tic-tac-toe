require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const expressWs = require('express-ws')(app);
const aWss = expressWs.getWss();
const socketHandler = require('./socket/socketHandler');
const router = require('./routes/api.routes');
const { handleClose } = require('./socket/socketController')

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use(cors({
    origin: ['http://localhost:5173', 'https://frontend.com'] }));

app.use('/api', router);

app.ws('/api/lobby', (ws) => {
    ws.on('message', (msg) => socketHandler(ws, msg, aWss));
    ws.on('close', () => handleClose(ws, aWss));
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
