import React, { Component } from 'react';
import {addFormState} from '../../../utils/stateUtils';
// Use this Higher Order component to share the componentDidMount behaviour and
// HandleUpdate behaviour.  On componentDidMount this allows us to set validation
// as well as fill out the initila value of the form

const AddInput = (RenderComponent) => {
  return class InputWrapper extends Component {
    constructor(props) {
      super(props);
      this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleUpdate(value) {
      const {handleFieldUpdate, FormHandlers, formName, fieldName} = this.props;
      let sendValue = value;
      // HandleFieldUpdate prop will give you an optional callback hook
      if (handleFieldUpdate) sendValue = handleFieldUpdate(value, formName, fieldName);
      FormHandlers.updateFormField(formName, fieldName, sendValue);
    }

    render() {
      return (
        <RenderComponent
          handleUpdate={this.handleUpdate}
          {...this.props}
        />
      );
    }
  };
};

// We must wrap the Render component in the FormSTate HOC as well to get the
// F
export default (RenderComponent) => addFormState(AddInput(RenderComponent));
