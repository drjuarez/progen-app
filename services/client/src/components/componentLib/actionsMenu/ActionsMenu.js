import React from 'react';
import OverlayTrigger from 'reactstrap/lib/OverlayTrigger';
import Popover from 'reactstrap/lib/Popover';
import shouldComponentUpdate from '../../../utils/shouldComponentUpdate';
import styles from './actions-menu.scss';

class ActionMenu extends React.Component {
	constructor() {
		super();
		this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
	}
	// static PropTypes = {
	// 	title: PropTypes.string,
	// 	trigger: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
	// 	rootClose: PropTypes.bool
	// };

	static defaultProps = {
		title: 'Actions...',
		trigger: 'focus',
		rootClose: false
	};

	onClick(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	render() {
		const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
		const overlay = (
  <Popover id='actions-menu' className={`actions-menu-popover ${styles.actionsMenu}`}>
    <ul className='action-menu-list'>{children.map((child, i) => (child ? <li key={i}>{child}</li> : null))}</ul>
  </Popover>
		);
		return (
  <OverlayTrigger
    trigger={this.props.trigger}
    placement='bottom'
    overlay={overlay}
    container={this}
    rootClose={this.props.rootClose}
			>
    <a
      className={`${styles.actionsMenu} actions-menu`}
      href='javascript:void(0);'
      onClick={this.onClick}
      tabIndex={1}
				>
      {this.props.title}
    </a>
  </OverlayTrigger>
		);
	}
}

export default ActionMenu;
