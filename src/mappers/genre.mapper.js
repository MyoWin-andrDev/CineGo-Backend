const extractGenre = (genre) => {
    return genre.map(gen => ({
        name: gen.name
    }));
};

module.exports = {
    extractGenre
};
