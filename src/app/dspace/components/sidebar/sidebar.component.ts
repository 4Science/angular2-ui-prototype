import {Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { ContextProviderService } from '../../../dspace/services/context-provider.service';
import { SidebarService } from '../../../utilities/services/sidebar.service.ts';
import { SidebarSectionComponent } from './sidebar-section.component';

import { SidebarHeaderComponent } from "./sidebar-header.component.ts";

/**
 * Main component to render the sidebar.
 * Will access the sidebarservice to find out which components need to be rendered.
 */
@Component({
    selector: "sidebar",
    styles : ["sidebar"],
    directives: [ROUTER_DIRECTIVES, SidebarSectionComponent, SidebarHeaderComponent],
    template:
        `


            <nav class="sidebar">
                <sidebar-header></sidebar-header>
                <div class="sidebar-scroller">
                    <section *ngFor="let component of sidebarComponents">
                        <sidebar-section *ngIf="component.visible" class="sidebar-section" [sidebarcomponent]="component"></sidebar-section>
                    </section>
                </div>
            </nav>
        `
})

export class SidebarComponent
{

    /**
     *
     */
    private context : any;

    /**
     *
     */
    private sidebarComponents;


    /**
     *
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     * @param sidebarService
     *      SidebarService is a singleton service that provides access to the content of the sidebar
     */
    constructor(private contextProvider: ContextProviderService,
                private sidebarService : SidebarService
    )
    {
        if(contextProvider != null) {
            // when we update the context, we could update the sidebar.
            this.context = contextProvider.context;
            contextProvider.contextObservable.subscribe(x => this.context = x);
        }
        // Catch any event that causes the components array to change.
        this.sidebarComponents = this.sidebarService.components;
        sidebarService.sidebarSubject.subscribe(() =>
        {
            this.sidebarComponents = sidebarService.components;
        });
    }

}