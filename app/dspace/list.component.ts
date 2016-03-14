﻿import {Component, Input, View} from 'angular2/core';
import {Router} from 'angular2/router';

import {BreadcrumbService} from './breadcrumb.service';

@Component({
    selector: 'list'
})
@View({
    template: `
                <ul class="list-group">
                    <li *ngFor="#item of items" class="list-group-item">

                        <!-- Router Link -->                    
                        <a (click)="select(item)" class="clickable">{{ item.name }}</a>
                    </li>
                </ul>
              `
})
export class ListComponent {

    @Input() items: Array<Object>;

    constructor(private router: Router, private breadcrumbService: BreadcrumbService) { }

    select(item) {

        this.breadcrumbService.visit(item);

        let link = item.link;
        let start = 0;
        if ((start = link.indexOf('/items')) > 0) {
            link = '/Items' + link.substring(start + 6, link.length);
        }
        else {
            console.log('doh');
        }

        this.router.navigate([link]);
    }

}