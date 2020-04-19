import React from 'react';
import shouldComponentUpdate from '../../../utils/shouldComponentUpdate';

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			position: {}
		};
		this.refreshPosition = this.refreshPosition.bind(this);
		this.manualUpdate = this.manualUpdate.bind(this);
		this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
		this.timer = null;
	}
	getPositionAndOffset(el) {
		var rect = el.getBoundingClientRect();
		return {
			bottom: rect.bottom,
			height: rect.height,
			left: rect.left,
			right: rect.right,
			top: rect.top,
			width: rect.width,
			spaceToTop: window.pageYOffset + rect.top,
			spaceToBottom: window.innerHeight - rect.top,
			windowInnerHeight: window.innerHeight,
			windowInnerWidth: window.innerWidth
		};
	}
	manualUpdate() {
		this.refreshPosition();
	}
	refreshPosition() {
		this.setState({
			position: this.getPositionAndOffset(this.refs.rootElement)
		});
	}
	componentDidMount() {
		this.refreshPosition();
		window.onresize = this.refreshPosition;
		this.timer = setInterval(this.refreshPosition, 500);
	}
	componentWillUnmount() {
		window.onresize = null;
		clearInterval(this.timer);
	}
	render() {
		const {children} = this.props;
		return <div ref='rootElement'>{children(this.state.position)}</div>;
	}
}
