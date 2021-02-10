import moment from 'moment';

/**
 * Number of years since operation.
 * Must be a number so i18n can use the _plural key
 * https://www.i18next.com/translation-function/plurals
 * Also, remove the "-" as the date will be in the past and the difference is a
 * negative
 */
export const yearsSinceOperation = (organisation) => parseInt(moment(organisation.founded_at)
                  .diff(new Date(), 'years').toString()
                  .replace('-', ''));
