import React, {Component} from 'react';
import {addModelState} from '../../utils/stateUtils'
import Select from 'react-select'

class ProjectPicker extends Component {
    constructor(props) {
        super(props)
        this.handleProjectSelect = this.handleProjectSelect.bind(this)
    }

    handleProjectSelect(selected) {
        const {
            setProject
        } = this.props.ModelHandlers
        setProject(selected.value)
    }

    render() {
        const {
            selectedProject,
            availableProjects
        } = this.props.ModelState
        if (!availableProjects.length) {
            return null
        }
        let options = null
        if (availableProjects) {
            options = availableProjects.map(p => ({label: p.name, value: p.id}))
        }
        return (
          <div className={'project-picker'}>
            <Select
              name='select-project'
              value={selectedProject && selectedProject.id}
              onChange={this.handleProjectSelect}
              multi={false}
              options={options}
            />
          </div>
        )
    }
}

export default addModelState(ProjectPicker)
