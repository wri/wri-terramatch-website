import React from 'react';
import AdminRoutes from './AdminRoutes';
import { NavLink, useRouteMatch } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Admin = (props) => {
  const { t } = useTranslation();
  const { url } = useRouteMatch();

  return (
    <section className="c-admin u-background-light-grey u-padding-vertical-small">
      <aside className="c-sidebar u-background-white">
        <ul className="u-list-unstyled u-text-center u-padding-top-small">
          <li>
            <NavLink to={`${url}/organization`} className="u-link u-text-uppercase u-margin-vertical-small u-display-block">
              {t('admin.organisations.title')}
            </NavLink>
          </li>
          <li>
            <NavLink to={`${url}/pitches`} className="u-link u-text-uppercase u-margin-vertical-small u-display-block">
              {t('admin.pitches.title')}
            </NavLink>
          </li>
          <li>
            <NavLink exact to={`${url}/users`} className="u-link u-text-uppercase u-margin-vertical-small u-display-block">
              {t('admin.users.title')}
            </NavLink>
          </li>
          <li>
            <NavLink exact to={`${url}/matches`} className="u-link u-text-uppercase u-margin-vertical-small u-display-block">
              {t('admin.matches.title')}
            </NavLink>
          </li>
          <li>
            <NavLink exact to={`${url}/reports`} className="u-link u-text-uppercase u-margin-vertical-small u-display-block">
              {t('admin.reports.title')}
            </NavLink>
          </li>
        </ul>
      </aside>
      <div className="c-admin__content">
        <AdminRoutes />
      </div>
    </section>
  )
};

export default Admin;
