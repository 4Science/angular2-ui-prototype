import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { RouteSidebarSection } from '../dspace/models/sidebar/routesidebar-section.model';
import { Collection } from '../dspace/models/collection.model';
import { SidebarService } from './services/sidebar.service';


/**
 * Class to populate the sidebar on collection pages.
 */
export class CollectionSidebarHelper
{

    /**
     *
     */
    sections : Array<SidebarSection>;

    /**
     *
     * @type {boolean}
     */
    isAuthenticated : boolean = false;

    /**
     *
     * @param sidebarService
     * @param collection
     * @param userObservable (optional)
     */
    constructor(private sidebarService : SidebarService, private collection : Collection, private authorization? : any)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }

    /**
     * The collection sidebar requires a collection object
     * Because we need some data from the collection to populate the links
     */
    populateSidebar()
    {

        if(this.authorization != null)
        {
            this.isAuthenticated = this.authorization.isAuthenticated();
        }

        let homeChildSection =  RouteSidebarSection.getBuilder()
            .name("sidebar.context-collection.view")
            .route("Collections",{id : this.collection.id})
            .build();

        let browseChildSection = RouteSidebarSection.getBuilder()
            .name("sidebar.context-collection.edit")
            .route("E404")
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .build()

        let addItemSection = RouteSidebarSection.getBuilder()
            .name("sidebar.context-collection.create-item")
            .route("ItemCreate")
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .build();

        let collectionSection = RouteSidebarSection.getBuilder()
            .name("sidebar.context-collection.header")
            .id("context-collection")
            .addChildren([homeChildSection,browseChildSection,addItemSection])
            .build();
        this.sidebarService.addSection(collectionSection);
        this.sections.push(collectionSection);
    }


    /**
     *
     */
    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }
}