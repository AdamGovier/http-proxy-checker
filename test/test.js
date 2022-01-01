/**
 * Hello! I am new to unit testing so I am sorry if this is not up to scratch but I am improving my skills in JavaScript and testing frameworks such as Mocha.
 */

const assert = require('assert');
const Checker = require('../index.js');

describe('Proxy Checker Initilisation.', function() {

    describe('Timeout.', function() {
      it('Should return a checker instance with the following properties: timeout=1000', function() {
        const checker = new Checker([], {
          timeout: 1000,
          hideWarnings: true
        });
        assert(checker, { options: { timeout: 10000, hideWarnings:true }, proxies: [] })
      });
    });

    describe('Concurrent Connections.', function() {
      it('Should return a checker with the following properties: concurrentConnections=3', function() {
        const checker = new Checker(["8.8.8.8:8888","8.8.8.8:4000","8.8.8.8:3000","8.8.8.8:2000"], {
          concurrentConnections: 3
        });
        assert(checker, { options: { concurrentConnections: 3 }, proxies: [] })
      });
    });

    describe('geoLocate', function() {
      it('Should return a checker with the following properties: geoLocate=true', function() {
        const checker = new Checker([], {
          geoLocate: true
        });
        assert(checker, { options: { geoLocate: 3 }, proxies: [] })
      });
    })

    describe('hideWarning', function() {
      it('Should return a checker with the following properties: hideWarning=true', function() {
        const checker = new Checker([], {
          hideWarning: true
        });
        assert(checker, { options: { hideWarning: true }, proxies: [] })
      });
    })

    describe('Tests', function() {
      it('Should return a checker with the following test: [{url: "http://example.com", case:/Example Domain/}]', function() {
        const checker = new Checker([], {
          tests: [{url: "http://example.com", case:/Example Domain/}]
        });
        assert(checker, { options: { tests: [{url: "http://example.com", case:/Example Domain/}] }, proxies: [] })
      });
    })

    describe('Check valid proxies', function() {
      it('from this list of proxies ["a", "8.8.8.8:8000","b","c"] it should on return the valid proxies e.g. ["8.8.8.8:8080"]', function() {
        const checker = new Checker(["a", "8.8.8.8:8000","b","c"], {hideWarnings: true});
        assert(checker.proxies, [ '8.8.8.8:8000' ])
      });
    })

});

describe('Proxy Checker Usage. Please provide a working proxy!', function() {
  const checker = new Checker();
  checker.hideWarnings = true;
  checker.timeout = 3000;
  checker.tests = [{url: "http://example.com", case:/Example Domain/}];

  // Proxy which is not real, and working proxy at the time of creation.. you should swap the second proxy with a confirmed working proxy.
  const proxies = {
    fake: '123.123.123.123:8888',
    working: '77.86.31.251:8080'
  }

  checker.setProxies([proxies.fake, proxies.working])
  
  it('Testing that one proxy fails and one works.', async function() {
    let proxies = await checker.run();
    proxies = proxies.get.raw();
    assert({deadProxy:proxies[0].status, aliveProxy:proxies[1].status}, {deadProxy:false, aliveProxy:true})
  });

  it('Testing that proxy geolocation comes back with any data.', async function() {
    checker.geoLocate = true;
    let proxies = await checker.run();
    proxies = proxies.get.raw();
    assert(proxies[1].geoLocation, !undefined)
  });
});