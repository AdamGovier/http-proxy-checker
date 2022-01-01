module.exports = {
    hideWarnings: require('./hideWarnings'),
    tests: require('./tests'),
    timeout: require('./timeout'),
    concurrentConnections: require('./concurrentConnections'),
    geoLocate: require('./geoLocate'),
    validateOptions(proxies, options) {
        if(options.hideWarnings) this.hideWarnings(options.hideWarnings);
        if(options.tests) this.tests(options.tests);
        if(options.timeout) this.timeout(options.timeout);
        if(options.concurrentConnections) this.concurrentConnections(proxies, options.concurrentConnections);
        if(options.geoLocate) this.geoLocate(options.geoLocate);
    }
}