const checkProxy = require('./checkProxy');
const Response = require('../other/responsesClass');
const chunk = require('chunk');

module.exports = async (proxies, options) => {
    if(!options.concurrentConnections) options.concurrentConnections = proxies.length;
    if(!options.tests) options.tests = [{url: "http://example.com", case:/Example Domain/}];
    const response = new Response();

    // Split array into sub arrays.
    const connectionChunks = chunk(proxies,options.concurrentConnections);

    // For every chunk
    for (let i = 0; i < connectionChunks.length; i++) {
        try {
            const chunkProxies = connectionChunks[i];
            const testedProxies = await Promise.all(chunkProxies.map(proxy => checkProxy(proxy, options))); // Run all proxy tests inside that chunk
            testedProxies.forEach(testedProxy => {
                response.addProxy(testedProxy); // Add to response object.
            });
        } catch (err) {
            console.log(err);
        }
    }

    return response;
}