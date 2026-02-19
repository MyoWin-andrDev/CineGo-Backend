const cinemaController = require('../controllers/cinema.controller');
const router = require('express').Router();

router.post('/create', cinemaController.createCinema);
router.get('/', cinemaController.getCinemas);

module.exports = router;