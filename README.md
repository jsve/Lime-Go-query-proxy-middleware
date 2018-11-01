# Lime-Go-query-proxy-middleware
A proxy for channeling requests from some web-client through to Lime Go query GraphQL API. Currently supports:
 - query organizations
 - query deals
 - query persons

## Installation
`npm install --save lime-go-query-proxy-middleware`

## Implementation
Set it up with your express (or other library compatible with express middleware) in some route. Something like:

`server.use('/api/lime-go', goApiProxy(apiKey))`

where apiKey is your personal key from Lime Go.

## Usage

### Make query
Make a GET with the proper params (see [this](https://fetch.spec.whatwg.org/#fetch-api) for some great snippets when working with search params) to the route you have chosen for your proxu (like /api/lime-go). The params you should set are either one or more of:
 - 'query-organizations'
 - 'query-deals'
 - 'query-persons'

or one of (if you know the corresponding id):
 - 'get-organization'
 - 'get-deal'
 - 'get-person'

 and then your search query or id as the parameter. Example:
 `query-organizations=lime`

### Response
For the queries you will get a response with this body:
`empty`

For the gets you will get a response with this body:
`empty`
