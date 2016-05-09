import 'angular2-universal/polyfills';
import {prebootComplete} from 'angular2-universal';

import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {enableProdMode, provide} from 'angular2/core';

import {
    TranslateLoader,
    TranslateStaticLoader, TranslateService
} from "ng2-translate/ng2-translate";

import {AppComponent} from './app.component';
import {DSpaceService} from './dspace/services/dspace.service';
import {BreadcrumbService} from './navigation/services/breadcrumb.service';
import {PaginationService} from './navigation/services/pagination.service';
import {HttpService} from './utilities/http.service';
import {MetaTagService} from "./utilities/meta-tag/meta-tag.service";
import {PagingStoreService} from './dspace/services/paging-store.service';
import {ItemStoreService} from './dspace/services/item-store.service';
import {DSpaceDirectory} from './dspace/dspace.directory';
import {DSpaceConstants} from './dspace/dspace.constants';
import {MetadataHelper} from "./utilities/metadata.helper";

// Disable Angular 2's "development mode".
// See: https://angular.io/docs/ts/latest/api/core/enableProdMode-function.html
enableProdMode();

/**
* "Bootstrap" the client-side application (i.e. start it up), by directly calling
* the Angular 2 bootstrap() function with our main application component (AppComponent).
* See: https://angular.io/docs/ts/latest/api/platform/browser/bootstrap-function.html
*
* This also initializes all our application's data providers (e.g. services, etc)
* by passing them to the main component. For more on providers/injection, see this blog post:
* http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html
**/
bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'i18n', '.json'),
        deps: [Http]
    }),
    BreadcrumbService,
    DSpaceConstants,
    DSpaceDirectory,
    DSpaceService,
    HttpService,
    ItemStoreService,
    MetaTagService,
    PaginationService,
    MetadataHelper,
    PagingStoreService,
    TranslateService
])
.then(prebootComplete);
