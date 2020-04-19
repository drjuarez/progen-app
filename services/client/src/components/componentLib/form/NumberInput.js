import React from 'react';
import InputWrapper from './InputWrapper';
import PropTypes from 'prop-types';

const NumberInput = (props) => {
  // * Overview: Text Area To be used with Form
  // PROPS ---------------------------------------------------------------------
  // > label: Label value
  // > className: to append to group
  // > isRequired: force validation on field
  // > name: name on the formObject passed back on form Submission
  // > handleUpdate-- Callback is given from HOC to handleUpdate
  // ---------------------------------------------------------------------------
  const {className, label, value, fieldName, formName,
    FormState, isRequired, handleUpdate} = props;
  const form = FormState[formName];
  const formValue = (form && form.fields[fieldName]) || value;
  const validationRaised = form && form.raiseValidation;
  return (
    <div className={`pg-form-group form-group ${className}`}>
      <label>{label}{isRequired && '*'}</label>
      <input
        type={"number"}
        className={'form-control pg-input'}
        name={name}
        value={formValue || ''}
        step={".01"}
        onChange={(e) => handleUpdate(e.target.value)}
      />
      {validationRaised && isRequired && <p>{`${label} is a required field`}</p>}
    </div>
  );
};

NumberInput.propTypes = {
  label: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  handleUpdate: PropTypes.func,
  className: PropTypes.string,
}

const wrappedInput = InputWrapper(NumberInput);
wrappedInput.isFormField = true;
wrappedInput.fieldType = 'standardInput';
export default wrappedInput;
