import diff from 'deep-diff';

const CHANGE_TYPES = {
  N: 'add',
  E: 'replace',
  D: 'remove'
};

/**
 * Deep comparison of two models, returning a JSON patch compatible array.
 * @param  Object a model a
 * @param  Object b model b
 * @return Array   JSON patch Array of changes
 */
export const compareModels = (a, b) => {
  const results = diff(a, b) || [];

  const jsonPatch = [];

  results.forEach(change => {
    if (change.kind !== 'A') {
      jsonPatch.push({
        op: CHANGE_TYPES[change.kind],
        path: `/${change.path.join('/')}`,
        value: change.rhs
      });
    } else {
      jsonPatch.push({
        op: CHANGE_TYPES[change.item.kind],
        path: `/${change.path.join('/')}/${change.index}`,
        value: change.item.rhs
      });
    }
  });

  return jsonPatch;
};
