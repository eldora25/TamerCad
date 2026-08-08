import { Solid }
from "../../topology/core/Solid";


import { Face }
from "../../topology/core/Face";


import { Shell as TopologyShell }
from "../../topology/core/Shell";


import { BRepBuilder }
from "../../topology/brep/BRepBuilder";



export interface ShellOptions {


    inward?:boolean;


    removeFaces?:Face[];


    preserveTopology?:boolean;


}







export class Shell {



    constructor(

        public solid:Solid,


        public thickness:number,


        public options:

        ShellOptions = {}

    ){}





    build():

    Solid {



        const builder =

        new BRepBuilder();



        const outerFaces =

        this.solid.getFaces();



        const innerFaces =

        outerFaces.map(

            face =>

            this.offsetFace(

                face

            )

        );



        const wallFaces =

        this.createWallFaces(

            outerFaces,

            innerFaces

        );



        const allFaces = [

            ...innerFaces,

            ...wallFaces

        ];



        const shell =

        builder.createShell(

            allFaces

        );



        return builder.createSolid(

            shell

        );

    }







    private offsetFace(

        face:Face

    ):

    Face {



        // Gerçek kernel'de burada:

        // Surface offset algoritması çalışır.



        return face;

    }







    private createWallFaces(

        outer:Face[],

        inner:Face[]

    ):

    Face[] {



        const walls:

        Face[]=[];



        const count =

        Math.min(

            outer.length,

            inner.length

        );



        for(

            let i=0;

            i<count;

            i++

        ){



            walls.push(

                outer[i]

            );

        }



        return walls;

    }



}