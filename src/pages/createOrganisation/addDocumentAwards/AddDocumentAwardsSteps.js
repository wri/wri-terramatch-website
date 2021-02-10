import FORM_TYPES from '../../../components/formInput/FormInputTypes';
import { gaEvent } from '../../../helpers/';

export const steps = [
  {
    title: 'addDocumentAwards.details.title',
    subtext: 'addDocumentAwards.details.subtext',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'docs',
        label: 'addDocumentAwards.details.uploadDocuments',
        type: FORM_TYPES.multiUpload,
        required: true,
        showLabel: true,
        accept: FORM_TYPES.fileTypes.imagePdf,
        uploadMessage: 'addDocumentAwards.details.uploadDocuments',
        unknownErrorKey: 'docs'
      }
    ]
  },
  {
    title: 'addDocumentAwards.details.awardsTitle',
    subtext: 'addDocumentAwards.details.awardsSubtext',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'awards',
        label: 'addDocumentAwards.details.uploadAwards',
        type: FORM_TYPES.multiUpload,
        required: false,
        showLabel: true,
        hasName: true,
        nameLabel: 'addDocumentAwards.details.awardsName',
        addMoreLabel: 'addDocumentAwards.details.addAward',
        accept: FORM_TYPES.fileTypes.imagePdf,
        unknownErrorKey: 'docs',
        onAddItem: () => {
          gaEvent({
            category: 'Organisation creation',
            action: 'User clicked on "Add award"'
          });
        }
      }
    ]
  }
];
