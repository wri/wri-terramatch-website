import React, { useState } from 'react';
import { Button, Modal } from 'tsc-chameleon-component-library';
import { useTranslation } from 'react-i18next';
import FormElements from '../formWalkthrough/FormElements';
import { editForms } from './editForms';

const matchFilters = [
  'land_ownerships',
  'land_types',
  'funding_sources',
  'restoration_goals',
  'funding_bracket',
  'land_size',
  'land_continent',
  'restoration_methods'
];

const ProjectCardEdit = props => {
    const { project, onChange, isOffer, onPitchRestorationEdit } = props;
    const [editForm, setEditForm] = useState(null);

    const { t } = useTranslation();

    const onModalClose = () => {
        setEditForm(null);
    }

    const onFieldPress = field => {
        if (isOffer || (field !== 'restoration_methods' && !isOffer)) {
          setEditForm(editForms[field]);
        } else {
          // Is restoration method and is a pitch
          onPitchRestorationEdit();
        }
    }

    const onFieldChange = () => {
        onChange(project);
        setEditForm(null);
    }

    const categoryList = Object.keys(project)
    .filter(key => matchFilters.includes(key))
    .map(field => {
        return(
          <Button className='c-match-category c-match-category--single' click={() => onFieldPress(field)} key={field}>
            <div className="c-match-category__label">
              <img
                src={require(`../../assets/images/icons/match/${field}.svg`)}
                alt=''
                role='presentation'
              />
              <p className='label u-font-primary'>{t(`api.attributes.${field}`)}</p>
            </div>
          </Button>
        )
    });

    return (
        <div className="c-match u-padding-bottom">
            <Modal show={editForm} close={onModalClose}>
                {editForm &&
                    <>
                    <h2>{t(editForm.title)}</h2>
                    <FormElements
                        fields={editForm.fields}
                        updateField={(update, field) => {
                            const modelKey = field.modelKey;
                            project[modelKey] = update;
                        }}
                        model={project}
                        errors={[]}
                        validationErrorsAfterSubmit={[]}
                        dispatchMethod={() => {}}
                    />
                    <Button className="u-margin-small c-button--small u-float-right"
                        click={onFieldChange}>Update</Button>
                    </>
                }
            </Modal>
            <div className='c-match__heading'>
                <h2 className='u-text-uppercase u-margin-none u-text-center
                    u-margin-top-large'>
                    {t('project.match.editMode')}
                </h2>
                <p className='u-font-primary u-margin-none u-text-center u-margin-bottom-small'>
                    {t('project.match.editModeSub')}
                </p>
            </div>

            {categoryList}
        </div>
    )
};

ProjectCardEdit.defaultProps = {
  onPitchRestorationEdit: () => {}
};

export default ProjectCardEdit;
