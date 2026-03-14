const extractTrailer = (videos) => {
    if (!Array.isArray(videos) || !videos.length) {
        return '';
    }

    // Requirements:
    // - keep only one trailer
    // - choose first item where site=YouTube and type=Trailer
    // - persist key only
    const trailer = videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer');
    return trailer?.key || '';
};
module.exports = {
    extractTrailer
}
