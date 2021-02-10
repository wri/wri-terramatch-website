import responseTestData from './responseTestData.json';
import { orderByDateDesc } from './response';

const expectArrayMatches = (array1, array2) => {
  array1.forEach((item, index) => {
    expect(item.id).toEqual(array2[index].id);
  });
}

it('sortByDate correctly sorts a response by created at', () => {
  const { randomData, descCreatedAt } = responseTestData;

  expect(randomData.length).toEqual(descCreatedAt.length);

  const ordered = orderByDateDesc(randomData, 'created_at');
  expectArrayMatches(ordered, descCreatedAt);
});

it('sortByDate correctly sorts a response by updated at', () => {
  const { randomData, descUpdatedAt } = responseTestData;

  expect(randomData.length).toEqual(descUpdatedAt.length);

  const ordered = orderByDateDesc(randomData, 'updated_at');
  expectArrayMatches(ordered, descUpdatedAt);
});
