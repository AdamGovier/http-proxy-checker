const axios = require('axios').default;
const Response = require('../other/responseClass')
const iplocate = require("node-iplocate");

const { performance } = require('perf_hooks');

let counter = 0;

module.exports = async (proxy, options) => {
    const proxyAndPort = proxy.split(':');
    const useProxy = {
        host: proxyAndPort[0],
        port: proxyAndPort[1]
    }

    const tested = [
        ...options.tests
    ]

    for (let i = 0; i < options.tests.length; i++) {
        const timer = startTimer();

        try {
            const res = await axios.get(options.tests[i].url, {
                proxy: useProxy,
                timeout: options.timeout
            });
            
            if(options.tests[i].case) {
                if(options.tests[i].case.test(res.data)) {
                    tested[i].passed = true;
                    tested[i].reason = `Matched test case.`
                    tested[i].responseTime = endTimer(timer);
                } else {
                    tested[i].passed = false;
                    tested[i].reason = "Proxys response did not match the test case."
                    tested[i].responseTime = endTimer(timer);
                } 
            } else {
                if(res.status == "200") {
                    tested[i].passed = true;
                    tested[i].reason = `No test case provided, found response code of 200.`
                    tested[i].responseTime = endTimer(timer);
                } else {
                    tested[i].passed = false;
                    tested[i].reason = `No test case provided, did not find response code of 200, response code returned ${res.status}.`
                    tested[i].responseTime = endTimer(timer);
                }
            }

        } catch (err) {
            console.log(err)
            tested[i].passed = false;
            tested[i].reason = err.message;
            tested[i].responseTime = endTimer(timer);  
        }
    }

    let total = 0;
    tested.forEach(test => {
        total += test.responseTime;
    })
    const averageSpeed = total / tested.length;

    // if filter finds a test which has failed !test.passed it will increase the length of the array, if the arrays length is not equal to 0 it will come back as true so I use ! infront of Boolean to invert.
    const status = !Boolean(tested.filter(test => !test.passed).length);

    let response;

    // Recomended that you set concurrentConnections to a low amount when using geoLocate.
    if(options.geoLocate) {
        let geoLocation;
        if(status) {
            geoLocation = await iplocate(proxyAndPort[0]);
        } else {
            geoLocation = null;
        }

        response = new Response(proxy, status, averageSpeed, tested, geoLocation);
    } else {
        response = new Response(proxy, status, averageSpeed, tested, null);
    }

    if(options.callback) createCallback();
    return response;

    function createCallback() {
        counter++;
        if(options.callback) options.callback({response, counter});
    }
}

function startTimer() {
    return performance.now();
}

function endTimer(startTime) {
    return Math.floor(performance.now() - startTime);
}