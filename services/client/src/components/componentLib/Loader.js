import React, { Component } from 'react';
import '../../styles/components/loader.scss';

class Loader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='loader-container'>
        <div className='loader' />
        <h5>{this.props.message}</h5>
      </div>

    );
  }
}

export default Loader;
