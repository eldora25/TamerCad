import { Point3 } from "../point/Point3";
import { Curve3 } from "../curve/Curve3";

import {
    BRepConstraint
}
from "./BRepConstraint";



export enum SketchEntityType {


    POINT =
        "point",


    LINE =
        "line",


    CIRCLE =
        "circle",


    CURVE =
        "curve"


}





export interface SketchEntity {


    id:string;


    type:SketchEntityType;


    geometry:Curve3|null;


}





export interface SketchProfile {


    closed:boolean;


    curves:Curve3[];


}





export interface SketchResult {


    success:boolean;


    profile:SketchProfile|null;


    error?:string;


}





export class BRepSketch {



    id:string;


    name:string;


    entities:SketchEntity[];


    constraints:BRepConstraint[];


    origin:Point3;




    constructor(

        id:string,

        name:string

    ){


        this.id =
            id;


        this.name =
            name;


        this.entities =
            [];


        this.constraints =
            [];


        this.origin =

            new Point3(

                0,

                0,

                0

            );


    }





    /**
     * Entity ekleme
     */
    addEntity(

        entity:SketchEntity

    ){


        this.entities.push(

            entity

        );

    }





    /**
     * Constraint bağlama
     */
    addConstraint(

        constraint:BRepConstraint

    ){


        this.constraints.push(

            constraint

        );

    }





    /**
     * Sketch çözümü
     */
    solveConstraints(){



        for(

            const constraint of

            this.constraints

        ){


            constraint.solve();


        }


    }





    /**
     * Closed profile kontrolü
     */
    isClosed():boolean {



        const curves =

            this.entities.filter(

                e =>

                e.geometry !== null

            );



        return (

            curves.length > 0

        );

    }





    /**
     * Profil çıkarma
     */
    generateProfile()

    :SketchResult {



        const curves:Curve3[] = [];



        for(

            const entity of

            this.entities

        ){



            if(

                entity.geometry

            ){


                curves.push(

                    entity.geometry

                );

            }

        }



        return {


            success:

                curves.length > 0,


            profile:

            {


                closed:

                    this.isClosed(),


                curves


            }

        };

    }





    /**
     * Feature input hazırlama
     */
    toFeatureInput(){


        return {


            sketchId:

                this.id,


            profiles:

                this.generateProfile()


        };

    }





    /**
     * Entity bulma
     */
    findEntity(

        id:string

    ):SketchEntity|null {



        const entity =

            this.entities.find(

                e =>

                e.id === id

            );



        return entity ?? null;

    }





    /**
     * Entity silme
     */
    removeEntity(

        id:string

    ){


        this.entities =

            this.entities.filter(

                e =>

                e.id !== id

            );


    }





    /**
     * Sketch temizleme
     */
    clear(){


        this.entities = [];


        this.constraints = [];


    }





    /**
     * Sketch bilgisi
     */
    info(){


        return {


            id:

                this.id,


            name:

                this.name,


            entities:

                this.entities.length,


            constraints:

                this.constraints.length


        };

    }





    /**
     * Clone
     */
    clone(){


        const copy =

            new BRepSketch(

                this.id,

                this.name

            );



        copy.entities =

            [

                ...this.entities

            ];



        copy.constraints =

            [

                ...this.constraints

            ];



        return copy;

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:

                "BRepSketch",


            status:

                "READY"

        };

    }


}