import React from 'react';
import styles from './virtualized-table.scss';
import OverlayTrigger from 'reactstrap/lib/OverlayTrigger';
import Popover from 'reactstrap/lib/Popover';

export default class TableHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	// static propTypes = {
	// 	dataKey: PropTypes.string,
	// 	label: PropTypes.string,
	// 	sortBy: PropTypes.string,
	// 	sortDirection: PropTypes.string
	// };

	//All the elements in header trigger a sort but we only want the ASC and DESC buttons to do it
	onToggleDropDown(e) {
		e.stopPropagation();
	}

	render() {
		const {
			label,
			sortBy,
			sortDirection,
			dataKey,
			disableSort,
			disableSearchFiltering,
			enableDiscreteFilter,
			checkedDiscreteValues = [],
			discreteValues
		} = this.props;

		const overlay = (
  <Popover className={`${styles.filterPopup} filter-popup`} id={`${label.toLowerCase()}-popover`}>
    {!disableSort && (
    <div className='btn-group' role='group'>
      <button
        type='button'
        className={`btn ${dataKey === sortBy && sortDirection === 'ASC' ? 'active' : ''}`}
        onClick={this.props.onSort.bind(this, {
								sortBy: dataKey,
								sortDirection: 'ASC'
							})}
						>
							Ascending
      </button>
      <button
        type='button'
        className={`btn ${dataKey === sortBy && sortDirection === 'DESC' ? 'active' : ''}`}
        onClick={this.props.onSort.bind(this, {
								sortBy: dataKey,
								sortDirection: 'DESC'
							})}
						>
							Descending
      </button>
    </div>
				)}

    <div className='filter-search-container'>
      {!disableSearchFiltering && (
        <div>
          <input
            className='search-input form-control'
            type='text'
            onChange={e => {
									this.props.onInputChange(dataKey, e.target.value);
								}}
            value={this.props.filterInput}
            placeholder={`Filter ${label.toLowerCase()}`}
							/>
          <i className='fa fa-search' />
        </div>
					)}
      {this.props.filterInput.length > 0 && (
        <i
          className='fa fa-close'
          onClick={e => {
								this.props.onInputChange(dataKey, '');
							}}
						/>
					)}
      {enableDiscreteFilter && (
        <div>
          <label>Displayed Values</label>
          <hr />
          <div className='select-all-container'>
            {checkedDiscreteValues.length === discreteValues.length ? (
              <a
                href='javascript:void(0);'
                onClick={this.props.onBulkDiscreteFilterChange.bind(this, dataKey, null)}
									>
										Deselect All
              </a>
								) : (
  <a
    href='javascript:void(0);'
    onClick={this.props.onBulkDiscreteFilterChange.bind(this, dataKey, discreteValues)}
									>
										Select All
  </a>
								)}
          </div>
          <div className='discrete-filter-container'>
            {this.props.discreteValues.map(value => (
              <div key={value}>
                <input
                  type='checkbox'
                  className='checkbox'
                  checked={checkedDiscreteValues.includes(value)}
                  onClick={e => {
												this.props.onDiscreteFilterChange(dataKey, value, e.target.checked);
											}}
										/>
                <span className='checkbox-value'>{value}</span>
              </div>
								))}
          </div>
        </div>
					)}
    </div>
  </Popover>
		);

		return (
  <div
    className={`${styles.tableHeader} table-header`}
    ref={ref => {
					let forceUpdate = false;
					if (this.filterHeader === undefined) forceUpdate = true;
					this.filterHeader = ref;
					if (forceUpdate) this.forceUpdate();
				}}
    onClick={e => {
					if (e.target.tagName !== 'BUTTON') e.stopPropagation();
				}}
			>
    <OverlayTrigger
      container={this.filterHeader}
      overlay={overlay}
      onClick={this.onToggleDropDown}
      trigger='click'
      rootClose
      placement='bottom'
				>
      <span className='edit-column-trigger'>
        <span className='header-label'>
          {(this.props.filterInput.length > 0 || checkedDiscreteValues.length > 0) && (
            <i className='fa fa-circle filter-indicator' />
							)}
          {label}
        </span>
        {dataKey === sortBy && (
        <i className={`fa table-header-icon ${sortDirection === 'ASC' ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
						)}
      </span>
    </OverlayTrigger>
  </div>
		);
	}
}
