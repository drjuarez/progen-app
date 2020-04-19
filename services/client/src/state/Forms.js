import React from 'react';
import h from '../utils/helpers';

// Gives a function for setting the entire form object
const setFormState = (formName, fields) => {
  let updatedForm = {};
  Object.keys(fields).forEach(fieldKey => {
    updatedForm[fieldKey] = fields[fieldKey];
  });
  return {[formName]: updatedForm};
};

const updateFormField = (formName, fieldName, newValue) => {
  const newFormState = {
    [formName]: {
      fields: {
        [fieldName]: newValue
      }
    }
  };
  return {...newFormState};
};

const setFieldValidation = (formName, fieldName, label, formState) => {
  let form = formState[formName];
  form.validateFields.push({
    fieldName: fieldName,
    label: label
  });
  const newFormState = {
    [formName]: {
      validateFields: form.validateFields
    }
  };
  return {...newFormState}
};


const initializeFormObjects = (domToTraverse) => {
  const formValues = {};
  let fieldsToValidate = [];
  h.traverseDomTree(
    domToTraverse,
    (domNode) => {
      const {isFormField, fieldType} = domNode.type;
      if(isFormField) {
        switch (fieldType) {

          case 'standardInput':
            formValues[domNode.props.fieldName] = domNode.props.value;
            if(domNode.props.isRequired) {
              fieldsToValidate.push({
                fieldName: domNode.props.fieldName,
                label: domNode.props.label
              });
            }
            break;

          case 'datePicker':

          formValues[domNode.props.dateFromFieldName] =
            domNode.props.dateFromInitialValue;
          formValues[domNode.props.dateToFieldName] =
            domNode.props.dateToInitialValue;
          if(domNode.props.isRequired) {
            fieldsToValidate.push({
              fieldName: domNode.props.fieldName,
              label: domNode.props.label
            });
          }
          break;
        }
      }
    }
  );
  return {
    formValues: formValues,
    fieldsToValidate: fieldsToValidate
  };
};


const parseForm = (originalFormValues) => {
  const returnObject = {};

  Object.keys(originalFormValues).forEach(key => {
    const value = originalFormValues[key];

    // Indicates we are dealing with a nested form
    if(key.substring(0, 2) == '[]') {
      const r = /[^|]+(?=|)/g;
      const options = key.match(r);
      const propertyName = options[1];
      const valueName = options[2];
      const elementTracker = parseInt(options[3]);

      // Initialize empty array for the form
      if(returnObject[propertyName] === undefined) {
        returnObject[propertyName] = [];
      }
      // Initialize empty array on the property
      if(returnObject[propertyName][elementTracker] === undefined) {
        returnObject[propertyName][elementTracker] = {};
      }

      returnObject[propertyName][elementTracker][valueName] = value;
    } else {
      returnObject[key] = value;
    }
  });
  return returnObject;
};


export const FormHandlers = {
  setFormState: setFormState,
  updateFormField: updateFormField,
  setFieldValidation: setFieldValidation,
  parseForm: parseForm,
  initializeFormObjects: initializeFormObjects
};

export const FormState = {}

export const FormHandlerContext = React.createContext(FormHandlers);
export const FormStateContext = React.createContext(FormState);
