import React from 'react';
import InputWrapper from './InputWrapper';
import PropTypes from 'prop-types';

const TextInput = (props) => {
  // * Overview: Text Area To be used with Form
  // PROPS ---------------------------------------------------------------------
  // > label: Label value
  // > className: to append to group
  // > isRequired: force validation on field
  // > name: name on the formObject passed back on form Submission
  // > handleUpdate-- Callback is given from HOC to handleUpdate
  // ---------------------------------------------------------------------------
  const {className, label, value, fieldName, formName,
    FormState, isRequired, handleUpdate, inputType} = props;
  const form = FormState[formName];
  const formValue = (form && form.fields[fieldName]) || value;
  const validationRaised = form && form.raiseValidation;
  return (
    <div className={`pg-form-group form-group ${className}`}>
      <label>{label}{isRequired && '*'}</label>
      <input
        type={inputType}
        className={'form-control pg-input'}
        name={name}
        value={formValue || ''}
        onChange={(e) => handleUpdate(e.target.value)}
      />
      {validationRaised && isRequired && <p>{`${label} is a required field`}</p>}
    </div>
  );
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  handleUpdate: PropTypes.func,
  className: PropTypes.string,
}

const wrappedInput = InputWrapper(TextInput);
wrappedInput.isFormField = true;
wrappedInput.fieldType = 'standardInput';
export default wrappedInput;
