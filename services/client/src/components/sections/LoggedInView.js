import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from "react-router";
import Header from './Context';
import Statement from './Statement';
import Navigation from './Navigation';
import {addModelState, addUIState} from '../../utils/stateUtils'
import InitProjectForm from '../forms/InitProjectForm'

class LoggedInView extends Component {
  constructor(props) {
    super(props);
    this.onProjectInitFormSubmit = this.onProjectInitFormSubmit.bind(this)
    }

  async componentDidMount() {
    const {
      availableProjects
    } = this.props.ModelState
    const {
      getProject,
    } = this.props.ModelHandlers

    getProject()
  }

  async onProjectInitFormSubmit(projectFormInputs) {
    const {
      storeNewProject
    } = this.props.ModelHandlers
    const {
      history
    } = this.props

   // TODO: check if project id is here-- if it is than post update not new project

   await storeNewProject(projectFormInputs)
  }

  render() {
    const {
      selectedProject
    } = this.props.ModelState

    return (
      <div>
        {/*<Header />*/}
        <section className='main-view'>
          <InitProjectForm selectedProject={selectedProject} handleFormSubmit={this.onProjectInitFormSubmit} />
          <Statement />
        </section>
        <Navigation />
      </div>
    );
  }

}

export default addUIState(addModelState(withRouter(LoggedInView)));
