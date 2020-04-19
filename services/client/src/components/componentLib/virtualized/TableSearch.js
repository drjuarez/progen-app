import React from 'react';
import styles from './virtualized-table.scss';

export default class TableSearch extends React.Component {
	constructor(props) {
		super(props);
	}
	static defaultProps = {
		width: 1200
	};

	// static propTypes = {
	// 	searchInput: PropTypes.string.isRequired,
	// 	width: PropTypes.number.isRequired,
	// 	onSearchChange: React.PropTypes.func.isRequired
	// };

	render() {
		const {searchInput, disableSearch} = this.props;

		//Using inline styles because this need to inherit the width of the parent component
		return (
  <div className={`${styles.tableSearch}`} style={{width: `${this.props.width}px`}}>
    <div className={`table-search-container ${disableSearch ? 'disabled-search' : ''}`}>
      {!disableSearch && (
        <div>
          <input
            className='search-input form-control'
            type='text'
            onKeyDown={e => {
									//escape key
									if (e.keyCode === 27) this.props.onSearchChange('');
								}}
            onChange={e => {
									this.props.onSearchChange(e.target.value);
								}}
            value={searchInput}
            placeholder={'Search Table...'}
							/>
          <i className='fa fa-search' />
          {searchInput.length > 0 && (
          <i
            className='fa fa-close'
            onClick={e => {
										this.props.onSearchChange('');
									}}
								/>
							)}
        </div>
					)}
    </div>
    <div className='table-container'>{this.props.children}</div>
  </div>
		);
	}
}
