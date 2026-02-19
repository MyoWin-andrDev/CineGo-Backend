const extractTeasers = (videos) => {
    return videos
        .filter(v => v.type === 'Teaser' && v.site === 'YouTube')
        .slice(0,5)
        .map(v => ({
            name: v.name,
            key: v.key,
            publishedAt: v.published_at
        }));
};
 module.exports = {
     extractTeasers
 }