import _ from 'lodash';

export default function renderGqlQuery({objectType, exclude=[], getNested=false}){
	const knownObjectTypes = ['organization', 'deal', 'person', 'organizations', 'deals', 'persons'];
	if (!_.includes(knownObjectTypes, objectType)){
		throw ReferenceError('unknown objectType was supplied');
	}

	const organizationParameters = `
			${_.includes(exclude, 'id') ? '' : 'id'}
			${_.includes(exclude, 'name') ? '' : 'name'}
			${_.includes(exclude, 'city') ? '' : 'city'}
			${_.includes(exclude, 'email') ? '' : 'email'}
			${_.includes(exclude, 'phonenumber') ? '' : 'phonenumber'}
			${_.includes(exclude, 'temperature') ? '' : 'temperature'}
			${_.includes(exclude, 'customerRelation') ? '' : 'customerRelation'}
			${getNested ? 'deals' : ''}
			${getNested ? 'employees' : ''}
		`;

	let dealParameters = `
			${_.includes(exclude, 'id') ? '' : 'id'}
			${_.includes(exclude, 'name') ? '' : 'name'}
			${_.includes(exclude, 'status') ? '' : 'status'}
			${_.includes(exclude, 'customerName') ? '' : 'customerName'}
			${getNested ? 'customer' : ''}

		`;
	let personParameters = `
			${_.includes(exclude, 'id') ? '' : 'id'}
			${_.includes(exclude, 'name') ? '' : 'name'}
			${_.includes(exclude, 'email') ? '' : 'email'}
			${_.includes(exclude, 'phonenumber') ? '' : 'phonenumber'}
			${_.includes(exclude, 'employerName') ? '' : 'employerName'}
			${getNested ? 'employer' : ''}
		`;

	let organizationsQuery = `
			query ($query: String!) {
				organizations (query: $query){
					${organizationParameters}
				}
			}
		`;
	let organizationQuery = `
			query ($id: String!) {
				organization (id: $id){
					${organizationParameters}
				}
			}
		`;
	let personsQuery = `
			query ($query: String!) {
				persons (query: $query){
					${personParameters}
				}
			}
		`;
	let personQuery = `
			query ($id: String!) {
				person (id: $id){
					${personParameters}
				}
			}
		`;
	let dealsQuery = `
			query ($query: String!) {
				deals (query: $query){
					${dealParameters}
				}
			}
		`;
	let dealQuery = `
			query ($id: Int!) {
				deal (id: $id){
					${dealParameters}
				}
			}
		`;
	
	switch (objectType){
	case 'organization':
		return organizationQuery;
	case 'organizations':
		return organizationsQuery;
	case 'person':
		return personQuery;
	case 'persons':
		return personsQuery;
	case 'deal':
		return dealQuery;
	case 'deals':
		return dealsQuery;
	}
}