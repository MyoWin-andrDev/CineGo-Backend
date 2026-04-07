module.exports = {
    paths: {
        '/api/v1/movie': {
            get: {
                tags: ['Movies'],
                summary: 'Get Now Playing movies',
                description: 'Movie includes `trailer` as a single string key selected from TMDB videos (first item where site=YouTube and type=Trailer). If none exists, `trailer` is an empty string.',
                responses: {
                    200: {
                        description: 'Now Playing movie list',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/NowPlayingMoviesResponse' },
                                examples: {
                                    nowPlaying: {
                                        summary: 'Now Playing response',
                                        value: {
                                            con: true,
                                            conn: true,
                                            msg: 'Now Playing Movie',
                                            result: [
                                                {
                                                    _id: '67d320c2ad258ca0fcf57c11',
                                                    tmdbId: 1419406,
                                                    title: "The Shadow's Edge",
                                                    releaseDate: '2026-03-06T00:00:00.000Z',
                                                    rating: 7.2,
                                                    voteAverage: 7.2,
                                                    voteCount: 1240,
                                                    userRatingAverage: 8.5,
                                                    userRatingCount: 42,
                                                    overview: 'An ex-agent is forced back into action.',
                                                    posterPath: '/poster.jpg',
                                                    backdropPath: '/backdrop.jpg',
                                                    trailer: 'dQw4w9WgXcQ',
                                                    teaser: [],
                                                    images: [],
                                                    genres: ['Action', 'Thriller'],
                                                    casters: [
                                                        { name: 'Ava Clarke', profilePath: '/ava.jpg' }
                                                    ],
                                                    createdAt: '2026-03-14T05:00:00.000Z',
                                                    updatedAt: '2026-03-14T05:00:00.000Z'
                                                }
                                            ]
                                        }
                                    }
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/movie/{movieId}': {
            get: {
                tags: ['Movies'],
                summary: 'Get Now Playing movie detail by MongoDB _id',
                parameters: [
                    {
                        name: 'movieId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Now Playing movie detail',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/NowPlayingMovieDetailResponse' },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid movieId',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    invalidMovieId: {
                                        value: {
                                            con: false,
                                            conn: false,
                                            msg: 'Invalid movieId',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Now Playing movie not found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    movieNotFound: {
                                        value: {
                                            con: false,
                                            conn: false,
                                            msg: 'Now Playing movie not found',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            },
        },
        '/api/v1/movie/upcoming': {
            get: {
                tags: ['Movies'],
                summary: 'Get Upcoming / Coming Soon movies',
                description: 'Movie includes `trailer` as a single string key selected from TMDB videos (first item where site=YouTube and type=Trailer). If none exists, `trailer` is an empty string.',
                responses: {
                    200: {
                        description: 'Upcoming movie list',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UpcomingMoviesResponse' },
                                examples: {
                                    upcoming: {
                                        summary: 'Upcoming response',
                                        value: {
                                            con: true,
                                            conn: true,
                                            msg: 'Coming Soon Movie',
                                            result: [
                                                {
                                                    _id: '67d320c2ad258ca0fcf57d22',
                                                    tmdbId: 1512345,
                                                    title: 'Galaxy Run',
                                                    releaseDate: '2026-04-10T00:00:00.000Z',
                                                    rating: 0,
                                                    voteAverage: 0,
                                                    voteCount: 0,
                                                    userRatingAverage: 0,
                                                    userRatingCount: 0,
                                                    overview: 'A crew races against time in deep space.',
                                                    posterPath: '/galaxy.jpg',
                                                    backdropPath: '/galaxy-bg.jpg',
                                                    trailer: '',
                                                    teaser: [],
                                                    images: [],
                                                    genres: ['Sci-Fi'],
                                                    casters: [
                                                        { name: 'Noah Hart', profilePath: '/noah.jpg' }
                                                    ],
                                                    createdAt: '2026-03-14T05:00:00.000Z',
                                                    updatedAt: '2026-03-14T05:00:00.000Z'
                                                }
                                            ]
                                        }
                                    }
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/movie/upcoming/{movieId}': {
            get: {
                tags: ['Movies'],
                summary: 'Get Upcoming movie detail by MongoDB _id',
                parameters: [
                    {
                        name: 'movieId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Upcoming movie detail',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UpcomingMovieDetailResponse' },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid movieId',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    invalidMovieId: {
                                        value: {
                                            con: false,
                                            conn: false,
                                            msg: 'Invalid movieId',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Upcoming movie not found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    movieNotFound: {
                                        value: {
                                            con: false,
                                            conn: false,
                                            msg: 'Upcoming movie not found',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            },
        },
        '/api/v1/movie/sync': {
            get: {
                tags: ['Movies'],
                summary: 'Sync Now Playing and Upcoming movies + weekly timeslots',
                description: 'Manual sync endpoint. Uses the same flow as weekly cron sync (`0 0 * * 0`). On each successful run, existing Now Playing movies, Upcoming movies, and generated timeslots are replaced with the latest TMDB data. Sync also persists both `teaser` (array) and `trailer` (single key string). Trailer rule: first TMDB YouTube Trailer key, else empty string.',
                responses: {
                    200: {
                        description: 'Sync result for both movie collections',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/WeeklyMovieSyncResponse' },
                                examples: {
                                    syncBoth: {
                                        summary: 'Weekly sync including upcoming movies',
                                        value: {
                                            con: true,
                                            conn: true,
                                            msg: 'Movies & TimeSlots synced',
                                            result: {
                                                movies: [
                                                    {
                                                        _id: '67d320c2ad258ca0fcf57c11',
                                                        tmdbId: 1419406,
                                                        title: "The Shadow's Edge"
                                                    }
                                                ],
                                                upcomingMovies: [
                                                    {
                                                        _id: '67d320c2ad258ca0fcf57d22',
                                                        tmdbId: 1512345,
                                                        title: 'Galaxy Run'
                                                    }
                                                ],
                                                assignment: [
                                                    {
                                                        cinemaId: '67d31fc5ad258ca0fcf57021',
                                                        cinemaName: 'Downtown Cinema',
                                                        movieId: '67d320c2ad258ca0fcf57c11',
                                                        movieTitle: "The Shadow's Edge"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/movie/{movieId}/rating': {
            post: {
                tags: ['Movies'],
                summary: 'Create or update my rating for a Now Playing movie',
                description: 'Only Now Playing movies can be rated. Upcoming/Coming Soon movies are rejected. Rating must be an integer from 1 to 10. TMDB fields voteAverage and voteCount are not affected by app-user ratings.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'movieId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/MovieRatingRequest' },
                            examples: {
                                rateMovie: {
                                    summary: 'Rate with integer score',
                                    value: { rating: 9 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Rating created or updated',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingUpsertResponse' },
                                examples: {
                                    upserted: {
                                        value: {
                                            conn: true,
                                            msg: 'Rating submitted successfully',
                                            result: {
                                                movieId: '67d320c2ad258ca0fcf57c11',
                                                rating: 9,
                                                userRatingAverage: 8.5,
                                                userRatingCount: 42
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Invalid movieId or invalid rating (must be integer 1..10)',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    invalidRating: {
                                        value: {
                                            conn: false,
                                            msg: 'Rating must be an integer between 1 and 10',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    noToken: {
                                        value: {
                                            conn: false,
                                            msg: 'No token, authorization denied',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Now Playing movie not found (Upcoming movies cannot be rated)',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    movieNotFound: {
                                        value: {
                                            conn: false,
                                            msg: 'Now Playing movie not found. Upcoming movies cannot be rated.',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Movies'],
                summary: 'Get app-user rating summary for a Now Playing movie',
                description: 'Returns app-user rating summary only (userRatingAverage and userRatingCount). TMDB voteAverage/voteCount remain separate external fields.',
                parameters: [
                    {
                        name: 'movieId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Movie rating summary',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingSummaryResponse' },
                                examples: {
                                    summary: {
                                        value: {
                                            conn: true,
                                            msg: 'Movie rating summary',
                                            result: {
                                                movieId: '67d320c2ad258ca0fcf57c11',
                                                userRatingAverage: 8.5,
                                                userRatingCount: 42
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Invalid movieId',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    invalidMovieId: {
                                        value: {
                                            conn: false,
                                            msg: 'Invalid movieId',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Now Playing movie not found (Upcoming movies cannot be rated)',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    movieNotFound: {
                                        value: {
                                            conn: false,
                                            msg: 'Now Playing movie not found. Upcoming movies cannot be rated.',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/movie/{movieId}/rating/me': {
            get: {
                tags: ['Movies'],
                summary: 'Get my rating for a Now Playing movie',
                description: 'Authenticated endpoint. Returns the logged-in user rating or null if not rated yet.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'movieId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Logged-in user rating for movie',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieMyRatingResponse' },
                                examples: {
                                    myRating: {
                                        value: {
                                            conn: true,
                                            msg: 'My movie rating',
                                            result: {
                                                movieId: '67d320c2ad258ca0fcf57c11',
                                                rating: 8
                                            }
                                        }
                                    },
                                    notRatedYet: {
                                        value: {
                                            conn: true,
                                            msg: 'My movie rating',
                                            result: {
                                                movieId: '67d320c2ad258ca0fcf57c11',
                                                rating: null
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Invalid movieId',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    invalidMovieId: {
                                        value: {
                                            conn: false,
                                            msg: 'Invalid movieId',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    invalidToken: {
                                        value: {
                                            conn: false,
                                            msg: 'Token is not valid',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Now Playing movie not found (Upcoming movies cannot be rated)',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MovieRatingErrorResponse' },
                                examples: {
                                    movieNotFound: {
                                        value: {
                                            conn: false,
                                            msg: 'Now Playing movie not found. Upcoming movies cannot be rated.',
                                            result: null
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/movie/{movieId}/cinema': {
            get: {
                tags: ['Movies'],
                summary: 'Get Cinema by movieId',
                parameters: [
                    {
                        name: 'movieId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Cinema detail',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        con: { type: 'boolean', example: true },
                                        conn: { type: 'boolean', example: true },
                                        msg: { type: 'string', example: 'Cinemas Showing Movie' },
                                        result: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Cinema' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    404: {
                        description: 'Cinema not found',
                    },
                },
            },
        },
    },
};
