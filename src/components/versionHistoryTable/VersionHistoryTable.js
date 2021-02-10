import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import VersionHistoryTableItem from './VersionHistoryTableItem';
import { useTranslation } from 'react-i18next';
import { canFetch } from '../../helpers';
import { Loader } from 'tsc-chameleon-component-library';

const VersionHistoryTable = (props) => {
  const { t } = useTranslation();
  const { versions, getAdmins, getAdminsState, clearGetAdmins } = props;

  const rows = versions.map((item)=> {
    return (<VersionHistoryTableItem
            row={item}
            key={item.id}
            adminList={getAdminsState.data ? getAdminsState.data : []}
            />);
  });

  useEffect(() => {
    if (canFetch(getAdminsState)) {
      getAdmins();
    }
  }, [getAdmins, getAdminsState]);

  useEffect(() => clearGetAdmins, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <table className={`u-table ${props.className}`}>
      <thead className="u-table__header u-text-left">
        <tr>
          <th>{t('admin.versions.approvedRejectedBy')}</th>
          <th>{t('admin.versions.status.title')}</th>
          <th>{t('admin.versions.date')}</th>
          <th>{t('admin.versions.reason')}</th>
          <th>{t('admin.versions.body')}</th>
        </tr>
      </thead>
      <tbody className="u-table__body u-text-left">
        {getAdminsState.isFetching ?
          <tr>
            <td colSpan="5" className="u-padding-small">
              <Loader />
            </td>
          </tr> : rows
        }
      </tbody>
    </table>
  );
};

VersionHistoryTable.propTypes = {
  versions: PropTypes.array.isRequired
};

export default VersionHistoryTable;
