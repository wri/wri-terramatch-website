import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormInput from './FormInput';
import FORM_TYPES from './FormInputTypes';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';
import DocumentListItem from '../documentList/DocumentListItem';
import { Button } from 'tsc-chameleon-component-library';
import { getRawResponseErrors } from '../../helpers';

const FormMutiUpload = (props) => {
  const {
          onChange,
          value,
          upload,
          uploadState,
          clearUpload,
          accept,
          hasName,
          addMoreLabel,
          fileNameLabel,
          onAddItem,
          uploadMessage,
          required,
          unknownErrorKey
        } = props;
  const [ selectedOptions, setSelectedOptions ] = useState(value ? value : []);
  const [ currentFile, setCurrentFile ] = useState(null);
  const [ fileName, setFileName ] = useState('');
  const [ uploadedFileName, setUploadedFileName ] = useState('');
  const [ errors, setErrors ] = useState([]);

  const valueChange = useCallback((value) => {
    const values = [...selectedOptions];
    const index = values.indexOf(value);

    if (index > -1) {
      values.splice(index, 1);
    } else {
      values.push(value);
    }

    // If already in, remove it, else add it.
    onChange({value: values});
    setSelectedOptions(values);
  }, [onChange, selectedOptions]);

  const removeItem = (index) => {
    const options = [...selectedOptions];
    options.splice(index, 1);
    onChange({value: options});
    setSelectedOptions(options);
  };

  const files = selectedOptions.map((option, index) =>
    <DocumentListItem
      key={option.id || option.document}
      option={option}
      onRemove={(e) => {
        e.preventDefault();
        removeItem(index);
      }}
      editable
      type={hasName ? 'award' : 'document'}/>
  );

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      clearUpload();
      setErrors([]);
      upload({file});
      setCurrentFile(file);
      setUploadedFileName(file.name);
    }
  };

  const addItem = (e) => {
    e.preventDefault();
    onAddItem();
    if (currentFile && fileName.length > 0 && currentFile.id) {
      valueChange({
        id: currentFile.id,
        name: fileName,
        lastModifiedDate: currentFile.lastModifiedDate
      });
      clearUpload();
      setCurrentFile(null);
      setFileName('');
      setUploadedFileName('');
    }
  }

  useEffect(() => {
    if (!uploadState.isFetching && uploadState.data && !uploadState.error && uploadState.lastSuccessTime > 0) {
      if (!currentFile) {
        clearUpload();
        return;
      }
      // currentFile.id = uploadState.data.id;
      setCurrentFile((currentFile) => {
        currentFile.id = uploadState.data.id;
        return currentFile;
      });
      if (!hasName) {
        valueChange(currentFile);
        setCurrentFile(null);
        clearUpload();
      }
    } else if (uploadState.error) {
      setErrors(() => {
        const errors = getRawResponseErrors(uploadState).map(error => {
          if (error.source === 'unknown') {
            return {
              ...error,
              source: unknownErrorKey
            }
          }
          return error;
        });

        return errors;
      });
    }
  }, [clearUpload, currentFile, uploadState, valueChange, hasName, unknownErrorKey]);

  return (
    <div className={`c-form__multi-upload`}>
      <FormInput
        type={FORM_TYPES.file}
        onChange={onFileChange}
        label="file-upload"
        id="fileupload"
        className="u-margin-bottom-small"
        busy={uploadState.isFetching}
        success={uploadState.lastSuccessTime > 0}
        fileName={hasName ? uploadedFileName : null}
        accept={accept}
        errors={errors}
        uploadMessage={uploadMessage}
        required={files.length === 0 && required}
      />
    {hasName &&
      <>
        <FormInput
          type={FORM_TYPES.text}
          onChange={(e) => setFileName(e.currentTarget.value)}
          label={fileNameLabel}
          id="fileuploadname"
          value={fileName}
          showLabel
          className="u-margin-top-large"
        />
        <Button click={addItem} disabled={fileName.length === 0}>
          {addMoreLabel}
        </Button>
      </>
    }
      {files}
    </div>
  );
};

FormMutiUpload.propTypes = {
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  uploadState: initialAsyncStatePropType.isRequired,
  upload: PropTypes.func.isRequired,
  onAddItem: PropTypes.func,
  unknownErrorKey: PropTypes.string
};

FormMutiUpload.defaultProps = {
  onChange: () => {},
  onAddItem: () => {},
  unknownErrorKey: 'unknown'
};

export default FormMutiUpload;
