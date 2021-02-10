import versions from './versionTestData.json';
import { getLatestVersion } from './versions';

it('getLatestVersion gets the latest version', () => {
    const idToExpect = 64;
    const latestVersion = getLatestVersion(versions);

    expect(latestVersion.id).toEqual(idToExpect);
  }
);
