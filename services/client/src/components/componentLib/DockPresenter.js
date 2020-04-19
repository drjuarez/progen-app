import React from 'react';
import Dock from 'react-dock';
import PropTypes from 'prop-types'
import {Accordion, Panel, PanelGroup} from 'reactstrap';

import styles from '../../styles/components/dock-presenter.scss';

const getSections = (sectionNodes) => {
	return sectionNodes.map((section, i) =>
  <Panel
    key={`panelsection${i}`}
    eventKey={`${i}`}
    bsClass='dock-panel'
			>
    <Panel.Heading className={`panel${i}`}>
      <Panel.Title toggle>
        {section.sectionHeader}
      </Panel.Title>
    </Panel.Heading>
    <Panel.Collapse>
      <Panel.Body collapsible>
        {section.sectionContent}
      </Panel.Body>
    </Panel.Collapse>
  </Panel>
	);
}

class DockPresenter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			expandedPanels: this.props.expandedPanels || [0]
		};
	}

	render() {
		const {
			sections,
			renderHeader,
			isVisible,
			position,
			handleToggle,
			size
		} = this.props
		if (this.props.sections) {
			let renderSections = getSections(sections)
			return (
  <section>
    <Dock
      isVisible={isVisible}
      position={position || 'right'}
      onVisibleChange={handleToggle}
      size={size || 1 / 2}
					>
      <div className={`${styles.dockPresenter} container-fluid dock-presenter`}>
        <div className='row'>
          <div className='col-sm-6 dock-header'>
            <a className='dock-close' onClick={handleToggle}>
										Close
            </a>
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-12 dock-header'>
									renderHeader
          </div>
        </div>

        <PanelGroup
          activeKey={this.state.activeKey}
          id='my-nice-panels'
							>
          {renderSections}
        </PanelGroup>
      </div>
    </Dock>
  </section>
			);
		} else {
			console.warn("No Sections given to DockPresenter");
			return null
		}
	}
}

DockPresenter.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	Header: PropTypes.node,
	handleToggle: PropTypes.func,
	expandedPanels: PropTypes.arrayOf(PropTypes.number),
	sections: PropTypes.arrayOf(
		PropTypes.shape({
			sectionHeader: PropTypes.node.isRequired,
			sectionContent: PropTypes.node.isRequired,
		})
	)
}

export default DockPresenter
