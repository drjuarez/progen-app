import Constants from './VirtualizedTableConstants';
import escapeRegex from './escapeRegex';

/**
* Take in an object with rows and options to do filtering and sorting
* @param {object} options
*/
export const filterAndSort = data => {
	let {columnProps, sortBy, sortDirection, searchInput, filterInputs, discreteFilters, rows} = data;

	let columnDataKeys = [];
	let discreteColumnDataKeys = [];

	columnProps.forEach(prop => {
		columnDataKeys.push(prop.dataKey);
		if (prop.enableDiscreteFilter) discreteColumnDataKeys.push(prop.dataKey);
	});

	let discreteColumnValues = getDiscreteColumnValues(rows, discreteColumnDataKeys);
	let regex = new RegExp(escapeRegex(searchInput), 'i');

	let shouldDoGlobalSearch = searchInput.length > 0;
	let shouldDoColumnSearch = Object.keys(filterInputs).length > 0;
	let shoulDoDiscreteFiltering = Object.keys(discreteFilters).length > 0;

	let filteredRows = rows.filter(row => {
		let matchGlobalSearch = true;
		let matchColumnSearch = true;
		let matchDiscreteFilters = true;
		if (shouldDoGlobalSearch) matchGlobalSearch = matchAnyColumn(row, regex, columnProps, searchInput);
		if (shouldDoColumnSearch) matchColumnSearch = matchColumnSpecificSearch(row, filterInputs, columnProps);
		if (shoulDoDiscreteFiltering) matchDiscreteFilters = matchAgainstDiscreteFilters(row, discreteFilters);

		return matchGlobalSearch && matchColumnSearch && matchDiscreteFilters;
	});

	let sortCol = columnProps.find(col => {
		return col.dataKey === sortBy;
	});
	let dataGetter = sortCol && sortCol.cellDataGetter ? sortCol.cellDataGetter : null;

	filteredRows = sortRows(filteredRows, sortBy, sortDirection, dataGetter);

	return {
		discreteColumnValues,
		filteredRows
	};
};

/**
* Check if any column matches the regex expression
* @param {object} row
* @param {regex} regex
* @param {array} columnProps
* @returns {boolean}
*/
export const matchAnyColumn = (row, regex, columnProps, searchInput) => {
	let matched = false;
	for (let column of columnProps) {
		if (column.matcher) matched = column.matcher({searchInput, dataKey: column.dataKey, row, regex: regex});
		else matched = regex.test(row[column.dataKey]);

		if (matched) break;
	}
	return matched;
};

/**
* Check if row matches their respective column key search
* @param {object} row
* @param {object } filterInputs Object where they key is the column key and value is the column search input
* @returns {boolean}
*/
export const matchColumnSpecificSearch = (row, filterInputs, columnProps) => {
	let matchColumnSearch = Object.keys(filterInputs).reduce((matchedPreviousColumn, dataKey) => {
		let matchedCurrentColumn = true;

		if (filterInputs[dataKey].length > 0) {
			let column = columnProps.find(col => {
				return col.dataKey === dataKey;
			});
			if (column.matcher)
				matchedCurrentColumn = column.matcher({
					searchInput: filterInputs[dataKey],
					dataKey: dataKey,
					row,
					regex: new RegExp(escapeRegex(filterInputs[dataKey]), 'i')
				});
			else matchedCurrentColumn = new RegExp(escapeRegex(filterInputs[dataKey]), 'i').test(row[dataKey]);
		}

		return matchedCurrentColumn && matchedPreviousColumn;
	}, true);

	return matchColumnSearch;
};

/**
* Sort array of objects using key thats in the object
* @param {array} rows
* @param {string} sortBy
* @param {string} sortDirection, [ASC , DESC]
* @returns {array} array of object in sorted order
*/
export const sortRows = (rows, sortBy, sortDirection, cellDataGetter) => {
	let sortedRows;
	if (sortBy) {
		sortedRows = rows.sort((a, b) => {

			const valueA = cellDataGetter ? cellDataGetter({dataKey: sortBy, rowData: a}) : a[sortBy] || '';
			const valueB = cellDataGetter ? cellDataGetter({dataKey: sortBy, rowData: b}) : b[sortBy] || '';

			if (sortDirection === Constants.ASC) return compare(valueA, valueB);

			return compare(valueB, valueA);
		});
		return sortedRows;
	} else {
		return rows;
	}
};

/**
* Compare 2 values
* @param {string || number} a
* @param {string || number} a
* @returns {number}
*/
export const compare = (a, b) => {
	if (typeof a === 'string') {
		return a.localeCompare(b);
	}
	return a - b;
};

/**
* Check if the discrete filters matches the data in a row
* @param {Object} row
* @param {discreteFilters} Object where each key is the dataColumn and the value is the array of filter values
* @returns {boolean}
*/
export const matchAgainstDiscreteFilters = (row, discreteFilters) => {
	let isMatch = true;
	Object.keys(discreteFilters).some(dataKey => {
		if (!discreteFilters[dataKey].includes(row[dataKey])) {
			isMatch = false;
			return true;
		}
	});

	return isMatch;
};

/**
* Give a list of rows return the discrete values for the provided dataKeys
* @param {array} rows
* @param {array} columnDataKeys, keys you want to get discrete values for
* @returns {object} where the keys contains an array of discrete values
*/
export const getDiscreteColumnValues = (rows, columnDataKeys) => {
	let discreteColumnValues = {};

	columnDataKeys.forEach(key => {
		discreteColumnValues[key] = new Set();
	});

	rows.forEach(row => {
		columnDataKeys.forEach(key => {
			discreteColumnValues[key].add(row[key]);
		});
	});

	columnDataKeys.forEach(key => {
		discreteColumnValues[key] = [...Array.from(discreteColumnValues[key])];
	});

	return discreteColumnValues;
};
