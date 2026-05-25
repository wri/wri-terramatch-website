export type TranslatedText = string & {
  readonly __translated: unique symbol;
};
