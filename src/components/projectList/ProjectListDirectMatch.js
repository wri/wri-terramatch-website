import React, { useState } from 'react';
import Select from 'react-select';
import { Loader } from 'tsc-chameleon-component-library';
import { useTranslation } from 'react-i18next';
import DropdownIndicator from '../../components/navigation/DropdownIndicator';
import ProjectListItem from '../sliderList/ProjectListItem';

const sortByChoices = (t) => [
    {
      key: 'created_at_asc',
      label: t('sort.created_at_asc')
    },
    {
      key: 'created_at_desc',
      label: t('sort.created_at_desc')
    }
  ]

const sortProjects = (projects, sortBy, direction) => {
    return projects.sort((a, b) => {
        const aDate = new Date(a[sortBy]);
        const bDate = new Date(b[sortBy]);

        if (direction === 'asc') {
            return aDate - bDate;
        } else {
            return bDate - aDate;

        }
    })
}

const ProjectListDirectMatch = props => {
    const {
        projects,
        projectType,
        isLoading
    } = props;

    const { t } = useTranslation();

    const [ projectSortOrder, setProjectSortOrder ] = useState('desc');
    const [ projectSortBy, setProjectSortBy ] = useState('created_at');

    const value = {
        key: projectSortBy,
        label: t(`sort.${projectSortBy}_${projectSortOrder}`)
    }

    if (isLoading) {
        return (
          <div className="u-flex u-flex--centered u-flex--justify-centered">
              <Loader />
          </div>
        );
    }

    if (projects.length === 0 && !isLoading) {
        return (
            <div className="u-border-separator">
                <h2 className="u-font-medium u-text-uppercase u-margin-bottom-none">
                    {t('projects.directMatchNone')}
                </h2>
            </div>
        );
    }

    const h2Text = t('projects.directMatchNumber', { count: projects.length});

    return (
        <div className="u-border-separator u-padding-bottom-small">
            <div className="u-flex u-flex--space-between u-flex--baseline u-flex--break-md">
                <h2 className="u-font-medium u-text-uppercase u-margin-bottom-none">
                    {h2Text}
                </h2>
                <div className="u-flex u-flex--space-between u-flex--baseline"
                style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
                    <p className="
                        c-sort-dropdown__label
                        u-font-primary u-margin-none
                        u-font-grey-alt u-text-uppercase u-text-bold">{t('sort.sortBy')}</p>
                    <Select
                        components={{ DropdownIndicator }}
                        options={sortByChoices(t)}
                        onChange={data => {
                            const str = data.key;
                            const attrib = str.substring(0, str.lastIndexOf("_"));
                            const dir = str.substring(str.lastIndexOf("_") + 1, str.length);

                            setProjectSortOrder(dir);
                            setProjectSortBy(attrib);
                        }}
                        value={value}
                        isSearchable={false}
                        className="c-sort-dropdown"
                        classNamePrefix='c-sort-dropdown'
                    />
                </div>
            </div>
            <div className="c-project-list">
                {sortProjects(projects, projectSortBy, projectSortOrder)
                    .map(project => (
                        <ProjectListItem item={project} buttonText={t('common.readMore')}
                            type={projectType} key={project.id}
                            hideCompatibility={true}
                        />
                      )
                    )}
            </div>
        </div>
    );
}

export default ProjectListDirectMatch;
