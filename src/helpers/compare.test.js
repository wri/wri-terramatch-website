import { compareModels } from './compare';

it('compareModels correctly detects changes to an object', () => {;
  const lhs = {
    name: 'my object',
    description: 'it\'s an object!',
    details: {
      it: 'has',
      an: 'array',
      with: ['a', 'few', 'elements']
    },
    array: [['nested', 'array'], 'another thing'],
    remove: 'me'
  };
  const rhs = {
    name: 'updated object',
    description: 'it\'s an object!',
    details: {
      it: 'has',
      an: 'array',
      with: ['a', 'few', 'more', 'elements', { than: 'before' }]
    },
    array: [['nested', 'array', 'new thing'], 'another thing'],
    newArray: ['new array']
  };
  const results = compareModels(lhs, rhs);

  // 7 changes.
  expect(results.length).toEqual(7);

  expect(results[0].op).toEqual('replace');
  expect(results[0].path).toEqual('/name');
  expect(results[0].value).toEqual('updated object');

  expect(results[1].op).toEqual('replace');
  expect(results[1].path).toEqual('/details/with/2');
  expect(results[1].value).toEqual('more');

  expect(results[2].op).toEqual('add');
  expect(results[2].path).toEqual('/details/with/3');
  expect(results[2].value).toEqual('elements');

  expect(results[3].op).toEqual('add');
  expect(results[3].path).toEqual('/details/with/4');
  expect(JSON.stringify(results[3].value)).toEqual(JSON.stringify({ than: 'before' }));

  expect(results[4].op).toEqual('add');
  expect(results[4].path).toEqual('/array/0/2');
  expect(results[4].value).toEqual('new thing');

  expect(results[5].op).toEqual('remove');
  expect(results[5].path).toEqual('/remove');

  expect(results[6].op).toEqual('add');
  expect(results[6].path).toEqual('/newArray');
});
