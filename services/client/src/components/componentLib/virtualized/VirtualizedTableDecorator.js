import React from 'react';
import TableFilterHeader from './TableFilterHeader';
import 'react-virtualized/styles.css';
import './virtualized-table.scss';
import TableSearch from './TableSearch';
import debounce from 'lodash/debounce';
import {filterAndSort} from './virtualizedTableUtils';

const SORT_DIRECTION = {
	ASC: 'ASC',
	DESC: 'DESC'
};

export default class VirtualizedTableDecorator extends React.Component {
	constructor(props) {
		super(props);
		this.createPropsForTable = this.createPropsForTable.bind(this);
		this.overrideColumnComponents = this.overrideColumnComponents.bind(this);
		this.handleSort = this.handleSort.bind(this);
		this.handleFilterSearch = this.handleFilterSearch.bind(this);
		this.handleGlobalSearch = this.handleGlobalSearch.bind(this);
		this.handleDiscreteFilterChange = this.handleDiscreteFilterChange.bind(this);
		this.handleBulkDiscreteFilterChange = this.handleBulkDiscreteFilterChange.bind(this);

		const {sortBy, sortDirection, defaultFilter} = this.props;
		this.state = {
			searchInput: '',
			sortBy: sortBy || '',
			sortDirection: sortDirection || SORT_DIRECTION.ASC,
			filterInputs: defaultFilter || {},
			discreteFilters: {}
		};

		this.rows = props.rows;
		this.discreteColumnValues = {};

		this.debouncedRunworker = debounce(this.runProcessing, 100, {
			trailing: true
		});
	}

	static displayName = 'VirtualizedTableDecorator';

	static defaultProps = {
		//Table related props
		width: 1200,
		height: 400,
		headerHeight: 35,
		rowHeight: 40,
		rows: [],
		rowCount: 0,
		disableSearch: false,
		showRowCount: false,
		//To enable striped table, override the rowClassName to empty
		rowClassName: 'brucke-row-decorator',
		sortBy: '',
		sortDirection: SORT_DIRECTION.ASC,
		defaultFilter: {},
		onSearchChange: () => {}, //Provide consumer the ability to get the search input
		onFilterSearchChange: () => {}, //Provide consumer the ability to get the filter search input
		onDiscreteFilterChange: () => {}, //Provide consumer the ability to get discrete filters
		onSortChange: () => {} //Provide consumer the ability to get sort information
	};

	// static PropTypes = {
	// 	disableSearch: PropTypes.bool,
	// 	showRowCount: PropTypes.bool,
	// 	rowClassName: PropTypes.string,
	// 	onSearchChange: PropTypes.func,
	// 	onFilterSearchChange: PropTypes.func,
	// 	onDiscreteFilterChange: PropTypes.func,
	// 	defaultFilter: PropTypes.object
	// };

	static defaultColumnProps = {
		width: 200
	};

	runProcessing() {
		const columnProps = this.getColumnProps(this.props.children.props.children);

		let rowsAndOptions = {
			columnProps,
			sortBy: this.state.sortBy,
			sortDirection: this.state.sortDirection,
			searchInput: this.state.searchInput,
			filterInputs: this.state.filterInputs,
			discreteFilters: this.state.discreteFilters,
			rows: this.props.rows
		};

		let results = filterAndSort(rowsAndOptions);
		this.rows = results.filteredRows;
		this.discreteColumnValues = results.discreteColumnValues;
		this.forceUpdate();
	}

	/*
    The reason for all the timeouts on user inputs is to allow
    React to render the new input before the computation of
    the dataset else its laggy
  */
	handleSort({sortBy, sortDirection}) {
		this.props.onSortChange({
			sortBy,
			sortDirection
		});

		this.setState(
			{
				sortBy,
				sortDirection
			},
			this.debouncedRunworker
		);
	}

	handleGlobalSearch(input) {
		this.props.onSearchChange(input);
		this.setState(
			{
				searchInput: input
			},
			this.debouncedRunworker
		);
	}

	handleFilterSearch(dataKey, input) {
		let state = {
			filterInputs: {
				...this.state.filterInputs,
				[dataKey]: input
			}
		};
		this.setState(state, this.debouncedRunworker);
		this.props.onFilterSearchChange(state.filterInputs);
	}

