const findCountry = (code, countries) => {
  for (let i = 0; i < countries.length; i++) {
    if (countries[i].code === code) {
      return countries[i].name;
    }
  }
  return code;
}

export { findCountry };
