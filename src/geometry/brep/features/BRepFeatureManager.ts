
import {

    BRepFeature,

    BRepFeatureType

}

from "./BRepFeature";


import {

    BRepFeatureFactory

}

from "./BRepFeatureFactory";


import {

    BRepFeatureHistory

}

from "./BRepFeatureHistory";


import {

    BRepFeatureConstraint

}

from "./BRepFeatureConstraint";


import {

    BRepFeatureSolver

}

from "./BRepFeatureSolver";


import {

    BRepFeatureValidator

}

from "./BRepFeatureValidator";


import {

    BRepFeatureOptimizer

}

from "./BRepFeatureOptimizer";





export interface FeatureUpdateRequest {


    featureId:string;


    parameter:string;


    value:any;


}





export interface FeatureOperationResult {


    success:boolean;


    feature?:BRepFeature;


    message:string;


}





export class BRepFeatureManager {



    factory:BRepFeatureFactory;


    history:BRepFeatureHistory;


    constraints:BRepFeatureConstraint;


    solver:BRepFeatureSolver;


    validator:BRepFeatureValidator;


    optimizer:BRepFeatureOptimizer;



    features:Map<string,BRepFeature>;





    constructor(){



        this.factory=

            new BRepFeatureFactory();



        this.history=

            new BRepFeatureHistory();



        this.constraints=

            new BRepFeatureConstraint();



        this.solver=

            new BRepFeatureSolver();



        this.validator=

            new BRepFeatureValidator();



        this.optimizer=

            new BRepFeatureOptimizer();



        this.features=

            new Map();


    }





    /**
     * Feature oluştur
     */
    createFeature(

        type:BRepFeatureType,

        parameters:any={}

    ):FeatureOperationResult {



        const result=

            this.factory.create({

                type,

                parameters

            });



        if(

            !result.success

        ){



            return {


                success:false,


                message:

                    "Feature creation failed"


            };


        }



        const feature=

            result.feature!;



        this.features.set(

            feature.id,

            feature

        );



        this.history.recordChange({

            id:

                crypto.randomUUID(),


            featureId:

                feature.id,


            action:

                "CREATE",


            before:null,


            after:

                feature.serialize(),


            timestamp:

                Date.now()

        });



        return {


            success:true,


            feature,


            message:

                "Feature created"


        };


    }





    /**
     * Feature güncelle
     */
    updateFeature(

        request:FeatureUpdateRequest

    ){



        const feature=

            this.features.get(

                request.featureId

            );



        if(!feature){


            return {


                success:false,


                message:

                    "Feature not found"


            };


        }



        const before=

            feature.serialize();





        const parameter=

            feature.parameters.find(

                p=>

                p.name===request.parameter

            );



        if(parameter){


            parameter.value=

                request.value;


        }





        this.constraints.propagateChange(

            request.parameter,

            request.value

        );



        this.solver.solve();



        this.history.recordChange({

            id:

                crypto.randomUUID(),


            featureId:

                feature.id,


            action:

                "UPDATE",


            before,


            after:

                feature.serialize(),


            timestamp:

                Date.now()

        });



        return {


            success:true,


            feature


        };


    }





    /**
     * Feature sil
     */
    deleteFeature(

        id:string

    ){



        const feature=

            this.features.get(

                id

            );



        if(!feature){


            return false;


        }



        this.features.delete(

            id

        );



        this.history.recordChange({

            id:

                crypto.randomUUID(),


            featureId:id,


            action:

                "DELETE",


            before:

                feature.serialize(),


            after:null,


            timestamp:

                Date.now()

        });



        return true;


    }





    /**
     * Model rebuild
     */
    rebuild(){



        const solveResult=

            this.solver.solve();



        const validation=

            this.validator.validateFeatures(

                Array.from(

                    this.features.values()

                )

            );



        return {


            solved:

                solveResult.success,


            valid:

                validation.valid,


            score:

                validation.score


        };


    }





    /**
     * Snapshot
     */
    snapshot(){



        return this.history.createSnapshot(

            Array.from(

                this.features.values()

            )

        );


    }





    /**
     * Undo
     */
    undo(){



        return this.history.undo();


    }





    /**
     * Redo
     */
    redo(){



        return this.history.redo();


    }





    /**
     * Optimize model
     */
    optimize(){

        this.optimizer.features=

            Array.from(

                this.features.values()

            );



        return this.optimizer.optimize(

            "PERFORMANCE"

        );


    }





    /**
     * Feature getir
     */
    getFeature(

        id:string

    ){


        return this.features.get(

            id

        );


    }





    /**
     * Tüm model
     */
    getFeatures(){



        return Array.from(

            this.features.values()

        );


    }





    /**
     * Export
     */
    serialize(){



        return {


            features:

                this.getFeatures().map(

                    f=>

                    f.serialize()

                ),


            history:

                this.history.serialize(),


            constraints:

                this.constraints.serialize()


        };


    }





    /**
     * Reset
     */
    reset(){


        this.features.clear();


        this.history.clear();


        this.constraints.reset();


        this.solver.reset();


        this.optimizer.reset();


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureManager",


            features:

                this.features.size,


            history:

                this.history.changes.length


        };


    }


}