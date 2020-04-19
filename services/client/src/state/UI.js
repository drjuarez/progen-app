import React from 'react';

export const UIState = {
  isLoading: false,
  dockVisible: false,
  openFormIndices: [true, true , false] // TODO: this should be derived from the component somehow
}

export const UIHandlers = {
  toggleLoading: (pastState) => {
    return {isLoading: !pastState.isLoading}
  },
  toggleDockVisible: (pastState) => {
    return {dockVisible: !pastState.dockVisible}
  },
  handleFormIndex: (newIndices) => {
    return {openFormIndices: newIndices}
  }
}

export const UIStateContext = React.createContext(UIState)
export const UIHandlerContext = React.createContext(UIHandlers)
