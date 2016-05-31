import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';

import { SidebarService } from '../../../utilities/services/sidebar.service.ts';
import { SidebarSection } from '../../models/sidebar/sidebar-section.model';
import { SidebarSectionComponent } from './sidebar-section.component';
import { ArrayUtil } from "../../../utilities/commons/array.util";
/**
 * Main component to render the sidebar. Will access the sidebarservice to find out how much components need to be rendered.
 * Using the sidebarservice
 */
@Component({
    selector: "admin-sidebar",
    directives: [ROUTER_DIRECTIVES, SidebarSectionComponent],
    template:
        `
                <h1>Edit the sidebar</h1>
                <div *ngFor="let entry of entries let j=index" class="panel panel-default"> <!-- one tbody for each resource? -->
                        <div class="panel-heading"> <!-- this needs to be on the top -->
                            <label>Section name <input  class="form-control" placeholder="section name" required [(ngModel)]="entry.componentName"  type="text"/> </label> <!-- here we want to show a plus somewhere? -->
                            <!-- to be implemented later 
                            <label>
                                <input type="checkbox"> Public?
                            </label>
                            -->    
                            <span  class="pull-right glyphicon glyphicon-remove clickable" aria-hidden="true" (click)="removeSection(j)"></span>
                        </div>
                        
                        <!-- we loop over the children but we will, for now, just do it with one level -->
                        <div *ngFor="let child of entry.childsections let i = index" class="panel-body">
                            <label>Name <input class="form-control" [(ngModel)]="child.componentName" required type="text"/></label>
                            <label>Url <input class="form-control" [(ngModel)]="child.url" required type="text"/></label>
                            <input type="hidden" class="form-control" [(ngModel)]="child.id"/>
                            <!-- to be implemented later
                            <label>
                                <input type="checkbox"> Public?
                            </label>
                            -->
                           
                            <!-- we only show the 'plus symbol' on the first entry -->
                            <span *ngIf="i==0" class="glyphicon glyphicon-plus clickable" aria-hidden="true" (click)="addChildSectionField(entry)"></span>
                            <span class="glyphicon glyphicon-remove clickable" aria-hidden="true" (click)="removeChildSection(entry,i)"></span>
                        </div>
                        
                        <!-- if there are no children o the current component, we still want to show an add button to add the first child -->
                        <button *ngIf="!hasChildren(entry)" type="button" class="btn btn-primary btn-sm" (click)="addChildSectionField(entry)">Add child section</button>        
                        
                </div>
            <!-- buttons here -->
            <div id="controls">
                 <button type="button" class="btn btn-primary btn-sm" (click)="addSectionField()">Add section</button>
                 <button type="button" class="btn btn-primary btn-sm" (click)="writeSidebarToFile()">Save changes</button> 
            </div>

        `
})

/**
 * Component for the admin sidebar.
 * Here we can alter the existing sidebar.
 */
export class AdminSidebarComponent
{

    /**
     *
     */
    entries : Array<SidebarSection>;


    constructor(private sidebarService : SidebarService, private http : Http) {

    }

    subscription : any;

    ngOnInit()
    {
        // onsubscribe error mh.
        this.entries = new Array<SidebarSection>();
        this.subscription = this.sidebarService.sidebarSubject.subscribe(x => {this.populateForm();}); // this only runs the first time?

        this.populateForm();
    }

    populateForm()
    {
        let customSections = this.sidebarService.getCustomSections();
        this.entries = customSections.slice(0);
    }

    addSectionField()
    {
        // generate a random ID based on the current time in ms.
        // assign this ID to the SidebarSections with a prefix, so we can easily distinguish which sections were added by users.
        let generatedId : string = "custom-section-" + new Date().getTime();
        let parentSection = SidebarSection.getBuilder().id(generatedId).build();
        this.addChildSectionField(parentSection);
        this.sidebarService.addSection(parentSection);
        this.entries = this.sidebarService.getCustomSections().slice(0);
    }


    addChildSectionField(parent : SidebarSection)
    {
        let generateId : string = "custom-child-section-" + new Date().getTime(); // TODO: move this to the model.
        //parent.childsections.push(SidebarSection.getBuilder().id(generateId).build());
        let childSection = SidebarSection.getBuilder().id(generateId).build();

        this.sidebarService.addChildSection(parent,childSection);

        this.entries = this.sidebarService.getCustomSections().slice(0);
    }

    removeChildSection(parent, child)
    {
        // parent is part of "entries", not of "sidebar".
        // "still does not explain why it doesn't work after navigation"
        parent.childsections.splice(child,1);
    }


    /**
     * Save the current sidebar
     * @returns {Promise<T>}
     */
    writeSidebarToFile()
    {
        return new Promise((resolve,reject) =>
        {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(xhr.response);
                    }else{
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST","http://localhost:3000/customsidebar",true);
            xhr.setRequestHeader("Content-type","application/json");
            let jsonString = JSON.stringify(this.entries);
            xhr.send(jsonString);
        });
    }

    ngOnDestroy()
    {
        // cancel subscription
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }

    removeSection(index)
    {
        let section : SidebarSection = this.entries[index];
        this.sidebarService.removeSection(section);
    }

    hasChildren(parent) : boolean
    {
        return ArrayUtil.isNotEmpty(parent.childsections);
    }
}

