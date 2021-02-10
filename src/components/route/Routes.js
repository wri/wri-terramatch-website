import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute, LoggedOutRoute } from './CustomRoutes';

import About from '../../pages/about/AboutContainer';
import AddTeamMembers from '../../pages/createOrganisation/addTeamMembers/AddTeamMemberContainer';
import AddDocumentAwards from '../../pages/createOrganisation/addDocumentAwards/AddDocumentsAwardsContainer';
import Admin from '../../pages/admin/AdminContainer';
import CreateOrganisation from '../../pages/createOrganisation/CreateOrganisationContainer';
import Organisation from '../../pages/organisation/OrganisationContainer';
import Landing from '../../pages/landing/LandingContainer';
import Login from '../login/LoginContainer';
import SignUp from '../../pages/signup/SignupContainer';
import PasswordReset from '../../pages/passwordReset/PasswordResetContainer';
import VerifyUser from '../../pages/verifyUser/VerifyUserContainer';
import CreatePitch from '../../pages/createPitch/CreatePitchContainer';
import CreateOffer from '../../pages/createOffer/CreateOfferContainer';
import ProjectSearch from '../../pages/projectSearch/ProjectSearchContainer';
import Pitch from '../../pages/pitch/PitchContainer';
import Post from '../../pages/post/Post';
import Notifications from '../../pages/notifications/NotificationsContainer';
import RegisterInterest from '../../pages/match/RegisterInterestContainer';
import Offer from '../../pages/offer/OfferContainer';
import Connections from '../../pages/match/ConnectionsContainer';
import UpdateFundingStatus from '../../pages/updateFundingStatus/UpdateFundingStatusContainer';
import PageNotFound from '../../pages/pageNotFound/PageNotFound';
import Unsubscribe from '../../pages/unsubscribe/Unsubscribe';

export default (props) => {
  return (
    <Switch>
      <Route exact path="/" component={Landing}/>
      <Route path="/about" component={About}/>
      <Route path="/login" component={Login}/>
      <Route path="/unsubscribe" component={Unsubscribe}/>
      <LoggedOutRoute path="/signup" component={SignUp}/>
      <LoggedOutRoute path="/invite" component={SignUp}/>
      <Route path="/passwordReset" component={PasswordReset} />
      <PrivateRoute path="/verify" component={VerifyUser} search={props.location.search}/>
      <PrivateRoute path="/createOrganisation" component={CreateOrganisation}/>
      <PrivateRoute path="/addTeamMember" component={AddTeamMembers}/>
      <PrivateRoute path="/addDocumentAwards" component={AddDocumentAwards}/>
      <PrivateRoute exact path="/profile" component={Organisation}/>
      <PrivateRoute exact path="/profile/projects/:id" component={Pitch}/>
      <PrivateRoute exact path="/profile/funding/:id" component={Offer}/>
      <PrivateRoute path="/organization/:id" component={Organisation}/>
      <PrivateRoute path="/createProject" component={CreatePitch}/>
      <PrivateRoute path="/createOffer" component={CreateOffer}/>
      <PrivateRoute path="/profile/createProject/:id" component={CreatePitch}/>
      <PrivateRoute path="/profile/createOffer/:id" component={CreateOffer}/>
      <PrivateRoute path="/admin" component={Admin} adminRoute/>
      <PrivateRoute exact path="/projects" component={ProjectSearch}/>
      <PrivateRoute exact path="/funding" children={({ ...rest }) => (
          <ProjectSearch isFunding {...rest} />
        )}
      />
      <PrivateRoute exact path="/projects/:id" component={Pitch}/>
      <PrivateRoute path="/notifications" component={Notifications}/>
      <PrivateRoute path="/news/:name" component={Post}/>
      <PrivateRoute path="/registerInterest/funding/:id" component={RegisterInterest} />
      <PrivateRoute path="/registerInterest/pitch/:id" component={RegisterInterest} />
      <PrivateRoute exact path="/profile/funding/updateStatus/:id" component={UpdateFundingStatus} />
      <PrivateRoute exact path="/profile/projects/updateStatus/:id" component={UpdateFundingStatus} />
      <PrivateRoute path="/funding/:id" component={Offer}/>
      <PrivateRoute path="/connections" component={Connections} />
      <Route component={PageNotFound} />
    </Switch>
  )
}
