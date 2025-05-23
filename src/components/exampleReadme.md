Intercept the request in BurpSuite and change the value of host header to amazon.com
API : https://sit1.totalwireless.com/nsa/api/shop/v1/agentic/llmsummary

4. Observe the response. x-xss-protection header is set to 0 which means that XSS filtering is disabled.
