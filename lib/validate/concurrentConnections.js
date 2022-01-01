module.exports = (proxies, concurrentConnections) => {
    if(isNaN(concurrentConnections)) throw new Error("Expected a number for the concurrentConnections parameter.");
    if(concurrentConnections > proxies.length) throw new Error("You have set more connections than proxies available, have you set concurrentConnections before setting the proxies?");
}