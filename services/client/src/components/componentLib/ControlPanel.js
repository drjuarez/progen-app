import React, { Component } from 'react';
import '../../styles/components/control-panel.scss';
import Select from 'react-virtualized-select';

class ControlPanel extends Component {
//  Control Panel Used for Adjusting Paramaters on screen
// --------------------------------------------------------
//
// props:
// controls: [{
//  name: string,
//  options: [{value: string, label: string}],
//  value: 'yea'
//  onChange: callback function --> passed new value,
//  multi (optional): bool,
//  span: integer,
//  key: string
// }]
//
// --------------------------------------------------------

  render() {
    return (
      <div className='control-panel'>
        <div className='row'>
          {this.props.controls.map(control =>
            <div className={`col-sm-${control.span}`} key={control.key}>
              <p className='control-label'>{control.name}</p>
            </div>
          )}
        </div>

        <div className='row'>
          {this.props.controls.map(control =>
            <div className={`col-sm-${control.span}`} key={control.key}>
              <Select
                name={control.key}
                value={control.value}
                onChange={control.onChange}
                multi={control.multi}
                options={control.options}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ControlPanel;
