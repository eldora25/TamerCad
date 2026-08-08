
import {

    RebuildPlan

}

from "./BRepFeatureRebuildPlanner";





import {

    MonitorReport

}

from "./BRepFeatureRebuildMonitor";





export interface FeatureCost {


    featureId:string;


    averageTime:number;


    rebuildCount:number;


    costScore:number;


}





export interface OptimizationResult {


    originalOrder:string[];


    optimizedOrder:string[];


    removed:string[];


    estimatedImprovement:number;


}





export interface OptimizationStrategy {


    name:string;


    description:string;


}





export class BRepFeatureRebuildOptimizer {



    history:

        Map<string,FeatureCost>;



    strategies:

        OptimizationStrategy[];





    constructor(){



        this.history=

            new Map();



        this.strategies=[



            {


                name:

                    "MINIMAL_REBUILD",


                description:

                    "Only affected features rebuild"


            },



            {


                name:

                    "COST_PRIORITY",


                description:

                    "Expensive features optimized first"


            },



            {


                name:

                    "CACHE_AWARE",


                description:

                    "Reuse previous results"


            }


        ];


    }





    /**
     * Monitor verisi öğren
     */
    learn(

        report:MonitorReport

    ){



        if(

            report.slowestFeature

        ){



            const existing=

                this.history.get(

                    report.slowestFeature

                );



            this.history.set(

                report.slowestFeature,

                {


                    featureId:

                        report.slowestFeature,


                    averageTime:

                        report.slowestDuration,


                    rebuildCount:

                        existing

                        ?

                        existing.rebuildCount+1

                        :

                        1,



                    costScore:

                        report.slowestDuration


                }


            );


        }


    }





    /**
     * Feature maliyet tahmini
     */
    estimateFeatureCost(

        featureId:string

    ){



        const cost=

            this.history.get(

                featureId

            );



        if(

            !cost

        ){

            return 10;

        }





        return cost.costScore;


    }





    /**
     * Plan optimize et
     */
    optimizePlan(

        plan:RebuildPlan

    ):OptimizationResult {



        const original=

            [...plan.orderedFeatures];



        const optimized=

            [...original];





        optimized.sort(

            (a,b)=>

            {


                return (

                    this.estimateFeatureCost(a)

                    -

                    this.estimateFeatureCost(b)

                );


            }

        );





        const removed:string[]=[];





        return {


            originalOrder:

                original,


            optimizedOrder:

                optimized,


            removed,


            estimatedImprovement:

                this.calculateImprovement(

                    original,

                    optimized

                )


        };


    }





    /**
     * Gereksiz feature temizleme
     */
    prune(

        features:string[],

        required:string[]

    ){



        return features.filter(

            feature=>

                required.includes(

                    feature

                )

        );


    }





    /**
     * İyileştirme tahmini
     */
    calculateImprovement(

        oldOrder:string[],

        newOrder:string[]

    ){



        if(

            oldOrder.join()

            ===

            newOrder.join()

        ){

            return 0;

        }



        return 15;


    }





    /**
     * En uygun strateji
     */
    chooseStrategy(

        featureCount:number

    ){



        if(

            featureCount>500

        ){



            return this.strategies[2];

        }



        if(

            featureCount>100

        ){



            return this.strategies[1];

        }



        return this.strategies[0];


    }





    /**
     * Cache önerisi
     */
    shouldCache(

        featureId:string

    ){



        const cost=

            this.history.get(

                featureId

            );



        return Boolean(

            cost &&

            cost.averageTime>100

        );


    }





    /**
     * Reset
     */
    reset(){



        this.history.clear();


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureRebuildOptimizer",


            learnedFeatures:

                this.history.size,


            strategies:

                this.strategies.length


        };


    }


}