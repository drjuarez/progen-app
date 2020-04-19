import {ModelStateContext, ModelHandlerContext} from '../state/Model';
import {UIStateContext, UIHandlerContext} from '../state/UI';
import {FormStateContext, FormHandlerContext} from '../state/Forms';
import React from 'react';

// TODO: combine all into one function that subscribe to all states
export function addModelState(Component) {
  return function injectedState(props) {
    return (
      <ModelStateContext.Consumer>
        {ModelState =>  (
          <ModelHandlerContext.Consumer>
            {ModelHandlers => (
              <Component {...props}
                ModelState={ModelState}
                ModelHandlers={ModelHandlers}
              />
            )}
          </ModelHandlerContext.Consumer>
        )
      }
      </ModelStateContext.Consumer>
    );
  };
}

export function addUIState(Component) {
  return function injectedState(props) {
    return (
      <UIStateContext.Consumer>
        {UIState =>  (
          <UIHandlerContext.Consumer>
            {UIHandlers => (
              <Component {...props}
                UIState={UIState}
                UIHandlers={UIHandlers}
              />
            )}
          </UIHandlerContext.Consumer>
        )
      }
      </UIStateContext.Consumer>
    );
  };
}

export function addFormState(Component) {
  return function injectedState(props) {
    return (
      <FormStateContext.Consumer>
        {FormState =>  (
          <FormHandlerContext.Consumer>
            {FormHandlers => (
              <Component {...props}
                FormState={FormState}
                FormHandlers={FormHandlers}
              />
            )}
          </FormHandlerContext.Consumer>
        )
      }
      </FormStateContext.Consumer>
    );
  };
}
