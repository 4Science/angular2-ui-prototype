import { Component } from 'angular2/core';
import { Router } from 'angular2/router';

import {
    FORM_DIRECTIVES,
    FORM_BINDINGS,
    ControlGroup,
    Control,
    FormBuilder,
    NgForm,
    Validators
} from 'angular2/common';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../authorization/services/authorization.service';
import { ContextProviderService } from '../services/context-provider.service';
import { DSpaceService } from '../services/dspace.service';
import { DSpaceDirectory } from '../dspace.directory';
import { FormService } from '../../utilities/form/form.service';

import { CreateComponent } from '../../utilities/form/create.component';
import { FormFieldsetComponent } from '../../utilities/form/form-fieldset.component';
import { FullPageLoaderComponent } from '../../utilities/form/full-page-loader.component';

import { Community } from "../models/community.model";
import { FormInput } from '../../utilities/form/form-input.model';

/**
 * 
 */
@Component({
    selector: 'community-create',
    pipes: [ TranslatePipe ],
    directives: [ FormFieldsetComponent, FullPageLoaderComponent ],
    template: ` 
                <h3>Create Community</h3><hr>
                <full-page-loader *ngIf="processing"></full-page-loader>
                <form *ngIf="active" [ngFormModel]="form" (ngSubmit)="createCommunity()" novalidate>                    
                    <form-fieldset [form]="form" [inputs]="inputs"></form-fieldset>
                    <div class="pull-right">
                        <button type="button" class="btn btn-default btn-sm" (click)="reset()">Reset</button>
                        <button type="submit" class="btn btn-primary btn-sm" [disabled]="!form.valid && processing">Submit</button>
                    </div>
                </form>
              `
})
export class CommunityCreateComponent extends CreateComponent {

    /**
     * Community being created. ngModel
     */
    private community: Community;

    /**
     *
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     * @param dspaceService
     *      DSpaceService is a singleton service to interact with the dspace service.
     * @param formService
     *      FormService is a singleton service to retrieve form data.
     * @param dspace
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param translate
     *      TranslateService
     * @param builder
     *      FormBuilder is a singleton service provided by Angular2.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(private contextProvider: ContextProviderService,
                private dspaceService: DSpaceService,
                private formService: FormService,
                private dspace: DSpaceDirectory,
                private translate: TranslateService,
                private builder: FormBuilder,
                authorization: AuthorizationService,
                router: Router) {
        super(authorization, router);
        translate.setDefaultLang('en');
        translate.use('en');
        this.init();
    }

    /**
     * Initialize the form and validators.
     */
    init(): void {
        this.community = new Community();
        this.formService.getForm('community').subscribe(inputs => {
            this.inputs = inputs;
            let formControls = {};
            for(let input of this.inputs) {
                input.value = input.default ? input.default : '';
                let validators = this.createValidators(input);
                formControls[input.id] = new Control('', Validators.compose(validators));
            }
            this.form = this.builder.group(formControls);
            this.active = true;
        },
        errors => {
            console.log(errors);
        });
    }

    /**
     *
     */
    setModelValues(): void {
        for(let input of this.inputs) {
            if(input.value) {
                this.community[input.key] = input.value;
            }
        }
    }

    /**
     * Reset form.
     */
    reset(): void {
        this.processing = false;
        this.active = false;
        this.init();
    }

    /**
     * Create community.
     */
    private createCommunity(): void {
        this.processing = true;
        let token = this.authorization.user.token;
        let currentContext = this.contextProvider.context;
        this.setModelValues();
        this.dspaceService.createCommunity(this.community, token, currentContext.id).subscribe(response => {
            if(response.status == 200) {
                if(currentContext.root) {
                    this.router.navigate(['/Dashboard']);
                    this.dspace.refresh();
                }
                else {
                    this.router.navigate(['/Communities', { id: currentContext.id }]);
                    this.dspace.refresh(currentContext);
                }
            }
        },
        error => {
            console.log(error);
            this.reset();
        });
    }

}
