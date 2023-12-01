export function getFeatureProperties<T extends any>(properties: any, key: string): T | undefined {
  return properties[key] || properties[`user_${key}`];
}
