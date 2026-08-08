
import {

    BRepFeature,

    BRepFeatureType

}

from "./BRepFeature";





export type OptimizationGoal =


    "MINIMIZE_WEIGHT"

    |

    "MINIMIZE_COMPLEXITY"

    |

    "MAXIMIZE_STRENGTH"

    |

    "MANUFACTURABILITY"

    |

    "PERFORMANCE";





export interface OptimizationParameter {


    featureId:string;


    parameter:string;


    current:any;


    optimized:any;


    improvement:number;


}





export interface OptimizationResult {


    success:boolean;


    goal:OptimizationGoal;


    improvements:OptimizationParameter[];


    score:number;


}





export class BRepFeatureOptimizer {



    features:BRepFeature[];


    history:OptimizationResult[];





    constructor(){



        this.features=[];


        this.history=[];


    }





    /**
     * Feature ekleme
     */
    addFeature(

        feature:BRepFeature

    ){



        this.features.push(

            feature

        );


    }





    /**
     * Feature karmaşıklığı
     */
    analyzeComplexity(){



        let complexity=0;



        for(

            const feature of this.features

        ){



            complexity +=

                feature.parameters.length;


        }



        return {


            features:

                this.features.length,


            complexity


        };


    }





    /**
     * Parametre optimizasyonu
     */
    optimizeParameter(

        feature:BRepFeature,

        parameter:string,

        value:any

    ):OptimizationParameter {



        const current=

            feature.parameters.find(

                p=>

                p.name===parameter

            );



        return {


            featureId:

                feature.id,


            parameter,


            current:

                current?.value,


            optimized:

                value,


            improvement:

                0.15


        };


    }





    /**
     * Fillet optimizasyonu
     */
    optimizeFillet(

        feature:BRepFeature

    ){



        if(

            feature.type==="FILLET"

        ){



            return this.optimizeParameter(

                feature,

                "radius",

                1.5

            );


        }



        return null;


    }





    /**
     * Hole optimizasyonu
     */
    optimizeHole(

        feature:BRepFeature

    ){



        if(

            feature.type==="HOLE"

        ){



            return this.optimizeParameter(

                feature,

                "diameter",

                4

            );


        }



        return null;


    }





    /**
     * Extrude optimizasyonu
     */
    optimizeExtrude(

        feature:BRepFeature

    ){



        if(

            feature.type==="EXTRUDE"

        ){



            return this.optimizeParameter(

                feature,

                "length",

                8

            );


        }



        return null;


    }





    /**
     * Feature sırası optimizasyonu
     */
    optimizeOrder(){



        this.features.sort(

            (

                a,

                b

            )=>{


                return a.parameters.length -

                       b.parameters.length;


            }

        );



        return {


            reordered:true


        };


    }





    /**
     * Hedef bazlı optimizasyon
     */
    optimize(

        goal:OptimizationGoal

    ):OptimizationResult {



        const improvements:

            OptimizationParameter[]=[];



        for(

            const feature of this.features

        ){



            let result;



            switch(feature.type){


                case "FILLET":

                    result=

                        this.optimizeFillet(

                            feature

                        );

                    break;



                case "HOLE":

                    result=

                        this.optimizeHole(

                            feature

                        );

                    break;



                case "EXTRUDE":

                    result=

                        this.optimizeExtrude(

                            feature

                        );

                    break;


            }



            if(result){


                improvements.push(

                    result

                );


            }


        }





        this.optimizeOrder();



        const output={


            success:true,


            goal,


            improvements,


            score:

                improvements.length *

                0.2


        };



        this.history.push(

            output

        );



        return output;


    }





    /**
     * Üretim için optimizasyon
     */
    optimizeManufacturing(){



        return {


            changes:[


                "Reduce unnecessary features",


                "Simplify machining operations",


                "Improve tool accessibility"


            ]


        };


    }





    /**
     * AI öğrenme çıktısı
     */
    exportOptimizationData(){



        return {


            history:

                this.history,


            complexity:

                this.analyzeComplexity()


        };


    }





    /**
     * Reset
     */
    reset(){


        this.features=[];


        this.history=[];


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureOptimizer",


            features:

                this.features.length,


            optimizations:

                this.history.length


        };


    }


}