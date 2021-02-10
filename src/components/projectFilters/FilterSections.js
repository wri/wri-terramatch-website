import React, { useCallback, useState, useEffect } from 'react';
import superagent from 'superagent';
import FilterSection from './FilterSection';
import InputSection from './InputSection';
import { Loader } from 'tsc-chameleon-component-library';

const FilterSections = (props) => {
  const { filterCategories, filters, setFilters, sortClearSearch, projectType } = props;
  const [ results, setResults ] = useState({});
  const [ isFetching, setIsFetching ] = useState(true);

  const fetchAttributeOptions = useCallback((category) => {
    if (!category.localOptions) {
      return new superagent.get(`${process.env.REACT_APP_API_URL}/${category.apiPath ? category.apiPath : category.modelKey}`)
    } else {
    //  If local, emulate the response.
      return Promise.resolve({res: {body: {data: category.localOptions}}});
    }
  }, []);

  useEffect(() => {
    const promises = [];

    filterCategories.forEach((category) => {
      if (category.modelKey !=='price_per_tree') {
        promises.push(fetchAttributeOptions(category).then(
          res => setResults((prevResults) => {
            const { data } = res.body;
            prevResults[category.modelKey] = data;
            return prevResults;
        })));
      }
    });

    Promise.all(promises).then(() => setIsFetching(false));
  }, [filterCategories]); // eslint-disable-line react-hooks/exhaustive-deps

  return isFetching ?
  <div className="u-flex u-flex--centered u-flex--justify-centered">
      <Loader />
  </div> : filterCategories.map(category => {
    let title = category.title;

    if (!title) {
      title = projectType === 'offer' ? category.offerTitle : category.pitchTitle;
    }

    if (category.modelKey === 'price_per_tree') {
      return (
        <InputSection
          title={title}
          modelKey={category.modelKey}
          valueKey={category.valueKey}
          filters={filters}
          onFilterChange={setFilters}
          key={category.modelKey}
        />
      );
    }
    return (
      <FilterSection
        title={category.title}
        key={category.modelKey}
        modelKey={category.modelKey}
        valueKey={category.valueKey}
        options={results[category.modelKey] ? results[category.modelKey] : []}
        isRadio={category.isRadio}
        onFilterChange={(filters)=>{
          sortClearSearch();
          setFilters(filters);
        }}
        filters={filters}
      />
    );
  });
};

export default FilterSections;
