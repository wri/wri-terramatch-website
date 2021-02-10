export const getMappedVersionedArray = (response) => {
  if (response.data) {
    return {data: response.data.map((item) => {
      return {...item.data, status: item.status};
    })}
  }
  return {data: []};
};

export const getVersionByState = (versions, status) => {
  return versions.data.find(version => version.status  === status);
};

export const getLatestVersion = (versions) => {
  const sorted = [...versions.data].sort((a, b) => {
    if (a.id > b.id) {
      return -1;
    }

    if (a.id < b.id) {
      return 1;
    }

    return 0;
  });

  return sorted[0];
};
