import React, { Component } from 'react';
import Form from '../componentLib/form/Form'
import TextInput from '../componentLib/form/TextInput'
import {addFormState} from '../../utils/stateUtils'

class FinancingForm extends Component {

  render() {
    return (
      <div>
        <div className='row'>
          <div className='col-sm-9'>
            <TextInput
              label={'Loan Maturity'}
              fieldName={'loanMaturity'}
              formName={'project'}
              inputType={'number'}
              isRequired={false}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-9'>
            <TextInput
              label={'Interest Rate'}
              fieldName={'interestRate'}
              formName={'project'}
              inputType={'number'}
              isRequired={false}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            <TextInput
              label={'Property Cost'}
              fieldName={'propertyCost'}
              formName={'project'}
              inputType={'number'}
              isRequired={false}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            <TextInput
              label={'Equity Down'}
              fieldName={'equityDown'}
              formName={'project'}
              inputType={'number'}
              isRequired={false}
            />
          </div>
        </div>
      </div>
    );
  }

}

export default addFormState(FinancingForm);
