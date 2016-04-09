import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES, Route, RouteConfig, RouteParams} from 'angular2/router';

import {DSpaceDirectory} from '../dspace/dspace.directory';

@Component({
    selector: 'pagination',
    directives: [ROUTER_DIRECTIVES],
    template: `
                <nav *ngIf="pages.length > 1">
                    <ul class="pagination">

                        <li><span aria-label="Previous"><span aria-hidden="true">&laquo;</span></span></li>

                        <li *ngFor="#i of pages" [ngClass]="{active: i == context.page}">

                            <!-- Router Link -->
                            <a [routerLink]="['/' + context.component, {id: context.id, page: i}]">{{ i }}</a>

                        </li>

                        <li><span aria-label="Next"><span aria-hidden="true">&raquo;</span></span></li>

                    </ul>
                </nav>
              `
})
export class PaginationComponent {

    @Input() context: any;

    pages: Array<number>;

    ngOnInit() {        
        this.pages = Array(this.context.pageCount).fill(0).map((e,i)=>i+1);
    }

}
