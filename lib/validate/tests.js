module.exports = (testObjects) => {
    if(!Array.isArray(testObjects)) throw new Error("Expected an Array of testObjects.");

    testObjects.some(test => {
        if(!test.url) throw new Error("One of your tests does not include a URL.");
    })
}