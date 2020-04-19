import React, { Component } from 'react'
import Loader from '../componentLib/Loader'
import StatementGrid from '../componentLib/StatementGrid'
import StatementTable from '../componentLib/StatementTable'
import ReactDataGrid from 'react-data-grid';
import {addModelState} from '../../utils/stateUtils'
import {addUIState} from '../../utils/stateUtils'
//
// const mungeData = (data, lineItems) => {
//   console.log(data)
//   let loanSchedule = []
//   const periodHeaderRow = data.beginningPrincipal.map((_, i) => {
//     return `${data.periodType} ${i}`
//   })
//   loanSchedule.push(
//     periodHeaderRow,
//     data.beginningPrincipal,
//     data.interestPayment,
//     data.principalPayment,
//     data.endingPrincipal,
//   )
//   loanSchedule.forEach((row, i) => {
//     row.splice(0, 0, lineItems[i])
//   })
//
//
//   // data.forEach(period => initialStructure.push([]))
//   // const loanSchedule = data.reduce((statement, period, i) => {
//   //   statement[0][i] = `Period ${period.period}`
//   //   statement[1][i] = Number(period.bopPrincipal).toFixed(2)
//   //   statement[2][i] = Number(period.interest).toFixed(2)
//   //   statement[3][i] = Number(period.principalPmt).toFixed(2)
//   //   statement[4][i] = Number(period.eopPrincipal).toFixed(2)
//   //   return statement
//   // }, initialStructure)
//
//   return loanSchedule
// }

// ---------------------------------------------------------------------------

class Statement extends Component {
  constructor(props) {
    super(props);
    this.LINEITEMS = [
      {name: "beginningPrincipal", display: "Beginning Principal"},
      {name: "interestPayment", display: "Interest Payment"},
      {name: "principalPayment", display: "Principal Payment"},
      {name: "endingPrincipal", display: "Ending Principal"},
    ]
  }

  // async componentDidMount() {
  //   const {
  //     getIncomeStatement
  //   } = this.props.ModelHandlers
  //   const {
  //     selectedProject
  //   } = this.props.ModelState
  //
  //   if (selectedProject.id != null) {
  //     await getIncomeStatement(selectedProject.id)
  //   }
  // }

//   async componentDidUpdate(prevProps) {
//     const {
//       selectedProject
//     } = this.props.ModelState.selectedProject
//
//   if (selectedProject && (selectedProject.id !== prevProps.selectedProject.id)) {
//     await getIncomeStatement(selectedProject.id)
//   }
// }

  getColumns(proforma) {
    const colConfig = {
      width: 100,
      editable: false
    }
    let lineItemName = this.LINEITEMS[0].name
    let n = proforma[lineItemName].length
    const nameCol = {
      key: "name",
      name: "name",
      width: 175,
      editable: false,
      frozen: true
    }

    let columns = [nameCol]
    for (let i=0;i<n;i++) {
      let name = `${proforma.periodType} ${i+1}`
      let key = `${proforma.periodType}${i+1}`
      columns.push({key: key, name: name, ...colConfig})
    }
    return columns
  }

  getRowCount() {
    return this.LINEITEMS.length
  }

  getRow(proforma, columns, i ) {
    console.log("i is", i)
    if (i==-1) { // react data grid is sending -1 at end of iteration, idk why
      return
    }
    let row = {}
    let lineItem = this.LINEITEMS[i]
    row["name"] = lineItem.display // add name of line item

    columns.slice(1, columns.length).forEach((column, index) => {
      row[column.key] = formatNum(proforma[lineItem.name][index])
    })

    return row

  }

  render() {
    // const {
    //   isLoading
    // } = this.props.UIState

    const {
      proforma
    } = this.props.ModelState
    let columns
    if (isHere(proforma)) {
      columns = this.getColumns(proforma)
      console.log("columns, ", columns)
    }

    return (
      !isHere(proforma) ?
        <p>No Project selected</p>
      :
        <div className='statement-container'>
          <p>Proforma</p>
          <ReactDataGrid
            columns={columns}
            rowGetter={i => this.getRow(proforma, columns, i)}
            rowsCount={this.getRowCount()}
            onGridRowsUpdated={() => console.log("yuh")}
          />
        </div>
      )
  }
}


const numoptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
function formatNum(num) {
  num = num.toFixed(2)
  return Number(num).toLocaleString('en', numoptions)

}

function isHere(o) {
  return !!Object.keys(o).length;

}

export default addUIState(addModelState(Statement))
