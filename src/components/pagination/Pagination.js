import React from 'react';
import PropTypes from 'prop-types';

const Pagination = props => {
  const {
    currentPage,
    hasNextPage,
    hasPreviousPage,
    numPages,
    setPage
  } = props;
  return (
    <div className='c-pagination'>
      {hasPreviousPage && (
        <button
          className='c-pagination__btn c-pagination__btn--less'
          onClick={() => setPage(currentPage - 1)}
        />
      )}
      <div className='c-pagination__page-list'>
        {hasPreviousPage && (
          <button
            className='u-font-primary'
            onClick={() => setPage(currentPage - 1)}
          >
            {currentPage - 1}
          </button>
        )}
        <button className='u-font-primary u-text-bold'>{currentPage}</button>
        {hasNextPage && (
          <button
            className='u-font-primary'
            onClick={() => setPage(currentPage + 1)}
          >
            {currentPage + 1}
          </button>
        )}
        {hasNextPage && currentPage + 1 !== numPages && (
          <>
            <span className='u-font-primary'>…</span>
            <button
              className='u-font-primary'
              onClick={() => setPage(numPages)}
            >
              {numPages}
            </button>
          </>
        )}
      </div>
      {hasNextPage && (
        <button
          className='c-pagination__btn c-pagination__btn--more'
          onClick={() => setPage(currentPage + 1)}
        />
      )}
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  hasPreviousPage: PropTypes.bool.isRequired,
  numPages: PropTypes.number.isRequired
};

export default Pagination;
