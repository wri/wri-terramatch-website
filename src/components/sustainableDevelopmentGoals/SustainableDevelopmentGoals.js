import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { goalColours } from '../../helpers';

const sortFunc = (a, b) => {
  // goals will always be formatted as goal_n
  const numA = a.split('_')[1];
  const numB = b.split('_')[1];
  return numA - numB;
}

const Goal = ({goal}) => {
  const { t } = useTranslation();
  const colour = goalColours[goal];
  return(
      <div className="c-stats__dev_goal u-margin-bottom-small u-margin-right-small" style={{backgroundColor: colour}}>
          <img
              className='c-stats__dev_icon'
              src={require(`../../assets/images/icons/sdg/${goal}.svg`)}
              alt={t(`api.sustainable_development_goals.${goal}`)}
              role='presentation'
          />
          <p>{t(`api.sustainable_development_goals.${goal}`)}</p>
      </div>
  )
}

const SustainableDevelopmentGoals = ({goals}) => {
  return goals.sort(sortFunc).map(goal => <Goal goal={goal} key={goal} />)
}

SustainableDevelopmentGoals.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default SustainableDevelopmentGoals;