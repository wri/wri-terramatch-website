const translationSplitRegex = /(\[:[a-zA-Z]+-?[a-zA-Z]+\])/gm;

/**
 * Takes a wordpress translation string and returns the correct string for that
 * language langCode
 * e.g:
 * getTranslation('en-US', '[:en-US]English Content[:es]El spanish content[:]');
 *
 * Will return: 'English Content'
 *
 * @param  {string} langCode Language code
 * @param  {string} str      String from wordpress
 * @return {string}          Matched string
 */
const getTranslation = (langCode, str) => {
  const split = str.split(translationSplitRegex);
  const match = `[:${langCode}]`;
  const index = split.findIndex(item => item.toLowerCase() === match.toLowerCase());
  if (index === -1) {
    console.warn(`Could not find lang code in string, ${langCode}`);
    return '';
  }

  return split[index+1].replace('[:]', '');
}

export { getTranslation };
