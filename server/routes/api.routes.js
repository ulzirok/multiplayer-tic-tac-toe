const Router = require('express');
const router = new Router();
const authController = require('../controllers/auth.controller')
const roomController = require('../controllers/room.controller')
const statsController = require('../controllers/stats.controller')

router.post('/create-session', authController.createSession);
router.get('/rooms', roomController.getRooms);
router.get('/user-stats', statsController.getStats);

module.exports = router;
