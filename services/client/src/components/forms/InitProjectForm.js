// TODO make these paths resolve better
import React, {Component} from 'react';
import Form from '../componentLib/form/Form'
import TextInput from '../componentLib/form/TextInput'
import NumberInput from '../componentLib/form/NumberInput'
import SelectInput from '../componentLib/form/SelectInput'
import ActionButtons from '../componentLib/ActionButtons'
import Collapse from "@kunukn/react-collapse";
import {addFormState, addUIState} from '../../utils/stateUtils'
import constants from '../../constants'
import {UIHandlerContext} from "../../state/UI";

class ProjectForm extends Component {
  render() {
    const {
      selectedProject,
      handleFormSubmit,
      FormState,
      UIState,
      UIHandlers
    } = this.props
    let projectForm = FormState.projectForm && FormState.projectForm.fields
    let loanMaturityValue = null
    if (projectForm) {
      loanMaturityValue = projectForm.loanMaturity || projectForm.numberPeriods
    }

    let {
      openFormIndices
    } = UIState

    let {
      handleFormIndex
    } = UIHandlers

    const handleFormToggle = (i) => {
      openFormIndices[i] = !openFormIndices[i]
      handleFormIndex(openFormIndices)
    }

    const handleExpand = (e) => {
      e.preventDefault()
      let currentStatus = openFormIndices[openFormIndices.length-1] // take fist index to check if expanded
      let newIndices = openFormIndices.map(_ => !currentStatus)
      handleFormIndex(newIndices)
    }
    console.log(selectedProject)
    if (!selectedProject.name) {
      return null
    }

    return (
    <Form formName={'project'} onFormSubmit={handleFormSubmit}>
      <div className='project-init-form'>
        <div className={'pg-form-actions'}>
            <button className='btn btn-submit'>
              Run
            </button>
          <button
            className='action-btn expand'
            onClick={(e) => handleExpand(e)}
          >
              ▽
          </button>
        </div>
        <div className='input-column project-column tile'>
          <h1
            className={'form-title'}
            onClick={() => handleFormToggle(0)}
          >
            Project
          </h1>
          <Collapse isOpen={openFormIndices[0]}>
            <TextInput
              label={'Project Name'}
              fieldName={'name'}
              formName={'project'}
              inputType={'text'}
              isRequired
              value={selectedProject.name}
            />
            <SelectInput
              className={'pg-input'}
              label={'Compounds By'}
              fieldName={'periodType'}
              formName={'project'}
              options={constants.periodTypes.map(p => ({label: p, value: p}))}
              isRequired={false}
              value={selectedProject.periodType}
              />
            <TextInput
              label={'Project Duration'}
              fieldName={'numberPeriods'}
              formName={'project'}
              inputType={'number'}
              isRequired={false}
              value={selectedProject.numberPeriods}
            />
          </Collapse>
        </div>

          <div className='input-column supplemental-column tile'>
            <h1
              className={'form-title'}
              onClick={() => handleFormToggle(1)}
            >
              Financing
            </h1>
            <Collapse isOpen={openFormIndices[1]}>
              <TextInput
                label={'Property Cost'}
                fieldName={'propertyCost'}
                formName={'project'}
                inputType={'number'}
                isRequired={false}
                value={selectedProject.financings[0].propertyCost}
              />
              <TextInput
                label={'Money Down'}
                fieldName={'equityDown'}
                formName={'project'}
                inputType={'number'}
                isRequired={false}
                value={selectedProject.financings[0].equityDown}
              />
              <TextInput
                label={'Loan Maturity'}
                fieldName={'loanMaturity'}
                value={selectedProject.financings[0].loanMaturity}
                formName={'project'}
                inputType={'number'}
                isRequired={false}
              />
              <NumberInput
                label={'Interest Rate'}
                fieldName={'interestRate'}
                formName={'project'}
                inputType={'number'}
                isRequired={false}
                value={selectedProject.financings[0].interestRate}
              />
            </Collapse>
          </div>

        <div className='input-column supplemental-column tile'>
          <h1
            className={'form-title'}
            onClick={() => handleFormToggle(2)}
          >
            Income (TODO)
          </h1>
          <Collapse isOpen={openFormIndices[2]}>
            <TextInput
              className={'pg-input'}
              label={'Price of Rent'}
              fieldName={'rent'}
              formName={'project'}
              inputType={'number'}
              isRequired={false}
              value={selectedProject.revenues[0].rentalIncome}
            />

            <TextInput
              className={'pg-input'}
              label={'Vacancy Rate'}
              fieldName={'vacancy'}
              formName={'project'}
              inputType={'number'}
              isRequired={false}
              value={selectedProject.revenues[0].vacancyRate}
            />

            <TextInput
              className={'pg-input'}
              label={'Annual Operating Expense'}
              fieldName={'opex'}
              formName={'project'}
              inputType={'number'}
              isRequired={false}
              value={selectedProject.revenues[0].opex}
            />
          </Collapse>
        </div>
      </div>
    </Form>
    );
  }
}

export default addUIState(addFormState(ProjectForm));
