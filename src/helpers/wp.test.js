import { getTranslation } from './wp';

it('getTranslation pulls through the correct content', () => {
  const exampleString = '[:en-us]English Content[:es]El spanish content[:]'

  expect(getTranslation('en-us', exampleString)).toEqual('English Content');
  expect(getTranslation('en-US', exampleString)).toEqual('English Content');
  expect(getTranslation('es', exampleString)).toEqual('El spanish content');
  expect(getTranslation('ES', exampleString)).toEqual('El spanish content');
});

it('Returns an empty string if the wrong code', () => {
  const exampleString = '[:en-us]English Content[:es]El spanish content[:]'
  expect(getTranslation('blah blah', exampleString)).toEqual('');
});
