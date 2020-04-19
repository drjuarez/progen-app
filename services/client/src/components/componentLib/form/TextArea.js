import React from 'react';
import InputWrapper from './InputWrapper';

const TextArea = (props) => {
  // * Overview: Text Area To be used with Form. Wrapped in InputWrapper HOC
  // PROPS ---------------------------------------------------------------------
  // > label: Label value
  // > className: to append to group
  // > isRequired: force validation on field
  // > name: name on the formObject passed back on form Submission
  // > handleUpdate-- Callback is given from HOC to handleUpdate
  // ---------------------------------------------------------------------------
  const {className, label, fieldName, formName,
    FormState, isRequired, handleUpdate} = props;
  const form = FormState[formName];
  const formValue = form && form.fields[fieldName];
  const validationRaised = form && form.raiseValidation;
  return (
    <div className={`form-group ${className}`}>
      <label>{label}{isRequired && '*'}</label>
      <textarea
        type='text'
        className={`form-control`}
        name={name}
        value={formValue}
        onChange={(e) => handleUpdate(e.target.value)}
      />
      {validationRaised && isRequired && <p>{`${label} is a required field`}</p>}
    </div>
  );
};

const wrappedInput = InputWrapper(TextArea);
wrappedInput.isFormField = true;
wrappedInput.fieldType = 'standardInput';
export default wrappedInput;
