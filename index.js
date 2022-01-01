const validate = require('./lib/validate');
const tasks = require('./lib/tasks');
const validator = require('validator');

module.exports = class {
    /**
     * 
     * @param Array proxies, an Array of proxies in the format "ip:port".
     * @param Object options, an Object containing global configurations, see README for more information.
     */
    constructor(proxies, options) {

        // Set options if not specified set to a blank object.
        options ? this.options = options : this.options = {};
        validate.validateOptions(proxies, this.options);
        if(!this.options.timeout) this.options.timeout = 10000;

        if(proxies) {
            if(!Array.isArray(proxies)) throw new Error("Expected an Array of proxies.");
            // Filter valid proxies
            this.proxies = this.#validateProxies(proxies);
        } else {
            this.proxies = []; 
        }

    }

    // PUBLIC METHODS
    
    /**
     * @description Start checking proxies.
     */
    async run() {
        return await tasks.run(this.proxies, this.options);
    }

    // PRIVATE METHODS
    /**
     * 
     * @param Array proxies, an Array of proxies in the format "ip:port".
     * @returns proxies, a filtered array containing valid proxies.
     */
    #validateProxies(proxies) {
        return [...new Set(proxies.filter(proxy => {
            const ipAndPort = proxy.split(':');
            if(!validator.isIP(ipAndPort[0]) || !validator.isPort(ipAndPort[1])) {
                if(!this.options.hideWarnings) console.warn(`[http-proxy-checker] "${proxy}" is expected to be an invalid proxy, excluding proxy from list.`);
            } else {
                // If valid proxy.
                return true;
            }
        }))];
    }


    // SET PROXY

    /**
     * @description Set the proxies to be checked.
     * @param Array proxies, an Array of proxies in the format "ip:port".
     */
    setProxies(proxies) {
        if(!Array.isArray(proxies)) throw new Error("Expected an Array of proxies.");
        // Filter valid proxies
        this.proxies = this.#validateProxies(proxies);
    }

    /**
     * @description Set the proxies to be checked from a file.
     * @param String path, path relative from the current working directory.
     */
    setProxiesFromFile(path) {
        return new Promise((resolve) => {
            // https://stackoverflow.com/questions/44279211/how-to-read-big-files-in-nodejs Allows developers to take in large lists of proxies.
            const fs = require('fs');
            const eol = require('eol');

            let output = "";

            const readStream = fs.createReadStream(path);

            readStream.on('data', function(chunk) {
                output += eol.auto(chunk.toString('utf8'));
            });
              
            readStream.on('end', () => {
                const readProxies = output.split(/\r?\n/);
                this.proxies = this.#validateProxies(readProxies.slice(0,-1));
                resolve();
            })
        });
    }

    // OPTIONS

    /**
     * @param Boolean value, true/false, hide the warnings displayed in the console.
     */
    set hideWarnings(value) {
        validate.hideWarnings(value);
        this.options.hideWarnings = value;
    }

    /**
     * @param Boolean value, true/false, show the locations of the proxies using the IPLocate.io API, "Our non-authenticated API has a limit of 1,000 requests per day"
     */
    set geoLocate(value) {
        validate.geoLocate(value);
        this.options.geoLocate = value;
    }

    /** 
     * @description everytime a proxy has finished being checked even if it is a failed test this will call this callback if provided. You can use the counter returned to create a progress bar.
     * @param Function cb, a callback function.
     * @returns Object {response, counter}
    */
    set progressCB(cb) {
        this.options.callback = cb;
    }

    /**
     * @param Array testObjects, an Array of objects containing urls and testcases. See README for more information.
     * @example x.tests=[{url:"https://example.com",case:/Example Domain/}] // x being the http-proxy-checker Object.
     */
    set tests(testObjects) {
        validate.tests(testObjects);
        this.options.tests = testObjects;
    } 

    /**
     * @param Number timeout, time in (ms) until the test for the paticular proxy to be timed out, default is 10000ms.
     */
    set timeout(timeout) {
        validate.timeout(timeout);
        this.options.timeout = timeout;
    }

    /**
     * @param Number concurrentConnections, sets how many proxies to test at a time, default is the whole array of proxies. 
     */
    set concurrentConnections(concurrentConnections) {
        validate.concurrentConnections(this.proxies, concurrentConnections);
        this.options.concurrentConnections = concurrentConnections;
    }
}

