import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {addFormState} from '../../../utils/stateUtils';

class Form extends Component {
  // * Overview handles callback and collecting data from context
  // PROPS ---------------------------------------------------------------------
  // > onFormSubmit: callback which handles submission of data
  // ---------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {
      FormHandlers,
      formName
    } = this.props;
    const {
      formValues,
      fieldsToValidate
    } = FormHandlers.initializeFormObjects(this);

    FormHandlers.setFormState(formName, {
      fields: formValues,
      validateFields: fieldsToValidate
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const {
      onFormSubmit,
      FormState,
      FormHandlers,
      formName
    } = this.props;
    const form = FormState[formName];
    if(!form) {
      console.error('No Form found. Check formName prop on Form component');
    }
    await onFormSubmit(FormHandlers.parseForm(form.fields));
  }

  render() {
    const {formName} = this.props;
    return (
      <form name={formName} onSubmit={this.handleSubmit}>
        {this.props.children}
      </form>
    );
  }
}

Form.propTypes= {
  formName: PropTypes.string.isRequired,
  onFormSubmit: PropTypes.func.isRequired
}

const formWithFormState = addFormState(Form);
export default formWithFormState;
