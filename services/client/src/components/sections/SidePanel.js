import React, {Component} from 'react';
import {addModelState, addUIState} from '../../utils/stateUtils'
import DockPresenter from '../componentLib/DockPresenter'
import FinancingForm from '../forms/FinancingForm'

const dockHeader = () => (
  <div>
    <p>A Beautiful Header </p>
  </div>
)

const dockSection1 = {
  sectionHeader: (
    <div>
      <p>Financing</p>
    </div>
  ),
  sectionContent: <FinancingForm />
}

class SidePanel extends Component {
  render() {
    const {
      dockVisible
    } = this.props.UIState

    const {
      toggleDockVisible
    } = this.props.UIHandlers

    return (
      <DockPresenter
        isVisible={dockVisible}
        renderHeader={dockHeader}
        sections={[dockSection1]}
        handleToggle={toggleDockVisible}
      />
    );
  }
}

export default addUIState(addModelState(SidePanel))
