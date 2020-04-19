import React, { Component } from 'react';
import '../../styles/components/circle-button.scss';

class CircleButton extends Component {

  render() {
    const {label, image, buttonType, className} = this.props;
    return (
      <div className={`button-group ${className}`} onClick={this.props.handleClick}>
        <button
          className={`circle-button ${buttonType}`}
          onClick={() => {}}
        >
          <img src={image} />
        </button>
        <div>{label}</div>
      </div>
    );
  }

}

export default CircleButton;