	handleDiscreteFilterChange(dataKey, value, checked) {
		let dataKeyFilter = this.state.discreteFilters[dataKey] || [];
		if (checked) dataKeyFilter.push(value);
		else {
			var index = dataKeyFilter.indexOf(value);
			if (index !== -1) dataKeyFilter.splice(index, 1);
		}

		let state = {
			discreteFilters: {
				...this.state.discreteFilters,
				[dataKey]: dataKeyFilter
			}
		};

		if (dataKeyFilter.length === 0) delete state.discreteFilters[dataKey];

		this.setState(state, this.debouncedRunworker);
		this.props.onDiscreteFilterChange(state.discreteFilters);
	}

	handleBulkDiscreteFilterChange(dataKey, discreteValues) {
		let state = {
			discreteFilters: {
				...this.state.discreteFilters,
				[dataKey]: discreteValues
			}
		};
		if (!discreteValues) delete state.discreteFilters[dataKey];

		this.setState(state, this.debouncedRunworker);
		this.props.onDiscreteFilterChange(state.discreteFilters);
	}

	componentWillReceiveProps() {
		this.debouncedRunworker();
	}

	createPropsForTable() {
		const originalTableProps = this.props.children.props;
		const {sortBy, sortDirection} = this.state;

		let newProps = {
			...this.props,
			sort: this.handleSort.bind(this),
			rowCount: this.props.rows.length,
			rowGetter: function({index}) {
				return this.rows[index];
			}.bind({rows: this.state.rows}),
			sortBy: sortBy,
			sortDirection: sortDirection,
			...originalTableProps
		};

		/*
      Virtualized Default header height is 0, we have to completely
      override it when its 0, if you want to hide the header just use the props disableHeader
    */
		if (originalTableProps.headerHeight === 0) newProps.headerHeight = this.props.headerHeight;

		newProps.rowGetter = function({index}) {
			return this.filteredRows[index];
		}.bind({filteredRows: this.rows});
		newProps.rowCount = this.rows.length;

		return newProps;
	}

	overrideColumnComponents(columns) {
		let columnsMapper = columns;
		if (!Array.isArray(columns)) columnsMapper = [columns];
		columnsMapper = [].concat.apply([], columnsMapper);

		let newChildren = columnsMapper.map(column => {
			let newProps = {
				...VirtualizedTableDecorator.defaultColumnProps,
				...column.props
			};

			/*
        Check if the table have a default custom header renderer,
        else we use our custom header renderer
				Can't check function name because webpack mangles
				function names. Check className in function defintion
      */
			if (column.props.headerRenderer.toString().includes('ReactVirtualized__Table__headerTruncatedText'))
				newProps['headerRenderer'] = options => {
					return (
  <TableFilterHeader
    {...options}
    {...newProps}
    filterInput={this.state.filterInputs[options.dataKey] || ''}
    onSort={this.handleSort}
    onInputChange={this.handleFilterSearch}
    discreteValues={this.discreteColumnValues[options.dataKey] || []}
    checkedDiscreteValues={this.state.discreteFilters[options.dataKey] || []}
    onDiscreteFilterChange={this.handleDiscreteFilterChange}
    onBulkDiscreteFilterChange={this.handleBulkDiscreteFilterChange}
	/>
					);
				};

			return React.cloneElement(column, newProps);
		});

		return newChildren;
	}

	getColumnProps(currentNode) {
		let dataKeys = [];
		if (Array.isArray(currentNode)) {
			let flattenArr = [].concat.apply([], currentNode);
			flattenArr.forEach(node => {
				if (node.props.dataKey) dataKeys.push(node.props);
			});
		} else {
			dataKeys.push(currentNode.props);
		}
		return dataKeys;
	}

	resetFilter() {
		this.setState(
			{
				searchInput: '',
				sortBy: '',
				sortDirection: SORT_DIRECTION.ASC,
				filterInputs: {},
				discreteFilters: {}
			},
			this.debouncedRunworker
		);
	}

	render() {
		let newProps = this.createPropsForTable();
		let newChildren = this.overrideColumnComponents(this.props.children.props.children);

		let decoratedTable = React.cloneElement(this.props.children, newProps, newChildren);

		return (
  <TableSearch
    width={newProps.width}
    onSearchChange={this.handleGlobalSearch}
    searchInput={this.state.searchInput}
    disableSearch={this.props.disableSearch}
			>
    {decoratedTable}
    {this.props.showRowCount && newProps.rowCount > 0 && <div className='row-count'>{newProps.rowCount} rows</div>}
  </TableSearch>
		);
	}
}
