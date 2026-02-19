const extractImages = (images) => {
    let slicedImages = images.slice(0,5)
    return slicedImages.map(img => ({
        filePath: img.file_path
    }));
};

module.exports = {
    extractImages
}
