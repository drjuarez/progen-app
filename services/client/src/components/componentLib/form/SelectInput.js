import React from 'react';
import InputWrapper from './InputWrapper';
import Select from 'react-select';

const SelectInput = (props) => {
  // * Overview: Select Input To be used with Form
  // PROPS ---------------------------------------------------------------------
  // > label: Label value
  // > className: to append to group
  // > isRequired: force validation on field
  // > name: name on the formObject passed back on form Submission
  // > options: Avilable to choose from a select
  // > handleUpdate-- Callback is given from HOC to handleUpdate. Can override
  // ---------------------------------------------------------------------------
  const DEFAULT_OPTION = [{
    label: 'No Available Options',
    value: 'No Available Options'
  }];
  const {className, label, fieldName, formName, FormState, isMulti, value,
    clearable, options, isRequired, handleUpdate} = props;
  const form  = FormState[formName];
  const formValue = (form && form.fields[fieldName]) || value;
  let useDefault = false;
  if(options === undefined || !options.length) {
    useDefault = true;
  }
  return (
    <div className={'form-group'}>
      <label>{label}{isRequired && '*'}</label>
      <Select
        name={fieldName}
        value={formValue}
        onChange={(selected) => handleUpdate(selected.value)}
        multi={isMulti}
        options={useDefault ? DEFAULT_OPTION : options}
        clearable={clearable}
        className={className}
      />
    </div>
  );
};

const wrappedInput = InputWrapper(SelectInput);
wrappedInput.isFormField = true;
wrappedInput.fieldType = 'standardInput';
export default wrappedInput;
