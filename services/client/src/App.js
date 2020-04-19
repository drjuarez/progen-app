import 'babel-polyfill';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import Entry from './components/Entry';
import './styles/index.scss';
import 'whatwg-fetch';
import 'babel-polyfill';
import './utils/fetch.js';
import utils from './utils/helpers'
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-dates/initialize';
import {history} from './utils/history'


// Begin State -----------------------------------------------------------------
// import {Ui} from './state/UI';
import {ModelState, ModelHandlers,
  ModelStateContext, ModelHandlerContext} from './state/Model';
import {UIState, UIHandlers,
  UIStateContext, UIHandlerContext} from './state/UI';
import {FormState, FormHandlers,
  FormStateContext, FormHandlerContext} from './state/Forms';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ModelState,
      ModelHandlers,
      UIState,
      UIHandlers,
      FormState,
      FormHandlers,
    };

    this.modelStateSetter = this.modelStateSetter.bind(this)
    this.uiStateSetter = this.uiStateSetter.bind(this)
    this.formStateSetter = this.formStateSetter.bind(this)

    Object.keys(this.state.UIHandlers).forEach(functionName =>
      {
        this.state.UIHandlers[functionName] = this.uiStateSetter(this.state.UIHandlers[functionName]);
      }
    );

    Object.keys(this.state.ModelHandlers).forEach(functionName =>
      {
        this.state.ModelHandlers[functionName] = this.modelStateSetter(this.state.ModelHandlers[functionName]);
      }
    );

    this.state.FormHandlers.setFormState = this.formStateSetter(this.state.FormHandlers.setFormState)
    this.state.FormHandlers.updateFormField = this.formStateSetter(this.state.FormHandlers.updateFormField)
    this.state.FormHandlers.setFieldValidation = this.formStateSetter(this.state.FormHandlers.setFieldValidation)
  }
    // Must decorate funtions in order to get handlers
    // TODO: Refactor below into a nice decorator function DRY MYASSS
    modelStateSetter(datFunction) {
      return async (...args) => {
        const valuesToMerge = await datFunction(
        ...args,
        this.state.ModelState,
        this.state.FormState
        )
        const mergedState = {
          ...this.state.ModelState,
          ...valuesToMerge
        }
        this.setState(utils.deepMergeOverwrite(this.state,
        {
          ModelState: {
            ...mergedState
          }
        }
        ))
      }
    }

    uiStateSetter(datFunction) {
      return async (...args) => {
        const valuesToMerge = await datFunction(...args, this.state.UIState)
        const mergedState = {
          ...this.state.UIState,
          ...valuesToMerge
        }
        this.setState(utils.deepMergeOverwrite(this.state,
          {
            UIState: {
              ...mergedState
            }
          }
        ))
      }
    };

    formStateSetter(datFunction) {
      return async (...args) => {
        const valuesToMerge = await datFunction(...args, this.state.FormState)
        const mergedState = {
          ...this.state.FormState,
          ...valuesToMerge
        }
        this.setState(utils.deepMergeOverwrite(this.state,
          {
            FormState: {
              ...mergedState
            }
          }
        ))
      }
    };

  componentDidMount() {
    window._addNotification = (message, toastType, autoClose) => {
      autoClose = autoClose || 5000;
      if(!toastType) {
        toast.info(message);
      } else if (toastType == 'warn') {
        toast.warn(message, {autoClose: autoClose});
      }
    };
  }

  render() {
    return (
      <div>
        <ToastContainer autoClose={3000} position={toast.POSITION.TOP_LEFT} />
        <ModelStateContext.Provider value={this.state.ModelState}>
          <ModelHandlerContext.Provider value={this.state.ModelHandlers}>
            <UIHandlerContext.Provider value={this.state.UIHandlers}>
              <UIStateContext.Provider value={this.state.UIState}>
                <FormStateContext.Provider value={this.state.FormState}>
                  <FormHandlerContext.Provider value={this.state.FormHandlers}>
                    <BrowserRouter>
                      <Entry />
                    </BrowserRouter>
                  </FormHandlerContext.Provider>
                </FormStateContext.Provider>
              </UIStateContext.Provider>
            </UIHandlerContext.Provider>
          </ModelHandlerContext.Provider>
        </ModelStateContext.Provider>
      </div>
    ) ;
  }
}
