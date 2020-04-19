import React, { Component } from 'react';
import {addFormState} from '../../../utils/stateUtils';
import Dropzone from 'react-dropzone';
import '../../../styles/components/form.scss';


class TextInput extends Component {
  // * Overview: Text Input To be used with Form
  // PROPS ---------------------------------------------------------------------
  // > Label value
  // > className
  // > groupClassName
  // > name
  // > placeholder
  // > type
  // > handleFieldUpdate-- Callback to be used before setting state
  // ---------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    const {FormState, FormHandlers, formName, fieldName, initialValue} = this.props;
    const form = FormState[formName];
    const formValue = form && form.fields[fieldName];
    const value = formValue !== undefined ? formValue : initialValue;
    FormHandlers.updateFormField(formName, fieldName, value);
  }

  async handleUpdate(uploadedFile) {
    const {handleFieldUpdate, FormHandlers, formName, fieldName} = this.props;
    let updateValues = uploadedFile[0];
    if (handleFieldUpdate) updateValues = await handleFieldUpdate(updateValues, formName, fieldName);
    FormHandlers.updateFormField(formName, fieldName, updateValues);
  }

  render() {
    const {className, label, fieldName, formName, FormState, isRequired} = this.props;
    const currentUrl = FormState[formName] && FormState[formName].fields[fieldName];
    return (
      <div className='form-group'>
        <label>{label}{isRequired && '*'}</label>
        <Dropzone
          accept='image/*'
          onDrop={this.handleUpdate}
          multiple={false}
          className={`${className} dropzone-override`}
        >
          <div className='picture-container thumbnail-image'>
            <img src={`/adminApi/image/${currentUrl}`} />
          </div>

        </Dropzone>
      </div>
    );
  }
}

const wrappedInput = addFormState(TextInput);
wrappedInput.isFormField = true;
wrappedInput.fieldType = 'standardInput';
export default wrappedInput;
