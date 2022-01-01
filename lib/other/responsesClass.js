module.exports = class {
    constructor(proxies) {
        this.proxies = proxies ? proxies : []; // If no proxies provided, create a new empty array.
    }

    /**
     * 
     * @param Object proxy, proxy response object returned from checkProxy.js
     */
    addProxy(proxy) { 
        this.proxies.push(proxy);
    }

    // PUBLIC METHODS
    /**
     * 
     * @param Number speed, filter proxies faster than a certain speed in ms.
     */
    speed(speed) {
        this.up(); // no point filtering proxies speed what are dead.
        this.proxies = this.proxies.filter(proxy => {
            if(proxy.averageSpeed < speed) return true;
            return false;
        });
        return this;
    }
    /**
     * @description get proxies which passed all the tests.
     */
    up() {
        this.proxies = this.proxies.filter(proxy => {
            if(proxy.status) return proxy;
            return false;
        });
        return this;
    }
    /**
     * @description get proxies which failed all the tests
     */
    down() {
        this.proxies = this.proxies.filter(proxy => {
            if(!proxy.status) return proxy;
            return false;
        });
        return this;
    }
    /**
     * @description Filter by country.
     * @param String countryCode, two letter country code e.g. GB.
     */
    country(countryCode) {
        this.proxies = this.proxies.filter(proxy => {
            if(proxy.geoLocation) {
                if(proxy.geoLocation.country_code == countryCode) return proxy
            } else {
                return false;
            }
        });
        return this;
    }

    /**
     * @description get proxies which failed all the tests
     */
    get = {
        raw: () => {
            return this.proxies;
        },
        simple: () => {
            return this.proxies.map(proxy => {
                const ipAndPort = proxy.proxy.split(':');
                return {proxy: {string: proxy.proxy, ip:ipAndPort[0], port:ipAndPort[1]}, status: proxy.status, speed:proxy.averageSpeed}
            });
        },
        string: () => {
            return this.proxies.map(proxy => {return proxy.proxy}).join("\n");
        }
    }   
}