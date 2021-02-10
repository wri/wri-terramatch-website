import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DocumentListItem from '../../components/documentList/DocumentListItem';
import { Button, Modal } from 'tsc-chameleon-component-library';
import AddDocumentAwards from '../../pages/createOrganisation/addDocumentAwards/AddDocumentsAwardsContainer';

const Documents = (props) => {
  const { documents,
          editMode,
          getDocumentsInspect,
          organisation,
          removeDocumentState,
          removeDocument,
          clearRemoveDocument,
          clearCreateDocumentAwards } = props;

  const { t } = useTranslation();

  const [ isModal, setIsModal ] = useState(false);
  const [ documentToRemove, setDocumentToRemove ] = useState(null);

  const onAddNewDocuments = () => {
    getDocumentsInspect(organisation.data.id);
    clearCreateDocumentAwards();
    setIsModal(false);
  };

  const onRemove = (index) => {
    setDocumentToRemove(documents.data[index]);
  };

  useEffect(() => {
    if (!removeDocumentState.isFetching && removeDocumentState.lastSuccessTime > 0) {
      setDocumentToRemove(null);
      clearRemoveDocument();
      getDocumentsInspect(organisation.data.id);
    }
  }, [clearRemoveDocument, getDocumentsInspect, organisation.data.id, removeDocumentState]);

  const documentList = documents.data ? documents.data.map((option, index) =>
    <DocumentListItem
      key={option.id}
      option={option}
      type={option.type}
      editable={editMode}
      onRemove={(e) => {
        e.preventDefault();
        onRemove(index);
      }} />
  ) : null;

  return (
    <section className="c-section c-section--thin-width u-padding-top-large">
      {
        documents.data && documents.data.length > 0  ?
        documentList
        : <p>{t('organisation.noDocuments')}</p>
      }
      {editMode &&
        <div className="c-section c-section--thin-width u-text-center">
          <Button variant="outline" click={() => setIsModal(true)}>{t('addDocumentAwards.details.addNewDocumentsAwards')}</Button>
        </div>
      }
      {isModal &&
        <AddDocumentAwards
          cancelOverrideFunction={() => setIsModal(false)}
          successOverrideFunction={onAddNewDocuments}/>
      }

      {documentToRemove &&
        <Modal show close={() => setDocumentToRemove(null)}>
          <div className="u-text-center">
            <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">{t('addDocumentAwards.details.removeDocument')}</h2>
            <p>
              {t('addDocumentAwards.details.removeDocumentHelp', {name: documentToRemove.name})}
            </p>
            <Button
              click={() => {removeDocument(documentToRemove.id)}}
              disabled={removeDocumentState.isFetching}
              className="u-margin-top-large">
              {removeDocumentState.isFetching ? t('common.removing') : t('common.remove')}
            </Button>
          </div>
        </Modal>
      }
    </section>
  );
};

export default Documents;
