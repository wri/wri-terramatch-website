import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMappedVersionedArray } from '../../helpers';
import DocumentListItem from '../../components/documentList/DocumentListItem';
import AddPitchDocuments from '../addPitchDocuments/AddDocumentsAwardsContainer';
import { Button, Modal } from 'tsc-chameleon-component-library';

const Documents = (props) => {

    const {
        isEditing,
        pitchId,
        getDocuments,
        documentsState,
        getDocumentsInspect,
        documentsInspectState,
        clearCreateDocuments,
        removeDocument,
        removeDocumentState,
        clearRemoveDocument,
        meState,
        orgId
    } = props;

    const { t } = useTranslation();

    const [ documents, setDocuments ] = useState(null);
    const [ addNew, setAddNew ] = useState(false);
    const [ documentToRemove, setDocumentToRemove ] = useState(null);

    useEffect(() => {
        if (meState.data.organisation_id === orgId || meState.data.role === 'admin') {
            getDocumentsInspect(pitchId);
        } else {
            getDocuments(pitchId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    useEffect(() => {
        if (documentsInspectState.data) {
            setDocuments(getMappedVersionedArray(documentsInspectState).data);
        }
    }, [documentsInspectState]);

    useEffect(() => {
        if (documentsState.data) {
            setDocuments(documentsState.data);
        }
    }, [documentsState])


    const onAddNewDocuments = () => {
        getDocumentsInspect(pitchId);
        clearCreateDocuments();
        setAddNew(null);
    };

    const onRemove = (index) => {
        setDocumentToRemove(documents[index]);
    };

    const onDeleteConfirm = () => {
        removeDocument(documentToRemove.id);
    }

    useEffect(() => {
        if (!removeDocumentState.isFetching && removeDocumentState.lastSuccessTime > 0) {
          setDocumentToRemove(null);
          clearRemoveDocument();
          getDocumentsInspect(pitchId);
        }
    }, [clearRemoveDocument, getDocumentsInspect, pitchId, removeDocumentState]);

    const documentList = documents ? documents.map((option, index) =>
        <DocumentListItem
        key={option.id}
        option={option}
        type={option.type}
        editable={isEditing}
        onRemove={(e) => {
            e.preventDefault();
            onRemove(index);
        }} />
    ) : null

    return (
        <section className="c-section c-section--thin-width u-padding-top-large u-margin-top-small">
            {documentToRemove &&
                <Modal show close={() => setDocumentToRemove(null)}>
                    <div className="u-text-center">
                        <h2 className="u-margin-bottom-tiny u-margin-top-none u-font-medium u-text-uppercase">{t('createPitch.details.deleteItem')}</h2>
                        <p>{t('createPitch.details.deleteItemHelp')}</p>
                        <Button
                        className="u-margin-top-large"
                        click={onDeleteConfirm}>
                        {t('common.confirm')}
                        </Button>
                    </div>
                </Modal>
            }
            {
                documents && documents.length > 0  ?
                documentList
                : <p>{t('project.documents.none')}</p>
            }
            {isEditing &&
                <div className="c-section c-section--thin-width u-text-center">
                    <Button variant="outline" click={() => setAddNew(true)}>{t('addDocumentAwards.details.addNewDocuments')}</Button>
                </div>
            }
            {addNew &&
                <AddPitchDocuments
                    pitchId={pitchId}
                    cancelOverrideFunction={() => setAddNew(false)}
                    successOverrideFunction={onAddNewDocuments}
                />
            }
        </section>
    )
};

export default Documents;
