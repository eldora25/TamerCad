import { BRepVertex } from "./BRepVertex";
import { BRepEdge } from "./BRepEdge";
import { BRepLoop } from "./BRepLoop";
import { BRepFace } from "./BRepFace";
import { BRepShell } from "./BRepShell";
import { BRepSolid } from "./BRepSolid";



export interface ValidationResult {


    valid:boolean;


    errors:string[];


    warnings:string[];

}



export class BRepValidator {



    /**
     * Vertex kontrolü
     */
    static validateVertex(
        vertex:BRepVertex
    ):ValidationResult {


        const errors:string[] = [];

        const warnings:string[] = [];



        if(!vertex.point){

            errors.push(
                "Vertex has no geometric point"
            );

        }



        if(
            vertex.edges.length === 0
        ){

            warnings.push(
                "Isolated vertex detected"
            );

        }



        return {

            valid:
                errors.length === 0,

            errors,

            warnings

        };

    }





    /**
     * Edge kontrolü
     */
    static validateEdge(
        edge:BRepEdge
    ):ValidationResult {


        const errors:string[] = [];

        const warnings:string[] = [];



        if(
            !edge.startVertex ||
            !edge.endVertex
        ){

            errors.push(
                "Edge missing vertices"
            );

        }



        if(
            !edge.curve
        ){

            errors.push(
                "Edge missing curve geometry"
            );

        }



        if(
            edge.startVertex
            ===
            edge.endVertex
        ){

            errors.push(
                "Edge has identical start and end vertex"
            );

        }



        return {

            valid:
                errors.length === 0,

            errors,

            warnings

        };

    }





    /**
     * Loop kontrolü
     */
    static validateLoop(
        loop:BRepLoop
    ):ValidationResult {


        const errors:string[] = [];

        const warnings:string[] = [];



        if(
            loop.edges.length === 0
        ){

            errors.push(
                "Loop has no edges"
            );

        }



        if(
            !loop.isClosed()
        ){

            errors.push(
                "Loop is not closed"
            );

        }



        return {

            valid:
                errors.length === 0,

            errors,

            warnings

        };

    }





    /**
     * Face kontrolü
     */
    static validateFace(
        face:BRepFace
    ):ValidationResult {


        const errors:string[] = [];

        const warnings:string[] = [];



        if(
            !face.surface
        ){

            errors.push(
                "Face has no surface"
            );

        }



        const outer =
            this.validateLoop(
                face.outerLoop
            );



        if(
            !outer.valid
        ){

            errors.push(
                ...outer.errors
            );

        }



        for(
            const loop of face.innerLoops
        ){

            const result =
                this.validateLoop(
                    loop
                );


            if(
                !result.valid
            ){

                errors.push(
                    ...result.errors
                );

            }

        }



        return {

            valid:
                errors.length === 0,

            errors,

            warnings

        };

    }





    /**
     * Shell kontrolü
     */
    static validateShell(
        shell:BRepShell
    ):ValidationResult {


        const errors:string[] = [];

        const warnings:string[] = [];



        if(
            shell.faces.length === 0
        ){

            errors.push(
                "Shell contains no faces"
            );

        }



        for(
            const face of shell.faces
        ){

            const result =
                this.validateFace(
                    face
                );


            if(
                !result.valid
            ){

                errors.push(
                    ...result.errors
                );

            }

        }



        if(
            !shell.isClosed()
        ){

            warnings.push(
                "Shell may not be closed"
            );

        }



        return {

            valid:
                errors.length === 0,

            errors,

            warnings

        };

    }





    /**
     * Solid kontrolü
     */
    static validateSolid(
        solid:BRepSolid
    ):ValidationResult {


        const errors:string[] = [];

        const warnings:string[] = [];



        if(
            solid.shells.length === 0
        ){

            errors.push(
                "Solid has no shells"
            );

        }



        for(
            const shell of solid.shells
        ){

            const result =
                this.validateShell(
                    shell
                );


            if(
                !result.valid
            ){

                errors.push(
                    ...result.errors
                );

            }



            warnings.push(
                ...result.warnings
            );

        }



        if(
            !solid.isClosed()
        ){

            warnings.push(
                "Solid is not completely closed"
            );

        }



        return {

            valid:
                errors.length === 0,

            errors,

            warnings

        };

    }





    /**
     * Genel validator
     */
    static validate(
        object:any
    ):ValidationResult {


        if(
            object instanceof BRepVertex
        ){

            return this.validateVertex(
                object
            );

        }



        if(
            object instanceof BRepEdge
        ){

            return this.validateEdge(
                object
            );

        }



        if(
            object instanceof BRepLoop
        ){

            return this.validateLoop(
                object
            );

        }



        if(
            object instanceof BRepFace
        ){

            return this.validateFace(
                object
            );

        }



        if(
            object instanceof BRepShell
        ){

            return this.validateShell(
                object
            );

        }



        if(
            object instanceof BRepSolid
        ){

            return this.validateSolid(
                object
            );

        }



        return {

            valid:false,

            errors:[
                "Unknown BRep object"
            ],

            warnings:[]

        };

    }

}