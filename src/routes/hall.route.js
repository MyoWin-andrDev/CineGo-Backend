const hallController = require('../controllers/hall.controller');
const router = require('express').Router();

router.post('/', hallController.createHallInCinema);
router.get('/', hallController.getAllHall)

module.exports = router;