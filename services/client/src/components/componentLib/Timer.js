import React, { Component} from 'react';

class Timer extends Component {
  static defaultProps = {
    interval: 100,
    isRunning: false
  }

  constructor(props) {
    super(props);

    this.count = this.count.bind(this);
    this.stopCounter = this.stopCounter.bind(this);

    this.state = {
      ms: 0.0,
      isRunning: false,
      intervalId: -1
    };
  }

  count() {
    let intervalId = setInterval(() => {
      let newTime = this.state.ms + this.props.interval;
      this.setState({ms: newTime});
    }, this.props.interval);

    this.setState({
      intervalId: intervalId,
      isRunning: true,
      ms: 0.0
    });
  }

  stopCounter() {
    clearInterval(this.state.intervalId);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isRunning) {
      this.count();
    } else if (!nextProps.isRunning) {
      this.stopCounter();
    }
  }

  render() {
    return (
      <div onClick={this.stopCounter}>
        <h4>{this.state.ms / 1000} s</h4>
      </div>
    );
  }

}

export default Timer;
