const router = require('express').Router();
const movieController = require('../controllers/movie.controller');

router.get('/sync', movieController.syncNowPlaying)
router.get('/', movieController.getNowPlayingMovie)
router.get('/:movieId/cinema', movieController.getCinemasByMovie)

module.exports = router;