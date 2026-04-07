module.exports = {
    NowPlayingMovie: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                example: '697b32a47cbd63295511ec01',
            },
            tmdbId: {
                type: 'number',
                example: 1419406,
            },
            title: {
                type: 'string',
                example: "The Shadow's Edge",
            },
            overview: {
                type: 'string',
            },
            posterPath: {
                type: 'string',
            },
            backdropPath: {
                type: 'string',
            },
            trailer: {
                type: 'string',
                example: 'dQw4w9WgXcQ',
                description: 'App trailer key: first TMDB video with site=YouTube and type=Trailer. Stores key only; falls back to empty string.',
            },
            rating: {
                type: 'number',
                example: 7.2,
            },
            voteAverage: {
                type: 'number',
                example: 7.2,
                description: 'TMDB vote average (external data, not app-user rating).',
            },
            voteCount: {
                type: 'number',
                example: 1240,
                description: 'TMDB vote count (external data, not app-user rating).',
            },
            userRatingAverage: {
                type: 'number',
                example: 8.5,
                description: 'Average rating from app users for Now Playing movies only.',
            },
            userRatingCount: {
                type: 'number',
                example: 42,
                description: 'Total app-user rating count for Now Playing movies only.',
            },
            releaseDate: {
                type: 'string',
                format: 'date-time',
            },
            teaser: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        key: { type: 'string' },
                        type: { type: 'string' },
                    },
                },
            },
            images: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string' },
                    },
                },
            },
            genres: {
                type: 'array',
                items: { type: 'string' },
            },
            casters: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        profilePath: { type: 'string' },
                    },
                },
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
            },
        },
    },
    UpcomingMovie: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                example: '697b32a47cbd63295511ec02',
            },
            tmdbId: {
                type: 'number',
                example: 1512345,
            },
            title: {
                type: 'string',
                example: 'Galaxy Run',
            },
            overview: {
                type: 'string',
            },
            posterPath: {
                type: 'string',
            },
            backdropPath: {
                type: 'string',
            },
            trailer: {
                type: 'string',
                example: '',
                description: 'App trailer key: first TMDB video with site=YouTube and type=Trailer. Stores key only; falls back to empty string.',
            },
            rating: {
                type: 'number',
                example: 0,
            },
            voteAverage: {
                type: 'number',
                example: 0,
                description: 'TMDB vote average (external data, not app-user rating).',
            },
            voteCount: {
                type: 'number',
                example: 0,
                description: 'TMDB vote count (external data, not app-user rating).',
            },
            releaseDate: {
                type: 'string',
                format: 'date-time',
            },
            teaser: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        key: { type: 'string' },
                        type: { type: 'string' },
                    },
                },
            },
            images: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string' },
                    },
                },
            },
            genres: {
                type: 'array',
                items: { type: 'string' },
            },
            casters: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        profilePath: { type: 'string' },
                    },
                },
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
            },
        },
    },
    NowPlayingMoviesResponse: {
        type: 'object',
        properties: {
            con: { type: 'boolean', example: true },
            conn: { type: 'boolean', example: true },
            msg: { type: 'string', example: 'Now Playing Movie' },
            result: {
                type: 'array',
                items: { $ref: '#/components/schemas/NowPlayingMovie' },
            },
        },
    },
    NowPlayingMovieDetailResponse: {
        type: 'object',
        properties: {
            con: { type: 'boolean', example: true },
            conn: { type: 'boolean', example: true },
            msg: { type: 'string', example: 'Now Playing Movie Detail' },
            result: { $ref: '#/components/schemas/NowPlayingMovie' },
        },
    },
    UpcomingMoviesResponse: {
        type: 'object',
        properties: {
            con: { type: 'boolean', example: true },
            conn: { type: 'boolean', example: true },
            msg: { type: 'string', example: 'Coming Soon Movie' },
            result: {
                type: 'array',
                items: { $ref: '#/components/schemas/UpcomingMovie' },
            },
        },
    },
    UpcomingMovieDetailResponse: {
        type: 'object',
        properties: {
            con: { type: 'boolean', example: true },
            conn: { type: 'boolean', example: true },
            msg: { type: 'string', example: 'Upcoming Movie Detail' },
            result: { $ref: '#/components/schemas/UpcomingMovie' },
        },
    },
    WeeklyMovieSyncResponse: {
        type: 'object',
        properties: {
            con: { type: 'boolean', example: true },
            conn: { type: 'boolean', example: true },
            msg: { type: 'string', example: 'Movies & TimeSlots synced' },
            result: {
                type: 'object',
                properties: {
                    movies: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/NowPlayingMovie' },
                    },
                    upcomingMovies: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/UpcomingMovie' },
                    },
                    assignment: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                cinemaId: { type: 'string' },
                                cinemaName: { type: 'string' },
                                movieId: { type: 'string' },
                                movieTitle: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
    },
    MovieRatingRequest: {
        type: 'object',
        required: ['rating'],
        properties: {
            rating: {
                type: 'integer',
                minimum: 1,
                maximum: 10,
                example: 9,
                description: 'Star-based integer rating from 1 to 10.'
            }
        }
    },
    Review: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '67d320c2ad258ca0fcf57e01' },
            movie: { type: 'string', example: '67d320c2ad258ca0fcf57c11' },
            user: { type: 'string', example: '67d31fc5ad258ca0fcf57077' },
            rating: { type: 'integer', example: 9 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        }
    },
    MovieRatingUpsertResponse: {
        type: 'object',
        properties: {
            conn: { type: 'boolean', example: true },
            msg: { type: 'string', example: 'Rating submitted successfully' },
            result: {
                type: 'object',
                properties: {
                    movieId: { type: 'string', example: '67d320c2ad258ca0fcf57c11' },
                    rating: { type: 'integer', example: 9 },
                    userRatingAverage: { type: 'number', example: 8.5 },
                    userRatingCount: { type: 'number', example: 42 },
                }
            },
        },
    },
    MovieRatingSummaryResponse: {
        type: 'object',
        properties: {
            conn: { type: 'boolean', example: true },
            msg: { type: 'string', example: 'Movie rating summary' },
            result: {
                type: 'object',
                properties: {
                    movieId: { type: 'string', example: '67d320c2ad258ca0fcf57c11' },
                    userRatingAverage: { type: 'number', example: 8.5 },
                    userRatingCount: { type: 'number', example: 42 },
                }
            },
        },
    },
    MovieMyRatingResponse: {
        type: 'object',
        properties: {
            conn: { type: 'boolean', example: true },
            msg: { type: 'string', example: 'My movie rating' },
            result: {
                type: 'object',
                properties: {
                    movieId: { type: 'string', example: '67d320c2ad258ca0fcf57c11' },
                    rating: {
                        oneOf: [
                            { type: 'integer', example: 8 },
                            { type: 'null', example: null }
                        ]
                    },
                }
            },
        },
    },
    MovieRatingErrorResponse: {
        type: 'object',
        properties: {
            conn: { type: 'boolean', example: false },
            msg: { type: 'string', example: 'Movie not found' },
            result: {
                type: 'null',
                example: null
            }
        }
    },
};
