import React from 'react';
import { Route, Switch, useRouteMatch, Redirect } from 'react-router-dom';
import Organisations from './organisations/OrganisationsContainer';
import Pitches from './pitches/PitchesContainer';
import Users from './users/UsersContainer';
import Matches from './matches/MatchesContainer';
import Reports from './reports/ReportsContainer';

export default (props) => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Redirect
          to={{
            pathname: `${path}/organization`
          }}
        />
      </Route>
      <Route path={`${path}/organization`} component={Organisations}/>
      <Route path={`${path}/pitches`} component={Pitches}/>
      <Route path={`${path}/users`} component={Users}/>
      <Route path={`${path}/matches`} component={Matches} />
      <Route path={`${path}/reports`} component={Reports}/>
    </Switch>
  )
}
