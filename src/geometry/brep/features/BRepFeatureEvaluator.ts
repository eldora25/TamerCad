
import {

    BRepFeature

}

from "./BRepFeature";





export interface EvaluationContext {


    feature:BRepFeature;


    dependencies:any[];


}





export interface FeatureEvaluationResult {


    featureId:string;


    type:string;


    volume:number;


    area:number;


    mass:number;


    boundingBox:any;


    parameters:any;


}





export class BRepFeatureEvaluator {



    cache:Map<string,FeatureEvaluationResult>;


    density:number;


    tolerance:number;





    constructor(){



        this.cache=

            new Map();



        this.density=

            7850;


        this.tolerance=

            0.001;


    }





    /**
     * Parametre oku
     */
    resolveParameters(

        feature:BRepFeature

    ){



        const result:any={};



        for(

            const parameter of feature.parameters

        ){



            result[parameter.name]=

                parameter.value;


        }



        return result;


    }





    /**
     * Sketch değerlendirme
     */
    evaluateSketch(

        context:EvaluationContext

    ){



        return {


            area:

                0,


            volume:

                0


        };


    }





    /**
     * Extrude hesaplama
     */
    evaluateExtrude(

        context:EvaluationContext

    ){



        const params=

            this.resolveParameters(

                context.feature

            );



        const baseArea=

            params.area || 100;



        const length=

            params.length || 10;



        return {


            area:

                baseArea,


            volume:

                baseArea *

                length


        };


    }





    /**
     * Hole hesaplama
     */
    evaluateHole(

        context:EvaluationContext

    ){



        const params=

            this.resolveParameters(

                context.feature

            );



        const radius=

            (params.diameter || 5)

            /

            2;



        const depth=

            params.depth || 10;



        return {


            removedVolume:

                Math.PI *

                radius *

                radius *

                depth


        };


    }





    /**
     * Fillet hesaplama
     */
    evaluateFillet(

        context:EvaluationContext

    ){



        const params=

            this.resolveParameters(

                context.feature

            );



        return {


            radius:

                params.radius || 1,


            strengthFactor:

                1.05


        };


    }





    /**
     * Chamfer hesaplama
     */
    evaluateChamfer(

        context:EvaluationContext

    ){



        const params=

            this.resolveParameters(

                context.feature

            );



        return {


            distance:

                params.distance || 1


        };


    }





    /**
     * Pattern hesaplama
     */
    evaluatePattern(

        context:EvaluationContext

    ){



        const params=

            this.resolveParameters(

                context.feature

            );



        return {


            count:

                params.count || 1


        };


    }





    /**
     * Feature evaluator dispatcher
     */
    calculate(

        context:EvaluationContext

    ){



        switch(

            context.feature.type

        ){



            case "SKETCH":

                return this.evaluateSketch(

                    context

                );



            case "EXTRUDE":

                return this.evaluateExtrude(

                    context

                );



            case "HOLE":

                return this.evaluateHole(

                    context

                );



            case "FILLET":

                return this.evaluateFillet(

                    context

                );



            case "CHAMFER":

                return this.evaluateChamfer(

                    context

                );



            case "PATTERN":

                return this.evaluatePattern(

                    context

                );



            default:


                return {};


        }


    }





    /**
     * Bounding box hesaplama
     */
    calculateBoundingBox(

        result:any

    ){



        return {


            min:[0,0,0],


            max:[

                10,

                10,

                10

            ],


            size:[

                10,

                10,

                10

            ]


        };


    }





    /**
     * Tam değerlendirme
     */
    evaluate(

        feature:BRepFeature,

        dependencies:any[]=[]

    ):FeatureEvaluationResult {



        const context={


            feature,


            dependencies


        };



        const result=

            this.calculate(

                context

            );



        const evaluation={


            featureId:

                feature.id,


            type:

                feature.type,


            volume:

                result.volume || 0,


            area:

                result.area || 0,


            mass:

                (

                    result.volume || 0

                )

                *

                this.density,


            boundingBox:

                this.calculateBoundingBox(

                    result

                ),


            parameters:

                this.resolveParameters(

                    feature

                )


        };



        this.cache.set(

            feature.id,

            evaluation

        );



        return evaluation;


    }





    /**
     * Feature tree evaluation
     */
    evaluateAll(

        features:BRepFeature[]

    ){



        return features.map(

            feature=>

            this.evaluate(

                feature

            )

        );


    }





    /**
     * Cache getir
     */
    getCached(

        id:string

    ){



        return this.cache.get(

            id

        );


    }





    /**
     * Cache temizle
     */
    invalidate(

        id:string

    ){



        this.cache.delete(

            id

        );


    }





    /**
     * Reset
     */
    reset(){


        this.cache.clear();


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureEvaluator",


            cache:

                this.cache.size,


            density:

                this.density


        };


    }


}