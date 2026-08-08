id="brep_feature_executor_ts"

import {

    BRepFeature

}

from "./BRepFeature";





import {

    FeatureEvaluationResult

}

from "./BRepFeatureEvaluator";





export type ExecutionStatus =


    "SUCCESS"

    |

    "FAILED"

    |

    "SKIPPED";





export interface ExecutionResult {


    featureId:string;


    status:ExecutionStatus;


    geometry:any;


    message:string;


}





export interface ExecutionContext {


    feature:BRepFeature;


    evaluation:FeatureEvaluationResult;


    previousGeometry:any;


}





export class BRepFeatureExecutor {



    executionHistory:ExecutionResult[];


    operations:Map<string,Function>;





    constructor(){



        this.executionHistory=[];



        this.operations=

            new Map();



        this.registerDefaultOperations();


    }





    /**
     * Operasyon kayıtları
     */
    registerDefaultOperations(){



        this.operations.set(

            "SKETCH",

            this.executeSketch.bind(this)

        );



        this.operations.set(

            "EXTRUDE",

            this.executeExtrude.bind(this)

        );



        this.operations.set(

            "HOLE",

            this.executeHole.bind(this)

        );



        this.operations.set(

            "FILLET",

            this.executeFillet.bind(this)

        );



        this.operations.set(

            "CHAMFER",

            this.executeChamfer.bind(this)

        );



        this.operations.set(

            "PATTERN",

            this.executePattern.bind(this)

        );


    }





    /**
     * Sketch çalıştırma
     */
    executeSketch(

        context:ExecutionContext

    ){



        return {


            type:

                "SKETCH_RESULT",


            entities:

                context.evaluation.parameters


        };


    }





    /**
     * Extrude çalıştırma
     */
    executeExtrude(

        context:ExecutionContext

    ){



        return {


            type:

                "SOLID",


            operation:

                "EXTRUDE",


            length:

                context.evaluation.parameters.length,


            base:

                context.previousGeometry


        };


    }





    /**
     * Hole operasyonu
     */
    executeHole(

        context:ExecutionContext

    ){



        return {


            type:

                "CUT",


            operation:

                "CYLINDER_REMOVE",


            diameter:

                context.evaluation.parameters.diameter,


            depth:

                context.evaluation.parameters.depth,


            target:

                context.previousGeometry


        };


    }





    /**
     * Fillet operasyonu
     */
    executeFillet(

        context:ExecutionContext

    ){



        return {


            type:

                "BLEND",


            radius:

                context.evaluation.parameters.radius,


            target:

                context.previousGeometry


        };


    }





    /**
     * Chamfer operasyonu
     */
    executeChamfer(

        context:ExecutionContext

    ){



        return {


            type:

                "CHAMFER",


            distance:

                context.evaluation.parameters.distance,


            target:

                context.previousGeometry


        };


    }





    /**
     * Pattern operasyonu
     */
    executePattern(

        context:ExecutionContext

    ){



        return {


            type:

                "PATTERN",


            count:

                context.evaluation.parameters.count,


            source:

                context.previousGeometry


        };


    }





    /**
     * Feature çalıştırıcı
     */
    execute(

        context:ExecutionContext

    ):ExecutionResult {



        const operation=

            this.operations.get(

                context.feature.type

            );



        if(!operation){



            const failed={


                featureId:

                    context.feature.id,


                status:

                    "FAILED",


                geometry:null,


                message:

                    "Unsupported operation"


            };



            this.executionHistory.push(

                failed

            );



            return failed;


        }





        try{


            const geometry=

                operation(

                    context

                );



            const result={


                featureId:

                    context.feature.id,


                status:

                    "SUCCESS",


                geometry,


                message:

                    "Execution completed"


            };



            this.executionHistory.push(

                result

            );



            return result;



        }

        catch(error){



            const result={


                featureId:

                    context.feature.id,


                status:

                    "FAILED",


                geometry:null,


                message:

                    String(error)


            };



            this.executionHistory.push(

                result

            );



            return result;


        }


    }





    /**
     * Feature zinciri çalıştırma
     */
    executeAll(

        features:BRepFeature[],

        evaluations:FeatureEvaluationResult[]

    ){



        const results=[];


        let previous=null;



        for(

            let i=0;

            i<features.length;

            i++

        ){



            const result=

            this.execute({


                feature:

                    features[i],



                evaluation:

                    evaluations[i],



                previousGeometry:

                    previous



            });



            previous=

                result.geometry;



            results.push(

                result

            );


        }



        return results;


    }





    /**
     * Son başarılı sonucu getir
     */
    getLastSuccess(){



        return this.executionHistory

            .filter(

                e=>

                e.status==="SUCCESS"

            )

            .at(-1);


    }





    /**
     * Reset
     */
    reset(){


        this.executionHistory=[];


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureExecutor",


            operations:

                this.operations.size,


            executions:

                this.executionHistory.length


        };


    }


}