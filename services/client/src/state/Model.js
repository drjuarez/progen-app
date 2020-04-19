import React from 'react';
import API from '../api/api.js'
import h from '../utils/helpers'

const localStorageKey = "progen-project"

export const ModelState = {
  selectedProject: {
    id: null,
    name: '',
    periodType: '',
    numberPeriods: null,
    proforma: null,
    currency: '',
    financings: [],
  },
  availableProjects: [] || f.numberPeriods,
  proforma: {},
  formStatus: null
}

export const ModelHandlers = {
  getProjects: async () => {
    const p = await API.getProjects()
    return {
      availableProjects: p.entity
    }
  },
  getProject: async() => {
    let project
    try {
      project = JSON.parse(localStorage.getItem(localStorageKey))
    }
    catch (e) {
      console.error("could not parse project from local storage", localStorage.getItem(localStorageKey))
    }

    if (!project) { // nothing is there so use the sample default
      project = sampleProject
    }
    return {
      selectedProject: project
    }
  },

  setProject: async (projectId, pastState) => {
    let foundProject = pastState.availableProjects.find(p => p.id === projectId)
    if(!foundProject) {
      throw new Error(`Project with id ${project.id} not found`)
    }

    const response = await API.fetchIncomeStatement(foundProject.id)
    let proforma
    if (isSuccess(response)) {
      proforma = response.entity
    }

    return {
      selectedProject: foundProject,
      proforma: proforma
    }
  },
  storeNewProject: async (_, __, forms) => {
    const f = forms.project.fields
    let pro = {
      name: f.name,
      periodType: f.periodType,
      numberPeriods: f.numberPeriods,
      financings: [{
        propertyCost: f.propertyCost,
        interestRate: f.interestRate,
        equityDown: f.equityDown,
        loanMaturity: f.loanMaturity || f.numberPeriods,
      }],
      revenues: [{
        rentalIncome: f.rent,
        opex: f.opex,
        vacancyRate: f.vacancy
      }]
    }
    let response = await API.runProject(pro)
    let proforma
    if (isSuccess(response)) {
      // this has the formed project after posting.
      // Eventually we might want to grab other details e.g. payment out of entity
      // for now just grab the proforma and set that
      let projectOutput = response.entity
      proforma = projectOutput.proforma
      proforma.periodType = pro.periodType
      localStorage.setItem(localStorageKey, JSON.stringify(pro))
    }

    return {
      selectedProject: pro,
      proforma: proforma,
    }
  },
  // postNewProject: async (_, __, forms) => {
  //   const f = forms.project.fields
  //   let pro = {
  //     name: f.name,
  //     periodType: f.periodType,
  //     numberPeriods: f.numberPeriods,
  //
  //     financings: [{
  //       interestRate: f.interestRate,
  //       equityDown: f.equityDown,
  //       loanMaturity: f.loanMaturity || f.numberPeriods,
  //     }],
  //     revenues: [{
  //       rentalIncome: f.rent,
  //       opex: f.opex,
  //       vacancyRate: f.vacancy
  //     }]
  //   }
  //   let response = await API.initProject(pro)
  //   let is
  //   let response = await API.makeIncomeStatement(pro)
  //     if (isSuccess(response)) {
  //       is = response.entity
  //     }
  //     // make api call to calcIncomeStatement which doesnt use the db layer
  //
  //   return {
  //     selectedProject: pro,
  //     proforma: is,
  //   }
  // },
  getIncomeStatement: async (id) => {
    const response = await API.fetchIncomeStatement(id)
    return {proforma: response.entity}
  },
  setFormSubmitStatus: async (status) => {
    return {formStatus: status}
  }
}

const isSuccess = response => {
  if (response.status != 200) {
    console.error("bad response from progen api: ", response)
    return false
  } else {
    return true
  }
}

const sampleProject = {
        name: "yoshis castle",
        numberPeriods: 30,
        periodType: 'month',
        financings: [{
          propertyCost: 100000,
          equityDown: 20000,
          interestRate: .1,
          loanMaturity: 30,
        }],
        revenues: [{
          rentalGrowthRate: 0,
          vacancyRate: 90,
          rentalIncome: 1500,
          opex: 100,
        }]
      }

export const ModelStateContext = React.createContext(ModelState)
export const ModelHandlerContext = React.createContext(ModelHandlers)
