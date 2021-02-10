import React from 'react';
import PropTypes from 'prop-types';
import ProjectPreviewListItem from './ProjectPreviewListItem';
const ProjectPreviewList = (props) => {
  const { projects, canArchive, onArchive, isOffer, fromUrl, drafts, isMyOrganisation, isAdmin } = props;

  const projectElements = projects.map(project =>
    <ProjectPreviewListItem
      key={project.id}
      project={project}
      canArchive={canArchive}
      onArchive={onArchive}
      isOffer={isOffer}
      fromUrl={fromUrl}
      showStatus={isAdmin || isMyOrganisation || project.visibility === 'fully_invested_funded'} />
  );

  const draftProjectElements = drafts.map(draft => {
    const type = draft.type;
    return draft.data[type] ? (<ProjectPreviewListItem
        key={`${draft.id}-${type}`}
        project={draft.data[type]}
        canArchive={true}
        onArchive={onArchive}
        isOffer={isOffer}
        fromUrl={fromUrl}
        draftId={draft.id}
        isDraft />) : null;
    }
  );

  return (
    <ul className="u-list-unstyled u-margin-vertical-small u-text-center">
      {draftProjectElements}
      {projectElements}
    </ul>
  );
};

ProjectPreviewList.propTypes = {
  projects: PropTypes.array.isRequired,
  drafts: PropTypes.array.isRequired,
  canArchive: PropTypes.bool,
  onArchive: PropTypes.func,
  fromUrl: PropTypes.string
};

ProjectPreviewList.defaultProps = {
  canArchive: false,
  onArchive: () => {},
  onDraftDelete: () => {},
  fromUrl: null
};

export default ProjectPreviewList;
