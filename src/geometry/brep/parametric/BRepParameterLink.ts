import { BRepParameter } from "./BRepParameter";

export interface ParameterLinkOptions{

    parameter:BRepParameter;

    target:any;

    property:string;

}

export class BRepParameterLink{

    readonly parameter:BRepParameter;

    readonly target:any;

    readonly property:string;

    enabled:boolean;

    constructor(options:ParameterLinkOptions){

        this.parameter=options.parameter;

        this.target=options.target;

        this.property=options.property;

        this.enabled=true;

    }

    synchronize():void{

        if(!this.enabled){

            return;

        }

        this.write();

    }

    write():void{

        if(!this.enabled){

            return;

        }

        this.target[this.property]=

            this.parameter.value;

    }

    read():void{

        if(!this.enabled){

            return;

        }

        this.parameter.setValue(

            this.target[this.property]

        );

    }

    validate():boolean{

        return this.property in this.target;

    }

    detach():void{

        this.enabled=false;

    }

    attach():void{

        this.enabled=true;

    }

    info(){

        return{

            parameter:

                this.parameter.id,

            property:

                this.property,

            enabled:

                this.enabled

        };

    }

}