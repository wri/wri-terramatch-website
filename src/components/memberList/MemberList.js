import React from 'react';
import PropTypes from 'prop-types';
import MemberListItem from './MemberListItem';
import MemberListItemCard from './MemberListItemCard';
import { getUserKey } from '../../helpers';

const MemberList = (props) => {
  const { users,
          showAccountStatus,
          isCard,
          isCompact,
          isSelectable,
          selectChange,
          selectedUsers,
          canDelete,
          onRemove,
          hideUnverified,
          canSeeDetails,
          canEdit,
          onEdit,
          myUserId,
          className } = props;

  const userElements = users.map(user => {
    if (hideUnverified && user.role === 'user' && !user.email_address_verified_at) {
      return null
    }

    const key = getUserKey(user);
    const userCanEdit = (canEdit && (user.type === 'user' && user.id === myUserId)) || (canEdit && user.type === 'teamMember');

    return isCard ? <MemberListItemCard
                key={key}
                user={user}
                isSelectable={isSelectable}
                onSelectChange={selectChange}
                isSelected={isSelectable && selectedUsers.findIndex(selected => selected.id === user.id) > -1}
                isCompact={isCompact}
                canDelete={canDelete && user.type === 'teamMember'}
                onRemove={onRemove}
                canEdit={userCanEdit}
                onEdit={onEdit}
                canSeeDetails={canSeeDetails} /> :
             <MemberListItem
               key={key}
               user={user}
               showAccountStatus={showAccountStatus}/>
    }
  );

  return (
    <ul className={`${className} ${isSelectable ? 'u-text-center' : 'u-text-left'} c-add-users__list u-margin-bottom-large`}>
      {userElements}
    </ul>
  );
};

MemberList.propTypes = {
  users: PropTypes.array.isRequired,
  showAccountStatus: PropTypes.bool,
  isCard: PropTypes.bool,
  isSelectable: PropTypes.bool,
  selectChange: PropTypes.func,
  isCompact: PropTypes.bool,
  hideUnverified: PropTypes.bool,
  canEdit: PropTypes.bool,
  onEdit: PropTypes.func,
  canSeeDetails: PropTypes.bool,
  myUserId: PropTypes.number,
  className: PropTypes.string
};

MemberList.defaultProps = {
  showAccountStatus: true,
  isCard: false,
  isSelectable: false,
  selectChange: () => {},
  isCompact: false,
  hideUnverified: false,
  canEdit: false,
  onEdit: () => {},
  canSeeDetails: false,
  myUserId: null,
  className: ''
};

export default MemberList;
