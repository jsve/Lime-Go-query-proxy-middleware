import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import renderGqlQuery from './renderGqlQuery';
import _ from 'lodash';
import { logger } from './logger';
import fetch from 'node-fetch';

// documentation: https://lime-go.readme.io/docs/graphql

class GoFetch {
	constructor(props) {
		const {
			apiKey = null,
			excludeFields = [],
			suppliedLogger
		} = props;
		this.apiKey = apiKey; // key from lime go, starting with go-key:...
		this.excludeFields = excludeFields;

		this.logger = suppliedLogger || logger;

		this.baseUrl = 'https://api.lime-go.com/v1/graphql';
		this.gqlLink = new HttpLink({
			uri: this.baseUrl,
			fetch: fetch,
			headers: {
				Authorization: this.apiKey,
				ContentType: 'application/json'
			}
		});

		this.context = {
			headers: {
				Authorization: this.apiKey,
				ContentType: 'application/json'
			}
		};
	}

	_query(operation, dataField) {
		return makePromise(execute(this.gqlLink, operation))
			.then((result) => {
				if (result && result.data && _.has(result.data, dataField)){
					try {
						this.logger.info(`received data ${JSON.stringify(result.data[dataField], null, 2)}`);
						return result.data[dataField] || null;
					}
					catch (e) {
						this.logger.info(`could not print response ${result}, ${e}`);
						return result.data[dataField] || null;
					}
				} else {
					this.logger.info('some formatting error in the result: ', result);
					return null;
				}
			})
			.catch((error) => {
				this.logger.info(`received error ${error}`);
				return null;
			});
	}

	_prepareOperation(query, variable){
		const operation = {
			query: gql`${query}`,
			variables: variable,
			context: this.context
		};
		return operation;
	}

	_prepareQuery(searchFor, idOrQuery, exclude, objectType){
		exclude = exclude || this.excludeFields;
		const getNested = idOrQuery === 'id' ? true : false;
		
		const q = renderGqlQuery({objectType, exclude, getNested});
		const v = {[idOrQuery]: searchFor}; // [idOrQuery] sets id: or query:
		const operation = this._prepareOperation(q,v);
		return this._query(operation, objectType);
	}

	organization(searchFor, excludeFields){
		return this._prepareQuery(searchFor, 'id', excludeFields, 'organization');
	}

	organizations(searchFor, excludeFields){
		return this._prepareQuery(searchFor, 'query', excludeFields, 'organizations');
	}

	person(searchFor, excludeFields){
		return this._prepareQuery(searchFor, 'id', excludeFields, 'person');
	}

	persons(searchFor, excludeFields){
		return this._prepareQuery(searchFor, 'query', excludeFields, 'persons');
	}

	deal(searchFor, excludeFields){
		return this._prepareQuery(searchFor, 'id', excludeFields, 'deal');
	}
	
	deals(searchFor, excludeFields){
		return this._prepareQuery(searchFor, 'query', excludeFields, 'deals');
	}

}

export default GoFetch;
