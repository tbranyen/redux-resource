import generateReducer from './generate-reducer';
import generateActionTypes from './generate-action-types';
import generateActionCreators from './generate-action-creators';
import {generateDefaultInitialState, xhrStatuses} from './utils';

const supportAllActions = {
  create: true,
  readOne: true,
  readMany: true,
  update: true,
  del: true
};

// resourceName: a string representing the name of the resource. For instance,
//  "books". This will be the name of the store slice in Redux.
// options: a list of options to configure the resource. Refer to the docs
//  for the complete list of options
function simpleResource(resourceName, options = {}) {
  const {initialState, idAttribute, customHandlers, pluralForm, supportedActions} = options;
  const initial = Object.assign({}, generateDefaultInitialState(), initialState);
  const idAttr = idAttribute || 'id';
  const handlers = customHandlers || {};
  const pluralName = pluralForm ? pluralForm : `${resourceName}s`;
  const supportedCrudActions = {
    ...supportAllActions,
    ...supportedActions
  };

  const types = generateActionTypes(resourceName, pluralName, supportedCrudActions);
  const actionCreators = generateActionCreators(supportedCrudActions);

  return {
    actionCreators,
    actionTypes: types,
    initialState: initial,
    reducer: generateReducer({
      pluralForm: pluralName,
      supportedActions: supportedCrudActions,
      initialState: initial,
      idAttr, handlers, types, resourceName
    }),
    pluralForm: pluralName
  };
}

export {xhrStatuses};
export default simpleResource;
