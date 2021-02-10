import FORM_TYPES from '../formInput/FormInputTypes';

export const steps = [
  {
    title: 'createPitch.details.addDocumentsTitle',
    subtext: 'createPitch.details.addDocumentsSubtext',
    nextSubmitButton: 'common.next',
    fields: [
      {
        modelKey: 'docs',
        label: 'addDocumentAwards.details.uploadDocuments',
        type: FORM_TYPES.multiUpload,
        required: true,
        showLabel: true,
        accept: FORM_TYPES.fileTypes.imagePdf,
        uploadMessage: 'addDocumentAwards.details.uploadDocuments'
      }
    ]
  }
];
