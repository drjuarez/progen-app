import React, { Component } from 'react';
import {addFormState} from '../../../utils/stateUtils';
import 'react-dates/lib/css/_datepicker.css';
import {DateRangePicker} from 'react-dates';
import moment from 'moment';
import '../../../styles/components/date-input-component.scss';

class DateInput extends Component {
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
    let {formName} = this.props;
    if(!formName){
      console.error('Form Name prop not passed in. Please check DateInput Component');
    }

    this.handleDateSet = this.handleDateSet.bind(this);
    const localeData = moment.localeData();
    this.format = localeData.longDateFormat('LL');

    this.state = {
			focusedInput: null
    };
  }

  componentDidMount() {
    let {FormHandlers, formName, dateFromFieldName, dateFromInitialValue,
    dateToFieldName, dateToInitialValue} = this.props;
    const dateFields = {fields: {
      [dateFromFieldName]: dateFromInitialValue,
      [dateToFieldName]: dateToInitialValue
    }};

    FormHandlers.setFormState(formName, dateFields);
  }

  handleDateSet({startDate, endDate}) {
    const {handleFieldUpdate, FormHandlers,
      formName, dateFromFieldName, dateToFieldName,
      dateFromInitialValue, dateToInitialValue} = this.props;

    if(startDate && startDate._isAMomentObject) {
      startDate = moment(startDate).valueOf();
    }
    if(endDate && endDate._isAMomentObject) {
      endDate = moment(endDate).valueOf();
    }

    let dateFields = {
      fields: {
        [dateFromFieldName]: startDate || dateFromInitialValue,
        [dateToFieldName]: endDate || dateToInitialValue
      }
    };

    if(handleFieldUpdate) dateFields = handleFieldUpdate(dateFields, formName, dateFromFieldName, dateToFieldName);
    FormHandlers.setFormState(formName, dateFields);
  }

  render() {
    const {className, label, formName,
      FormState, dateFromFieldName,
      dateToFieldName, isRequired} = this.props;
    const form = FormState[formName];
    const startDate = form && moment(form.fields[dateFromFieldName]).locale('en');
    const endDate = form && moment(form.fields[dateToFieldName]).locale('en');

    return (
      <div className='form-group'>
        <label style={{'display': 'block'}}>{label}{isRequired && '*'}</label>
        <DateRangePicker
          startDate={startDate}
          startDateId='mystartdate'
          endDate={endDate}
          endDateId='myenddate'
          onDatesChange={this.handleDateSet}
          focusedInput={this.state.focusedInput}
          onFocusChange={focusedInput => this.setState({focusedInput})}
          isOutsideRange={() => false}
          minimumNights={0}
        />
      </div>
    );
  }
}

const wrappedInput = addFormState(DateInput);
wrappedInput.isFormField = true;
wrappedInput.fieldType = 'datePicker';
export default wrappedInput;
