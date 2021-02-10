import React from 'react';
import DatePicker, { registerLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
import en from 'date-fns/locale/en-US';
import { useTranslation } from 'react-i18next';

const FormDatePicker = (props) => {
  const { i18n } = useTranslation();
  registerLocale('es', es);
  registerLocale('en-US', en);

  // Ignore any user timezones.
  const getNormalizedDate = (date) => {
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const updated = new Date(date.getTime() + userTimezoneOffset);
    return updated;
  }

  return (
    <DatePicker showYearDropdown
      selected={props.value instanceof Date ? getNormalizedDate(props.value) : props.value}
      onChange={props.onChange}
      locale={i18n.language}
      maxDate={props.maxDate}
      className="c-form__input"
      placeholderText={props.placeholder}
    />
  );
};

export default FormDatePicker;
