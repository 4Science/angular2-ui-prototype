import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {DSpaceDirectory} from '../dspace.directory';
import {DSpaceService} from '../dspace.service';
import {BreadcrumbService} from '../../navigation/services/breadcrumb.service';
import {ContextComponent} from '../../navigation/components/context.component';

import {AuthorsComponent} from './item/authors.component';
import {DateComponent} from './item/date.component';
import {MetadataComponent} from './item/metadata.component';
import {CollectionComponent} from './item/collection.component';
import {UriComponent} from './item/uri.component';
import {BitstreamsComponent} from './item/bitstreams.component';
import {ThumbnailComponent} from './item/thumbnail.component';

import {Item} from '../models/item.model'

/**
 * A simple item view, the user first gets redirected here and can optionally view the full item view.
 *
 * Item component for displaying the current item.
 * View contains sidebar context and tree hierarchy below current item.
 */
@Component({
    selector: 'simple-item-view',
    directives: [ContextComponent,
                 AuthorsComponent,
                 DateComponent,
                 CollectionComponent,
                 UriComponent,
                 ROUTER_DIRECTIVES,
                 BitstreamsComponent,
                 ThumbnailComponent],
    pipes: [TranslatePipe],
    template: `
                <div class="container" *ngIf="item">

                   <div class="row">
                        <div class="horizontal-slider clearfix">
                            <div class="col-xs-7 col-sm-3">
                                <context [context]="item"></context>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-9">
                                    <div class="item-summary-view-metadata">
                                        <h1>{{item.name}}</h1>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <item-thumbnail></item-thumbnail>
                                                <item-bitstreams [itemBitstreams]="item.bitstreams"></item-bitstreams>
                                                <item-date [itemData]="item.metadata"></item-date>
                                                <item-authors [itemData]="item.metadata"></item-authors>
                                                <h3>Metadata</h3>
                                                <a [routerLink]="['/FullItemView', {id:item.id}]">{{'item-view.show-full' | translate}}</a>
                                            </div>
                                            <div class="col-md-8">
                                                <item-uri [itemData]="item.metadata"></item-uri>
                                                <item-collection [itemParent]="item.parentCollection"></item-collection>
                                            </div>
                                        </div>
                                    </div>
                            </div>

                        </div>
                    </div>
                </div>
              `
})
export class SimpleItemViewComponent {

    private item: Item;

    /**
     *
     * @param params
     *      RouteParams is a service provided by Angular2 that contains the current routes parameters.
     * @param directory
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumb
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     */
    constructor(private params: RouteParams,
                private directory: DSpaceDirectory,
                private breadcrumb: BreadcrumbService) {
        directory.loadObj('item', params.get("id")).then((item:Item) => {
            this.item = item;
            breadcrumb.visit(this.item);
        });
    }

}
