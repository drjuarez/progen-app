import { Switch } from 'react-router-dom';
import NoMatch from './componentLib/NoMatch';
import React, {Component} from 'react';
import LoggedInView from './sections/LoggedInView';
import LoggedOutView from './sections/LoggedOutView';

const userIsLoggedIn = true
class Entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      message: '',
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      message: error.message
    })
  }

  render() {
    if(this.state.hasError) {
      return (
        <>
          <h4>We Done Goofed 😰 </h4>
          <p>{this.state.message}</p>
        </>
      )
    }

    return (
      <div className='container-fluid app-container'>
        <Switch>
          <>
            {userIsLoggedIn ?
              <LoggedInView /> :
              <LoggedOutView />
            }
          </>
        </Switch>
      </div>
    )
  }
}

export default Entry
