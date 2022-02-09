# http-proxy-checker
Greetings :), I created a proxy checker that fit my needs. I also hope that this can be put to good use by other developers!

This proxy checker is capable of checking large qaunities of proxies, and removes dupilcates automatically.

Created by  **Adam Govier**

PS This README is heavily inspired by https://github.com/NeutronX-dev/nex-scraper

### Quickstart
```js
const checker = new Checker();

// Set Proxies also can set from a file path using checker.setProxiesFromFile(path); // Scroll further down in the documentation to find out how to use this function.
checker.setProxies(["158.58.133.106:41258", "185.61.152.137:8080", "136.228.244.130:5001", "77.86.31.251:8080"]);

checker.timeout = 3000;
checker.geoLocate = true;
checker.tests = [{url: "http://example.com", case:/Example Domain/}]

// Run the checker.
checker.run().then((proxies) => {
    // You can filter the results using different options see documentation further down.
    console.log(proxies.up().speed(1000).get.raw());
})
```
You can also initialize the checker by feeding it an array of proxies and an object of options.
```js
// Create a new checker with the follwing paramaters [ARRAY OF PROXIES] and any options you wish to use.
const checker = new Checker(
    ["158.58.133.106:41258", "185.61.152.137:8080", "136.228.244.130:5001", "77.86.31.251:8080"],
    {
        timeout: 3000, 
        geoLocate:true, 
        tests:[{ 
            // This test is the default if no tests are provided it will use this test anyway.
            url: "http://example.com", 
            case:/Example Domain/
        }]
    }
);

// Run the checker.
checker.run().then((proxies) => {
    // You can filter the results using different options see documentation further down.
    console.log(proxies.up().speed(1000).get.raw());
})

```
### Further Examples
1.) Retrieve proxies from a file then filter out by country code.
```js
const checker = new Checker();

checker.setProxiesFromFile("proxies.txt").then(() => {
    checker.timeout = 3000;
    checker.geoLocate = true;
    checker.tests = [{url: "http://example.com", case:/Example Domain/}]

    // Run the checker.
    checker.run().then((proxies) => {
        // You can filter the results using different options see documentation further down.
        console.log(proxies.up().country("DE").get.raw());
    })
})
```
More examples coming soon..

## Checker Methods
Method | Parameters | Explanation
------------ | ------------- | -------------
run | () | Runs the checker and returns a response object, more information on the response object further down the documentation. This is an asynchronous function so you must use .then or await.
setProxies | proxies - an array of proxies e.g. ['77.86.31.251:8080','176.9.63.62:3128', '139.164.190.212:80'] | sets the proxies to run the checker on.
setProxiesFromFile | path - a filepath which should be wrote from the current working directory. | Load a line breaked list of proxies in an efficient way (suitable for large files).

## Checker Options

Key | Value | Explanation | Default
------------ | ------------- | ------------- | -------------
hideWarnings | Boolean ( true/false ). | When checking if proxies are valid the package will log to console if it has rejected any of the proxies. Setting this value to true will hide these warnings from the console. | false
timeout | Integer (MS) e.g. 1000. | Setting this will abort a connection after the provided timeout. | 10000
tests | Test object array e.g. **`[{url: "http://example.com", case:/Example Domain/}]`**. | (* means required) The test object array should be an array of objects each containing a **url*** and a **case** the case is regex match against a request body of the url provided if the case is not supplied it will take a status code of 200 as a successful request. | [{url: "http://example.com", case:/Example Domain/}]
concurrentConnections | Integer. | Warning: **the concurrent connections must be less than the total number of proxies.** The concurrent connections property allows you to specify how many connections to send out at a time, depending on your use case & tests etc. this might help prevent rate limiting. | max
geoLocate | Boolean ( true/false ). | Returns a geoLocation object from the follwing package https://www.npmjs.com/package/node-iplocate an example response is shown in that packages npm page. Note: the API used has a limit of 1000 requests per day (Can increase with a paid API key). | false

## Response Object
An array of response objects are returned from running the checker.
```js
const responseObject = await checker.run();
```
### Response Object
Key | Value | Explanation
------------ | ------------- | -------------
proxy | checked proxy e.g. '185.215.180.56:3128' | This is the proxy what has been checked.
status | Boolean(true/false). | True if the proxy is working and false if the proxy is not working.
averageSpeed | Integer (ms) | Returns the average response time calculated by adding each test's response time and dividing it by the number of tests.
testResult | Test Object | Returns each original test object with a status appended and a response time appended.
geoLocation | geoLocation Object | See https://www.npmjs.com/package/node-iplocate for an example response.
### Filters
Method | Parameters | Explanation
------------ | ------------- | -------------
speed | speed - time in MS | Filters all proxies faster than a provided speed.
up | () | Get alive proxies.
down | () | Get proxies what are dead.
country | countryCode | Two letter country code to filter proxies by see: https://www.iplocate.com/en/resources/countries.
### Get output
Once you have filtered your results you will need to extract the results array.
Method | Explanation
------------ | ------------- 
get.raw() | Returns raw results from the Response Object.
get.simple() | Returns a simple response object containing the proxy, the status, and the average response time.
get.string() | Returns a line breaked string list of proxies.
### Example usage of the response object
```js
const checker = new Checker();

checker.setProxiesFromFile("proxies.txt").then(() => {
    checker.timeout = 3000;
    checker.geoLocate = true;
    checker.tests = [{url: "http://example.com", case:/Example Domain/}]

    // Run the checker.
    checker.run().then((proxies) => {
        console.log(proxies.up().speed(1000).country("GB").get.raw());
    })
});
```
