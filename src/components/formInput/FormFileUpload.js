import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'tsc-chameleon-component-library';
import { useTranslation } from 'react-i18next';
import uploadIcon from '../../assets/images/icons/upload-icon.png';
import FORM_TYPES from '../../components/formInput/FormInputTypes';
import VideoPreview from '../../components/videoPreview/VideoPreview';

const FormFileUpload = (props) => {
  const {
    onChange,
    inputClasses,
    inputId,
    hasError,
    errorId,
    helpId,
    busy,
    success,
    required,
    accept,
    disabled,
    uploadMessage,
    fileName,
    isSquare,
    value
  } = props;

  const { t } = useTranslation();
  const inputEl = useRef(null);
  const [ preview, setPreview ] = useState(null);

  useEffect(() => {
    if (hasError) {
      inputEl.current.value = null;
    }
  }, [hasError]);

  const onUploadAreaClick = (e) => {
    if (e.keyCode !== 13 && e.keyCode !== undefined) {
      return
    }
    inputEl.current.click();
  };

  const readFileSetPreview = useCallback((file) => {
    if (typeof file === 'string') {
      // It's a url
      setPreview({
        type: accept,
        url: file
      });
    } else if (file[0]) {

      const reader = new FileReader();

      reader.onload = (e) => {
          setPreview({
            type: accept,
            url: e.target.result
          });
      };

      reader.readAsDataURL(file[0]);
    }
  }, [accept]);

  useEffect(() => {
    if ((accept === FORM_TYPES.fileTypes.image || accept === FORM_TYPES.fileTypes.video) && value) {
      readFileSetPreview(value);
    }
  }, [accept, value, readFileSetPreview]);

  const onFileChange = (e) => {
    setPreview(null);
    if (accept === FORM_TYPES.fileTypes.image) {
      const input = e.currentTarget;
      if (input.files && input.files[0]) {
        readFileSetPreview(input.files[0]);
      }
    }

    onChange(e);
  };
  
  return (
    <>
      <input
        id={inputId}
        type="file"
        className={inputClasses}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : helpId}
        disabled={busy ? busy : disabled}
        required={value ? false : required}
        onChange={onFileChange}
        data-testid="input-element"
        accept={accept}
        ref={inputEl}
      />
      {preview && accept === FORM_TYPES.fileTypes.video &&
        <VideoPreview
          src={preview.url}
          className="c-project__video u-margin-vertical"/>
      }
      <div
        className={`u-form__upload-area ${isSquare ? 'u-form__upload-area--square' : ''}`}
        onClick={onUploadAreaClick}
        onKeyDown={onUploadAreaClick}
        role="button"
        tabIndex={0}>
        {(!preview || accept === FORM_TYPES.fileTypes.video) &&
        <>
          <img className="u-form__upload-icon u-margin-horizontal-tiny" src={uploadIcon} alt=""/>
          <p className="u-form__upload-text u-font-medium">
            {t(uploadMessage)}
          </p>
        </>
        }
        {preview && accept === FORM_TYPES.fileTypes.image &&
          <div role="presentation"
            className="u-form__upload-image-preview"
            style={{backgroundImage: `url(${preview.url})`}}>
          </div>
        }
        { busy &&
          <div className="u-overlay u-overlay--light u-flex u-flex--centered u-flex--justify-centered">
            <Loader className="u-margin-tiny"/>
          </div>
        }
      </div>
      { success && !busy && <p> { fileName } </p> }
    </>
  )
}

FormFileUpload.propTypes = {
  onChange: PropTypes.func,
  inputClasses: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
  errorId: PropTypes.string.isRequired,
  helpId: PropTypes.string.isRequired,
  busy: PropTypes.bool,
  success: PropTypes.bool,
  required: PropTypes.bool,
  accept: PropTypes.string,
  disabled: PropTypes.bool,
  uploadMessage: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  isSquare: PropTypes.bool
}

FormFileUpload.defaultProps = {
  onChange: () => {},
  inputClasses: '',
  hasError: false,
  busy: false,
  success: false,
  required: false,
  accept: '',
  disabled: false,
  fileName: '',
  isSquare: false
};

export default FormFileUpload;
