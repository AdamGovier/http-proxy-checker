module.exports = (value) => {
    if(typeof value !== "boolean") throw new Error('Invalid value for "hideWarnings" it should be a boolean.');
}