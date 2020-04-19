import React, { Component } from 'react';
import {addModelState, addUIState} from '../../utils/stateUtils'

const models = [
  {
    id: 1,
    name: '🖊'
  },
  {
    id: 2,
    name: '🐶'
  },
  {
    id: 3,
    name: '💩'
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
                <div className='round-button'>
                  <div className='round-button-circle'>
                    <a href='http://example.com' className='round-button'>{name}</a>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </nav>
    );
  }

}

export default addModelState(addUIState(Actions));
