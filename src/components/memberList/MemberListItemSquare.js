import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent } from 'tsc-chameleon-component-library';
import placeholderImage from '../../assets/images/pitches/option-placeholder.png';

const MemberListItemSquare = props => {
    const { user } = props;

    const fullName = `${user.first_name} ${user.last_name}`
    const avatar = user.avatar ? user.avatar : placeholderImage;

    const getInitials = (fullName) => {
      const split = fullName.split(' ');

      return split[0][0] + split[1][0];
    }
  
    return (
      <Card className="c-team-members__list-item">
        {user.avatar ?
          <CardHeader
            image={avatar}
            imageAlt={fullName}
          />
          :
          <div className="c-card-header__initials"role="img" aria-label={fullName}>
            <p className="u-font-primary u-font-massive u-text-uppercase u-text-bold" style={{color: 'white'}}>{getInitials(fullName)}</p>
          </div>
        }
        <CardContent>
          <h3 className="u-text-uppercase u-text-bold">{fullName}</h3>
          <p className="u-font-primary u-margin-none">{user.job_role}</p>
        </CardContent>
      </Card>
    );
}

MemberListItemSquare.propTypes = {
    user: PropTypes.object.isRequired
};

export default MemberListItemSquare;