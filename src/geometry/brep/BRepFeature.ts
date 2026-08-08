import { BRepSolid } from "./BRepSolid";



export enum FeatureType {


    BASE =
        "base",


    EXTRUDE =
        "extrude",


    REVOLVE =
        "revolve",


    LOFT =
        "loft",


    SWEEP =
        "sweep",


    FILLET =
        "fillet",


    CHAMFER =
        "chamfer",


    BOOLEAN =
        "boolean",


    PATTERN =
        "pattern"


}





export enum FeatureState {


    CREATED =
        "created",


    VALID =
        "valid",


    FAILED =
        "failed",


    OUTDATED =
        "outdated"


}





export interface FeatureParameter {


    name:string;


    value:any;


}





export interface FeatureDependency {


    parent:BRepFeature;


    relation:string;


}





export interface FeatureResult {


    success:boolean;


    solid:BRepSolid|null;


    message:string;

}





export class BRepFeature {



    id:string;


    name:string;


    type:FeatureType;


    state:FeatureState;


    parameters:FeatureParameter[];


    parents:BRepFeature[];


    children:BRepFeature[];


    result:BRepSolid|null;




    constructor(

        id:string,

        name:string,

        type:FeatureType

    ){


        this.id =
            id;


        this.name =
            name;


        this.type =
            type;


        this.state =
            FeatureState.CREATED;


        this.parameters =
            [];


        this.parents =
            [];


        this.children =
            [];


        this.result =
            null;


    }





    /**
     * Parametre ekleme
     */
    addParameter(

        name:string,

        value:any

    ){



        this.parameters.push(

            {

                name,

                value

            }

        );

    }





    /**
     * Dependency ekleme
     */
    addParent(

        feature:BRepFeature

    ){


        this.parents.push(

            feature

        );


        feature.children.push(

            this

        );

    }





    /**
     * Feature çalıştırma
     */
    execute():FeatureResult {



        /*
            Gerçek CAD:


            Input Features

                 ↓

            Parameter Evaluation

                 ↓

            Geometry Operation

                 ↓

            New BRepSolid


        */



        this.state =
            FeatureState.VALID;



        return {


            success:true,


            solid:this.result,


            message:
                "Feature executed"

        };

    }





    /**
     * Regeneration
     */
    regenerate():FeatureResult {



        this.state =
            FeatureState.OUTDATED;



        return this.execute();

    }





    /**
     * Child update
     */
    updateChildren(){



        for(

            const child of this.children

        ){


            child.regenerate();


        }


    }





    /**
     * Feature geçerlilik
     */
    isValid():boolean {



        return (

            this.state ===

            FeatureState.VALID

        );

    }





    /**
     * Parameter değiştirme
     */
    setParameter(

        name:string,

        value:any

    ){



        const param =

            this.parameters.find(

                p =>
                    p.name === name

            );



        if(param){

            param.value =
                value;

        }


        this.regenerate();


    }





    /**
     * Feature ağacı bilgisi
     */
    tree(){


        return {


            id:
                this.id,


            name:
                this.name,


            type:
                this.type,


            children:

                this.children.length


        };

    }





    /**
     * Clone
     */
    clone():BRepFeature {



        const copy =
            new BRepFeature(

                this.id,

                this.name,

                this.type

            );



        copy.parameters =
            [
                ...this.parameters
            ];



        return copy;

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:
                "BRepFeature",


            status:
                "READY"

        };

    }


}