/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export {
  State,
  reducer,
  useProcessorsState,
  ProcessorsDispatch,
  Action,
} from './processors_reducer';

export { ON_FAILURE_STATE_SCOPE, PROCESSOR_STATE_SCOPE } from './constants';

export { isChildPath, isOnFailureSelector } from './utils';
