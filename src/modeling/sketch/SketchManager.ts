import { Sketch }
from "./Sketch";


import { SketchPlane }
from "./SketchPlane";


import { SketchSolver }
from "./SketchSolver";


import { SketchValidator }
from "./SketchValidator";


import { SketchProfile }
from "./SketchProfile";


import { SketchEntity }
from "./SketchEntity";







export interface SketchManagerResult {


    success:boolean;


    message?:string;

}







export class SketchManager {



    private sketches:

    Map<string, Sketch> =

    new Map();





    private activeSketch:

    Sketch|null = null;





    private validator:

    SketchValidator;







    constructor(){



        this.validator =

        new SketchValidator();

    }







    createSketch(

        id:string,


        plane:

        SketchPlane

    ):

    Sketch {



        const sketch =

        new Sketch(

            id,

            plane

        );



        this.sketches.set(

            id,

            sketch

        );



        this.activeSketch =

        sketch;



        return sketch;

    }







    deleteSketch(

        id:string

    ):

    boolean {



        const removed =

        this.sketches.delete(

            id

        );



        if(

            this.activeSketch?.id === id

        ){

            this.activeSketch =

            null;

        }



        return removed;

    }







    getSketch(

        id:string

    ):

    Sketch|null {



        return (

            this.sketches.get(

                id

            )

            ??

            null

        );

    }







    getActiveSketch():

    Sketch|null {



        return this.activeSketch;

    }







    activateSketch(

        id:string

    ):

    boolean {



        const sketch =

        this.getSketch(

            id

        );



        if(

            !sketch

        ){

            return false;

        }



        this.activeSketch =

        sketch;



        return true;

    }







    renameSketch(

        id:string,


        name:string

    ):

    boolean {



        const sketch =

        this.getSketch(

            id

        );



        if(

            !sketch

        ){

            return false;

        }



        sketch.name =

        name;



        return true;

    }







    solve(

        sketch?:

        Sketch

    ):



    SketchSolver {



        const target =

        sketch ??

        this.activeSketch;



        if(

            !target

        ){

            throw new Error(

                "No active sketch"

            );

        }



        const solver =

        new SketchSolver(

            target.entities,


            target.constraints

        );



        solver.solve();



        return solver;

    }







    validate(

        sketch?:

        Sketch

    )

    {



        const target =

        sketch ??

        this.activeSketch;



        if(

            !target

        ){

            return [];

        }



        return this.validator

        .validateSketch(

            target

        );

    }







    createProfile(

        entities:

        SketchEntity[]

    ):

    SketchProfile {



        return new SketchProfile(

            entities

        );

    }







    findEntity(

        entityId:string

    ):

    SketchEntity|null {



        for(

            const sketch of

            this.sketches.values()

        ){



            const entity =

            sketch.entities.find(

                e =>

                e.id === entityId

            );



            if(

                entity

            ){

                return entity;

            }

        }



        return null;

    }







    update():

    void {



        if(

            this.activeSketch

        ){



            this.solve(

                this.activeSketch

            );

        }

    }







    listSketches():

    Sketch[] {



        return Array.from(

            this.sketches.values()

        );

    }



}