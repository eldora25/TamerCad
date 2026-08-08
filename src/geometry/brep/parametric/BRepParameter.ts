export type BRepParameterType =
    | "number"
    | "integer"
    | "boolean"
    | "string"
    | "angle"
    | "length"
    | "area"
    | "volume"
    | "mass"
    | "time"
    | "custom";

export interface BRepParameterOptions {

    id:string;

    name:string;

    type:BRepParameterType;

    value:any;

    unit?:string;

    min?:number;

    max?:number;

    readOnly?:boolean;

}

export interface SerializedParameter {

    id:string;

    name:string;

    type:BRepParameterType;

    value:any;

    unit?:string;

}

export class BRepParameter {

    readonly id:string;

    name:string;

    readonly type:BRepParameterType;

    unit?:string;

    private _value:any;

    min?:number;

    max?:number;

    readOnly:boolean;

    dirty:boolean;

    version:number;

    constructor(options:BRepParameterOptions){

        this.id=options.id;

        this.name=options.name;

        this.type=options.type;

        this.unit=options.unit;

        this._value=options.value;

        this.min=options.min;

        this.max=options.max;

        this.readOnly=options.readOnly ?? false;

        this.dirty=false;

        this.version=1;

    }

    get value(){

        return this._value;

    }

    set value(v:any){

        this.setValue(v);

    }

    setValue(v:any){

        if(this.readOnly){

            throw new Error("Parameter is read-only");

        }

        this.validate(v);

        if(this._value===v){

            return;

        }

        this._value=v;

        this.version++;

        this.dirty=true;

    }

    validate(v:any){

        if(typeof v==="number"){

            if(this.min!==undefined && v<this.min){

                throw new Error("Parameter below minimum");

            }

            if(this.max!==undefined && v>this.max){

                throw new Error("Parameter above maximum");

            }

        }

    }

    clearDirty(){

        this.dirty=false;

    }

    clone(){

        return new BRepParameter({

            id:this.id,

            name:this.name,

            type:this.type,

            value:this._value,

            unit:this.unit,

            min:this.min,

            max:this.max,

            readOnly:this.readOnly

        });

    }

    serialize():SerializedParameter{

        return{

            id:this.id,

            name:this.name,

            type:this.type,

            value:this._value,

            unit:this.unit

        };

    }

    static deserialize(data:SerializedParameter){

        return new BRepParameter({

            id:data.id,

            name:data.name,

            type:data.type,

            value:data.value,

            unit:data.unit

        });

    }

    info(){

        return{

            id:this.id,

            name:this.name,

            type:this.type,

            value:this._value,

            dirty:this.dirty,

            version:this.version

        };

    }

}