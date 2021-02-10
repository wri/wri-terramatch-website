import FORM_TYPES from '../../formInput/FormInputTypes';

export default [
    {
        id: 'type',    
        modelKey: 'type',
        label: 'createPitch.details.carbonCerts.type',
        type: FORM_TYPES.asyncSelect,
        resource: '/carbon_certification_types',
        asyncValue: 'type',
        asyncLabel: 'api.carbon_certification_types',
        translate: true,
        required: true,
        showLabel: true,
    },
    {
        id: 'link',
        modelKey: 'link',
        label: 'createPitch.details.carbonCerts.link',
        type: FORM_TYPES.url,
        required: true,
        showLabel: true,
        validationFuncName: 'requiredCheck'
    }
]