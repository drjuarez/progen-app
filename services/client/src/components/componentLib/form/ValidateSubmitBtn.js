import React, { Component } from 'react';
import {addFormState} from '../../../utils/stateUtils';
import Hover from '../Hover';
import PropTypes from 'prop-types'

class ValidateSubmitBtn extends Component {
  render() {
    const {formName, FormState} = this.props;
    const form = FormState[formName];
    const missingFields = [];
    let buttonDisabled = false;
    console.log(form)
    if(form) {
      form.validateFields.forEach(field => {
        const value = form.fields[field.fieldName];
        if(value === undefined || value === null || value === '') {
          buttonDisabled = true;
          missingFields.push(field.label);
        }
      });
    }

    const hoverNode = missingFields.length ? (
      <div>
        <p>Please Enter</p>
        <ul>
          {missingFields.map(field=><li key={field}>{field}</li>)}
        </ul>
      </div>
    ) : null;

    return (
      <Hover
        data={hoverNode}
      >
        <input
          className='btn btn-primary'
          type='submit'
          value='Save'
          disabled={buttonDisabled}
        />
      </Hover>

    );
  }
}

ValidateSubmitBtn.propTypes = {
  formName: PropTypes.string.isRequired,
  FormState: PropTypes.object.isRequired
};

const ValidateSubmitBtnWithFormState = addFormState(ValidateSubmitBtn);
export default ValidateSubmitBtnWithFormState;
