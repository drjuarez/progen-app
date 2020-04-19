import React, { Component } from 'react';
import Loader from './Loader';

class Playground extends Component {

  render() {
    return (
      <div>
        <h4>Test Components</h4>
        <div style={{height: '10px', width: '10px'}}>
          <Loader message='enter message prop' />
        </div>
      </div>
    );
  }

}

export default Playground;
