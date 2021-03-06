/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CoreSetup, CoreStart, Plugin } from 'src/core/public';
import {
  DataPublicPluginSetup,
  DataPublicPluginStart,
  ES_SEARCH_STRATEGY,
} from '../../../../src/plugins/data/public';
import { setAutocompleteService } from './services';
import { setupKqlQuerySuggestionProvider, KUERY_LANGUAGE_NAME } from './autocomplete';
import {
  ASYNC_SEARCH_STRATEGY,
  asyncSearchStrategyProvider,
  enhancedEsSearchStrategyProvider,
} from './search';
import { EnhancedSearchInterceptor } from './search/search_interceptor';

export interface DataEnhancedSetupDependencies {
  data: DataPublicPluginSetup;
}
export interface DataEnhancedStartDependencies {
  data: DataPublicPluginStart;
}

export type DataEnhancedSetup = ReturnType<DataEnhancedPlugin['setup']>;
export type DataEnhancedStart = ReturnType<DataEnhancedPlugin['start']>;

export class DataEnhancedPlugin
  implements Plugin<void, void, DataEnhancedSetupDependencies, DataEnhancedStartDependencies> {
  public setup(
    core: CoreSetup<DataEnhancedStartDependencies>,
    { data }: DataEnhancedSetupDependencies
  ) {
    data.autocomplete.addQuerySuggestionProvider(
      KUERY_LANGUAGE_NAME,
      setupKqlQuerySuggestionProvider(core)
    );
    const asyncSearchStrategy = asyncSearchStrategyProvider(core);
    const esSearchStrategy = enhancedEsSearchStrategyProvider(core, asyncSearchStrategy);
    data.search.registerSearchStrategy(ASYNC_SEARCH_STRATEGY, asyncSearchStrategy);
    data.search.registerSearchStrategy(ES_SEARCH_STRATEGY, esSearchStrategy);
  }

  public start(core: CoreStart, plugins: DataEnhancedStartDependencies) {
    setAutocompleteService(plugins.data.autocomplete);
    const enhancedSearchInterceptor = new EnhancedSearchInterceptor(
      core.notifications.toasts,
      core.application,
      core.injectedMetadata.getInjectedVar('esRequestTimeout') as number
    );
    plugins.data.search.setInterceptor(enhancedSearchInterceptor);
  }
}
