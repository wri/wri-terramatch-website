import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ProjectListItem from '../sliderList/ProjectListItem';
const ProjectPreviewListItem = (props) => {
  const { project, canArchive, onArchive, isOffer, fromUrl, isDraft, draftId, showStatus } = props;
  const { t } = useTranslation();

  return (
    <li className="u-display-inline-block">
      <ProjectListItem
        item={project}
        buttonText={isDraft ? t('common.continue') : t('common.readMore')}
        canArchive={canArchive}
        onArchive={onArchive}
        type={isOffer ? 'funding' : 'pitch'}
        hideCompatibility
        fromUrl={fromUrl}
        showStatus={showStatus}
        isDraft={isDraft}
        draftId={draftId} />
    </li>
  );
};

ProjectPreviewListItem.propTypes = {
  project: PropTypes.object.isRequired,
  canArchive: PropTypes.bool,
  onArchive: PropTypes.func,
  fromUrl: PropTypes.string,
  isDraft: PropTypes.bool,
  draftId: PropTypes.number
};

ProjectPreviewListItem.defaultProps = {
  canArchive: false,
  onArchive: () => {},
  fromUrl: null,
  isDraft: false,
  draftId: null
};

export default ProjectPreviewListItem;
