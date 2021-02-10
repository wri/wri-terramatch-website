import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { getUsersName } from '../../helpers';

const VersionHistoryTableItem = (props) => {
  const { t, i18n } = useTranslation();
  const { row, adminList } = props;
  const localeMoment = moment(row.approved_rejected_at).locale(i18n.language);
  const admin = adminList.find(admin => admin.id === row.approved_rejected_by);

  return (
    <tr>
      <td>
        { admin ? getUsersName(admin) : t('common.na') }
      </td>
      <td>{t(`admin.versions.status.${row.status}`)}</td>
      <td>{row.approved_rejected_at ? localeMoment.format('lll') : t('common.na')}</td>
      <td>{row.rejected_reason ? t(`api.rejected_reasons.${row.rejected_reason}`) : t('common.na')}</td>
      <td>{row.rejected_reason_body ? row.rejected_reason_body : t('common.na')}</td>
    </tr>
  );
};

VersionHistoryTableItem.propTypes = {
  row: PropTypes.object.isRequired,
  adminList: PropTypes.array.isRequired
};

export default VersionHistoryTableItem;
