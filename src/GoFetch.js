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
			.then((data) => {
				if (data && data.data && _.has(data.data, dataField)){
					try {
						this.logger.info(`received data ${JSON.stringify(data.data[dataField], null, 2)}`);
					}
					catch (e) {
						this.logger.info(`could not print response ${data}, ${e}`);
					}
					return data.data[dataField] || []; // data.data[datafield] can be null if nothing is found. allways return array!
				} else {
					this.logger.info('some formatting error in the result: ', data);
					return [];
				}
			})
			.catch((error) => {
				this.logger.info(`received error ${error}`);
				return [];
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

	_prepareQuery(searchFor, idOrQuery, excludeFields, objectName){
		excludeFields = excludeFields || this.excludeFields;
		const getNested = idOrQuery === 'id' ? true : false;
		
		const q = renderGqlQuery(objectName, excludeFields, getNested);
		const v = {[idOrQuery]: searchFor}; // [idOrQuery] sets id: or query:
		const operation = this._prepareOperation(q,v);
		return this._query(operation, objectName);
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
