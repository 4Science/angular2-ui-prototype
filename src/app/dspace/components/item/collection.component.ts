import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../../dspace.directory';

import {DSpaceService} from '../../dspace.service';

import {Item} from "../../models/item.model"
import {Collection} from "../../models/collection.model"

import {TruncatePipe} from "../../../utilities/pipes/truncate.pipe"

import {TranslatePipe} from "ng2-translate/ng2-translate";

import {ViewElementComponent} from './view-element.component';

/**
 * Component for the collections of the simple-item-view.
 * When you click on the collection name, it has to redirect to the right collection.
 */
@Component({
    selector: 'item-collection',
    inputs: ['itemData'],
    directives: [ViewElementComponent],
    pipes: [TranslatePipe],
    template:
        `
        <view-element [header]="component_title | translate">
             <a [attr.href]="collectionURIPrefix+itemData.id">{{ itemData.name }}</a>
        </view-element>
        `
})

export class CollectionComponent {

    private component_title = "item-view.collection.title";
    private itemData : Object;
    private collectionURIPrefix = "../collections/";
    constructor(private params: RouteParams,private directory: DSpaceDirectory)
    {
    }


}
