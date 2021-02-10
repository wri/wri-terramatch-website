import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Loader } from 'tsc-chameleon-component-library';
import { initialAsyncStatePropType } from '../../../redux/asyncActionReducer';
import ConnectionItem from "../../../components/connections/ConnectionItemContainer";

const MatchesApproval = props => {
    const { t } = useTranslation();
    const { getMatchTasks, matchTasksState } = props;
    const [ matches, setMatches ] = useState([]);

    if (!matchTasksState.isFetching
        && !matchTasksState.data
        && !matchTasksState.error) {
        getMatchTasks();
    }

    useEffect(() => {
        if (matchTasksState.data) {
            setMatches(matchTasksState.data);
        }
    }, [matchTasksState, setMatches])

    const availableMatches = matches.map(match => {
        return (
          <div className="c-admin__match u-margin-vertical-small u-padding-small" key={match.id}>
            <ConnectionItem match={match} showPairing showUnmatchButton={false}/>
          </div>
        );
    });

    return (
        <section className="c-section c-section--standard-width">
            <h1 className="u-padding-bottom-small u-text-uppercase">
                {t('admin.matches.title')}
            </h1>

            {matchTasksState.isFetching && <Loader />}

            {matches.length > 0 &&
                <>
                    {availableMatches}
                </>
            }

            {matches.length === 0 && !matchTasksState.isFetching &&
                <p>{t('admin.matches.empty')}</p>
            }
        </section>
    )
}

MatchesApproval.propTypes = {
    matchTasksState: initialAsyncStatePropType.isRequired,
    getMatchTasks: PropTypes.func.isRequired
}

export default MatchesApproval;
