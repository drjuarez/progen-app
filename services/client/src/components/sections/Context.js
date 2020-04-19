import React, {Component} from 'react';
import {withRouter} from 'react-router'
import {addModelState, addUIState} from '../../utils/stateUtils'
import ProjectPicker from './ProjectPicker'


class Context extends Component {
    constructor(props) {
        super(props)
        this.goToIncomeStatement = this.goToIncomeStatement.bind(this)
    }

    goToIncomeStatement() {
        const {history} = this.props
        history.push('/statement')
    }

    render() {
        const {toggleDockVisible} = this.props.UIHandlers
        const {selectedProject} = this.props.ModelState

        return (
          <div className='context-header'>
            {selectedProject.id ?
              (
                <section className='header-section inputs-toggle'>
                  <div className={'context-nav'}>
                    <span onClick={this.goToIncomeStatement}>🖊Income Statement</span>
                  </div>
                </section>
              )
              :
                <section className={'header-section'}>
                  <p>Pick a project</p>
                </section>
            }
            <section className={'header-section pick-project'} />
          </div>
        );
    }

}

export default addModelState(addUIState(withRouter(Context)))
