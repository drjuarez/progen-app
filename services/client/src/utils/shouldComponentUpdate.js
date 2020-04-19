import isEqual from 'lodash/isEqual';

export default function shouldComponentUpdate(nextProps, nextState) {
	return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
}
