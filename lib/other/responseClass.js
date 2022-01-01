module.exports = class {
    constructor(proxy, status, averageSpeed, testResult, geoLocation) {
        this.proxy = proxy;
        this.status = status;
        this.averageSpeed = averageSpeed;
        this.testResult = testResult;
        this.geoLocation = geoLocation;
    }
}