const router = require('express').Router();
const jwt = require('jsonwebtoken');
const movieController = require('../controllers/movie.controller');

const ratingAuthMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            conn: false,
            msg: 'No token, authorization denied',
            result: null
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({
            conn: false,
            msg: 'Token is not valid',
            result: null
        });
    }
};

router.get('/sync', movieController.syncNowPlaying)
router.get('/', movieController.getNowPlayingMovie)
router.get('/upcoming', movieController.getUpcomingMovie)
router.post('/:movieId/rating', ratingAuthMiddleware, movieController.rateMovie)
router.get('/:movieId/rating', movieController.getMovieRating)
router.get('/:movieId/rating/me', ratingAuthMiddleware, movieController.getMyRating)
router.get('/:movieId/cinema', movieController.getCinemasByMovie)

module.exports = router;
