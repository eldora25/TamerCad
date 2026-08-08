
import {

    BRepFeature

}

from "./BRepFeature";


import {

    BRepFeatureDependency

}

from "./BRepFeatureDependency";





export interface RebuildPlan {


    changedFeature:string;


    affectedFeatures:string[];


    orderedFeatures:string[];


    estimatedCost:number;


}





export interface FeatureChange {


    featureId:string;


    parameter:string;


    oldValue:any;


    newValue:any;


}





export class BRepFeatureRebuildPlanner {



    dependency:BRepFeatureDependency;


    cache:Map<string,RebuildPlan>;



    changeQueue:FeatureChange[];





    constructor(

        dependency:BRepFeatureDependency

    ){



        this.dependency=

            dependency;



        this.cache=

            new Map();



        this.changeQueue=[];


    }





    /**
     * Değişiklik kaydet
     */
    registerChange(

        change:FeatureChange

    ){



        this.changeQueue.push(

            change

        );


        this.cache.clear();


    }





    /**
     * Etkilenen feature bul
     */
    collectAffectedFeatures(

        featureId:string

    ){



        const affected=

            new Set<string>();



        const traverse=(id:string)=>{



            const children=

                this.dependency.getChildren(

                    id

                );



            for(

                const child of children

            ){



                if(

                    !affected.has(

                        child

                    )

                ){



                    affected.add(

                        child

                    );


                    traverse(

                        child

                    );


                }


            }


        };



        traverse(

            featureId

        );



        return Array.from(

            affected

        );


    }





    /**
     * Parent dahil et
     */
    includeRoot(

        featureId:string,

        affected:string[]

    ){



        return [


            featureId,


            ...

            affected


        ];

    }





    /**
     * Yeniden oluşturma sırası
     */
    buildOrder(

        features:string[]

    ){



        const order:string[]=[];


        const visited=

            new Set<string>();





        const visit=(id:string)=>{



            if(

                visited.has(id)

            ){

                return;

            }



            visited.add(id);



            const parents=

                this.dependency.getParents(

                    id

                );



            for(

                const parent of parents

            ){



                if(

                    features.includes(

                        parent

                    )

                ){

                    visit(

                        parent

                    );


                }


            }



            order.push(

                id

            );


        };





        for(

            const feature of features

        ){



            visit(

                feature

            );


        }





        return order;


    }





    /**
     * Maliyet tahmini
     */
    estimateCost(

        features:string[]

    ){



        return features.length *

            10;


    }





    /**
     * Plan oluştur
     */
    createPlan(

        featureId:string

    ):RebuildPlan {



        const cached=

            this.cache.get(

                featureId

            );



        if(

            cached

        ){

            return cached;

        }





        const affected=

            this.collectAffectedFeatures(

                featureId

            );



        const rebuildSet=

            this.includeRoot(

                featureId,

                affected

            );



        const ordered=

            this.buildOrder(

                rebuildSet

            );



        const plan={



            changedFeature:

                featureId,



            affectedFeatures:

                rebuildSet,



            orderedFeatures:

                ordered,



            estimatedCost:

                this.estimateCost(

                    ordered

                )



        };



        this.cache.set(

            featureId,

            plan

        );



        return plan;


    }





    /**
     * Tüm değişiklikler için plan
     */
    createBatchPlan(){



        const all=

            new Set<string>();



        for(

            const change of this.changeQueue

        ){



            all.add(

                change.featureId

            );


        }



        const plans=[];



        for(

            const id of all

        ){



            plans.push(

                this.createPlan(

                    id

                )

            );


        }



        return plans;


    }





    /**
     * Plan temizleme
     */
    clearChanges(){


        this.changeQueue=[];


    }





    /**
     * Cache reset
     */
    reset(){


        this.cache.clear();


        this.changeQueue=[];


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureRebuildPlanner",


            cachedPlans:

                this.cache.size,


            pendingChanges:

                this.changeQueue.length


        };


    }


}