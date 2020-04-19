import React from 'react';
import InputWrapper from './InputWrapper';

const HiddenInput = (props) => {
  // * Hidden input which will allow additional data to be added to firn state
  // PROPS ---------------------------------------------------------------------
  // > name: Key the object will be sent as
  // > initialValue: type of initialValue
  // > handleFieldUpdate-- Callback to be used before setting state
  // ---------------------------------------------------------------------------
  const {initialValue} = props;
  return (
    <div className='form-group'>
      <input
        type='hidden'
        name={name}
        initial={initialValue}
      />
    </div>
  );
};

const wrappedInput = InputWrapper(HiddenInput);
wrappedInput.isFormField = true;
wrappedInput.fieldType = 'standardInput';
export default wrappedInput;
