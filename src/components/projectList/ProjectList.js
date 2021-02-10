import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Loader } from 'tsc-chameleon-component-library';
import ProjectListItem from '../sliderList/ProjectListItem';

const ProjectList = props => {
    const { projects, isLoading, projectType, hideCompatibility, linkParams } = props;
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="u-flex u-flex--centered u-flex--justify-centered">
                <Loader />
            </div>
        );
    }

    return (
        <div className="c-project-list">
            {projects.map(project => (
                <ProjectListItem item={project}
                    buttonText={t('common.readMore')}
                    linkParams={linkParams}
                    type={projectType} key={project.id}
                    hideCompatibility={hideCompatibility}
                />
            ))}
        </div>
    );
};

ProjectList.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    projects: PropTypes.array,
    projectType: PropTypes.oneOf(['funding', 'pitch']),
    linkParams: PropTypes.string
};

ProjectList.defaultProps = {
  projects: [],
  projectType: 'pitch',
  linkParams: ''
};

export default ProjectList;
