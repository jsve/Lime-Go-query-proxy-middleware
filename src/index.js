import GoFetch from './GoFetch';

function goApiProxy(apiKey) {
	// api key can either be supplied or read from env.
	apiKey = apiKey || process.env.LIME_GO_KEY;

	return function goApiProxyMiddleware(req, res, next){
		if (!apiKey){
			// no api key found means dont do anything.
			return next();
		}

		const fetcher = new GoFetch({apiKey: apiKey});
		const p = fetcher.organizations('briab');
		console.log(p);
		p.then(res => {
			console.log(res);
		});
		next();
	}
}

module.exports = goApiProxy;
