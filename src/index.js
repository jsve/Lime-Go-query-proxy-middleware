import GoFetch from './GoFetch';
import { logger } from './logger';

function goApiProxy(apiKey) {
	// api key can either be supplied or read from env.
	apiKey = apiKey || process.env.LIME_GO_KEY;
	
	return function goApiProxyMiddleware(req, res, next){
		if (!apiKey || (Object.keys(req.query).length === 0)) {
			logger.info('missing api key or query params');
			return next();
		}

		const {
			'query-organizations': queryOrg,
			'query-deals': queryDeal,
			'query-persons': queryPerson,
			'get-organization': getOrg,
			'get-deal': getDeal,
			'get-person': getPerson
		} = req.query;

		const hasQuery = !!(queryOrg || queryDeal || queryPerson);
		const hasGet = !!(getOrg || getDeal || getPerson);
		const hasMultipleGets = [getOrg, getDeal, getPerson].filter(n => n).length > 1;

		if ( !(hasQuery || hasGet) || (hasQuery && hasGet) || hasMultipleGets) {
			logger.error('malformed query parameters');
			return next();
		}

		if (hasQuery) {
			const orgFetcher = queryOrg ? new GoFetch({apiKey: apiKey}).organizations(queryOrg) : new Promise((resolve) => resolve([]));
			const dealFetcher = queryDeal ? new GoFetch({apiKey: apiKey}).deals(queryDeal) : new Promise((resolve) => resolve([]));
			const personFetcher = queryPerson ? new GoFetch({apiKey: apiKey}).persons(queryPerson) : new Promise((resolve) => resolve([]));

			Promise.all([orgFetcher, dealFetcher, personFetcher])
				.then((resultArray) => {
					const [
						organizations,
						deals,
						persons
					] = resultArray;
					const result = {
						organizations,
						deals,
						persons
					};
					res.json(result);
					next();
				})
				.catch((e) => {
					logger.error('error when fetching data from lime go', e);
				});
		}

		if (hasGet) {
			const getter = new GoFetch({apiKey: apiKey});
			let resultPromise;
			if (getOrg) resultPromise = getter.organization(getOrg);
			if (getDeal) resultPromise = getter.deal(getDeal);
			if (getPerson) resultPromise = getter.person(getPerson);

			resultPromise.then((result) => {
				res.json(result);
				next();
			}).catch((e) => {
				logger.error('error when fetching data from lime go', e);
			});
		}
	};
}

module.exports = goApiProxy;
