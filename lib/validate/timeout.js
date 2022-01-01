module.exports = (timeout) => {
    if(isNaN(timeout)) throw new Error("Expected a number for the timeout parameter.");
}