import 'jest';
import renderGqlQuery from '../src/renderGqlQuery';

describe('throws error when no object type is', () => {
	test('passed', () => {
		expect(() => {
			renderGqlQuery();
		}
		).toThrow();
	});
	test('passed with exclude field', () => {
		expect(() => {
			renderGqlQuery({exclude:['id']});
		}
		).toThrow();
	});
	test('passed with nested field', () => {
		expect(() => {
			renderGqlQuery({nested:['id']});
		}
		).toThrow();
	});
});

const keys = {
	organization: {
		base: ['id', 'name', 'city', 'email', 'phonenumber', 'temperature', 'customerRelation'],
		nested: ['deals', 'employees']
	},
	organizations: {
		base: ['id', 'name', 'city', 'email', 'phonenumber', 'temperature', 'customerRelation'],
		nested: ['deals', 'employees']
	},
	deal: {
		base: ['id', 'name', 'status', 'customerName'],
		nested: ['customer']
	},
	deals: {
		base: ['id', 'name', 'status', 'customerName'],
		nested: ['customer']
	},
	person: {
		base: ['id', 'name', 'email', 'phonenumber', 'employerName'],
		nested: ['employer']
	},
	persons: {
		base: ['id', 'name', 'email', 'phonenumber', 'employerName'],
		nested: ['employer']
	}
};

describe('query without exceptions but with nested should return all keys for', () => {
	for (let objectType in keys) {
		test(objectType, () => {
			const res = renderGqlQuery({objectType:objectType, getNested:true});
			for (let key of keys[objectType].base.concat(keys[objectType].nested)) {
				expect(res).toMatch(key);
			}
		});
	}
});

describe('query which has nested and excludes id should return all keys but those for', () => {
	for (let objectType in keys) {
		test(objectType, () => {
			const res = renderGqlQuery({objectType:objectType, getNested:true, exclude:['id']});
			for (let key of keys[objectType].base.concat(keys[objectType].nested)) {
				if (key === 'id'){
					// chech for { { with anything between them and then id followed by whitespace or newline 
					expect(res).not.toMatch(new RegExp('(({)(.|\n)*){2,}(id(\s|\n))', 'g'));
				} else {
					expect(res).toMatch(key);
				}
			}
		});
	}
});

describe('query which has nested and excludes id and name, should return all keys but those for', () => {
	for (let objectType in keys) {
		test(objectType, () => {
			const res = renderGqlQuery({objectType:objectType, getNested:true, exclude:['id', 'name']});
			for (let key of keys[objectType].base.concat(keys[objectType].nested)) {
				if ((key === 'id') || (key === 'name')){
					// chech for { { with anything between them and then id or name followed by whitespace or newline
					expect(res).not.toMatch(new RegExp('(({)(.|\n)*){2,}((id|name)(\s|\n))', 'g'));
				} else {
					expect(res).toMatch(key);
				}
			}
		});
	}
});

describe('query which doesnt have nested should include all but those', () => {
	for (let objectType in keys) {
		test(objectType, () => {
			const res = renderGqlQuery({objectType:objectType, getNested:false});
			for (let key of keys[objectType].base.concat(keys[objectType].nested)) {
				if (keys[objectType].nested.includes(key)) {
					// chech for { { with anything between them and then the key followed by whitespace or newline
					expect(res).not.toMatch(new RegExp(`(({)(.|\n)*){2,}(${key}(\s|\n))`, 'g'));
				} else {
					expect(res).toMatch(key);
				}
			}
		});
	}
});
