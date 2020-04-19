import React, { Component } from 'react';
import {addModelState, addUIState} from '../../utils/stateUtils'

const models = [
  {
    id: 1,
    name: 'david'
  },
  {
    id: 2,
    name: 'yoshi'
  },
  {
    id: 3,
    name: 'anutha'
  }
]

const selectedID = 1

class Actions extends Component {

  render() {
    return (
      <nav className='actions'>
        <ul className={selectedID ? 'has-selected' : null}>
          {models.map(({ id, name }) => {
            const isSelected = !selectedID && selectedID !== ''
              ? false
              : selectedID === id
            const onClick = isSelected
              ? e => { e.preventDefault() }
              : () => setSelected(id)
            return (
              <li
                className={isSelected ? 'selected' : null}
                key={id}
              >
                <button onClick={onClick}>
                  <span className='title'>{name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    );
  }

}

export default addModelState(addUIState(Actions));
