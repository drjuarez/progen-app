import React, { Component } from 'react'
import {AutoSizer, Grid} from 'react-virtualized'
import PropTypes from 'prop-types'
import Position from './virtualized/Position'

class StatementGrid extends Component {
  constructor(props) {
    super(props);
    this.cellRenderer = this.cellRenderer.bind(this)
  }

  cellRenderer ({ columnIndex, key, rowIndex, style }) {
    console.log("render me timbers")
    if(rowIndex === 0) {
      return (
        <div key={key} style={style} className='statement-cell header first-row'>
          {this.props.data[rowIndex][columnIndex]}
        </div>
      )
    } else if (columnIndex === 0) {
      return (
        <div key={key} style={style} className='statement-cell header first-col'>
          {this.props.data[rowIndex][columnIndex]}
        </div>
      )
    } else {
      return (
        <div key={key} style={style} className='statement-cell data'>
          {Number(this.props.data[rowIndex][columnIndex]).toFixed(2)}
        </div>
      )
    }
  }

  render() {
    console.log("row", this.props.data.length)
    console.log("cp;", this.props.data[0].length)
    return (
      <>
        <Position>
          {({spaceToBottom}) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <Grid
                  ref={(ref) => {this.StatementGrid = ref}}
                  className='cf-statement'
                  fixedcolumnCount={1}
                  fixedRowCount={1}
                  cellRenderer={this.cellRenderer}
                  columnWidth={100}
                  columnCount={this.props.data[0].length}
                  enableFixedColumnScroll
                  enableFixedRowScroll
                  rowHeight={80}
                  rowCount={this.props.data.length}
                  height={spaceToBottom > 480 ? spaceToBottom - 210 : 480}
                  width={width}
                  // rows={this.props.data}
                />
              )}
            </AutoSizer>
          )}
        </Position>
      </>
    );
  }
}

export default StatementGrid
