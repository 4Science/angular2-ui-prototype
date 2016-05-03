import {DSpaceObject} from "./dspaceobject.model";
import {ObjectUtil} from "../../utilities/commons/object.util";
import {StringUtil} from "../../utilities/commons/string.util";

import {Metadatum} from './metadatum.model';

export class MetadatumInput extends Metadatum {

    gloss: string;

    type: string;

    repeatable: boolean;

    validation: any;

    edit: boolean;

    default: any;

    constructor(json: any) {
       super(json);
       if (ObjectUtil.isNotEmpty(json)) {
            this.gloss = json.gloss;
            this.type = json.type;
            this.repeatable = json.repeatable;
            this.validation = json.validation;
            this.edit = false;
            this.default = json.default;
        }
    }

}
