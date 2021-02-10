import FORM_TYPES from '../../formInput/FormInputTypes';

export default [
    {
        modelKey: 'description',
        label: 'createPitch.details.description',
        type: FORM_TYPES.textarea,
        required: true,
    },
    {
        modelKey: 'anticipated_outcome',
        label: 'createPitch.details.anticipatedOutcome',
        type: FORM_TYPES.textarea,
        required: true
    },
    {
        modelKey: 'who_is_involved',
        label: 'createPitch.details.whoIsInvolved',
        type: FORM_TYPES.textarea,
        required: true
    }
]