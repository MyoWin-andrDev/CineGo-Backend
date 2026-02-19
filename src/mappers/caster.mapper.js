const extractCast = (cast) => {
    return cast.map(actor => ({
        name: actor.name,
        profilePath: actor.profile_path || ""
    }));
};

module.exports = {
    extractCast
};
