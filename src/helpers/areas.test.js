import * as areas from './areas';
import smallAreaSize from '../testAssets/smallArea.json';
import correctAreaSize from '../testAssets/correctArea.json';

describe('checkArea', () => {
  it ('returns true when the area is within the size parameters', () => {
    expect(areas.checkArea(correctAreaSize)).toEqual(true);
  })

  it ('returns false when the area is smaller than the defined min size', () => {
    expect(areas.checkArea(smallAreaSize)).toEqual(false);
  })
})
