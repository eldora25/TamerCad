
export type MLModelType =

    "NEURAL_NETWORK"

    |

    "RANDOM_FOREST"

    |

    "GRAPH_NETWORK"

    |

    "TRANSFORMER";





export interface GeometryFeature {


    name:string;


    value:number;


}





export interface GeometryEmbedding {


    vector:number[];


    dimension:number;


}





export interface MLTrainingData {


    features:number[];


    label:number;


}





export interface MLModel {


    id:string;


    type:MLModelType;


    version:string;


    trained:boolean;


}





export interface MLPrediction {


    value:number;


    confidence:number;


}





export class BRepMachineLearning {



    model:MLModel;


    dataset:MLTrainingData[];


    features:GeometryFeature[];


    embeddings:GeometryEmbedding[];


    learningEnabled:boolean;





    constructor(){



        this.model={


            id:"default",


            type:"GRAPH_NETWORK",


            version:"1.0",


            trained:false


        };



        this.dataset=[];


        this.features=[];


        this.embeddings=[];


        this.learningEnabled=true;


    }





    /**
     * Model tipi
     */
    setModel(

        type:MLModelType

    ){


        this.model.type=

            type;


    }





    /**
     * BRep feature extraction
     */
    extractFeatures(

        brep:any

    ){



        this.features=[


            {


                name:"face_count",


                value:

                    brep.faces ??

                    0


            },


            {


                name:"edge_count",


                value:

                    brep.edges ??

                    0


            },


            {


                name:"volume",


                value:

                    brep.volume ??

                    0


            }


        ];



        return this.features;


    }





    /**
     * Geometry embedding
     */
    createEmbedding(){



        const vector=

            this.features.map(

                f=>

                f.value

            );



        const embedding={


            vector,


            dimension:

                vector.length


        };



        this.embeddings.push(

            embedding

        );



        return embedding;


    }





    /**
     * Training data ekleme
     */
    addTrainingData(

        data:MLTrainingData

    ){


        this.dataset.push(

            data

        );


    }





    /**
     * Model training
     */
    train(){



        if(

            this.dataset.length===0

        )

            return false;



        this.model.trained=

            true;



        return true;


    }





    /**
     * Prediction
     */
    predict(

        input:number[]

    ):MLPrediction {



        if(

            !this.model.trained

        ){



            return {


                value:0,


                confidence:0


            };


        }



        const value=

            input.reduce(

                (

                    a,

                    b

                )=>

                a+b,


                0

            )

            /

            input.length;



        return {


            value,


            confidence:0.92


        };


    }





    /**
     * Üretilebilirlik tahmini
     */
    predictManufacturability(

        features:number[]

    ){



        const prediction=

            this.predict(

                features

            );



        return {


            manufacturable:

                prediction.value

                <

                100,


            confidence:

                prediction.confidence


        };


    }





    /**
     * Benzer geometri arama
     */
    findSimilar(

        embedding:GeometryEmbedding

    ){



        return this.embeddings.filter(

            e=>

            e.dimension===

            embedding.dimension


        );


    }





    /**
     * Continuous learning
     */
    learn(

        result:number

    ){



        if(

            this.learningEnabled

        ){



            this.dataset.push({


                features:

                    this.features.map(

                        f=>

                        f.value

                    ),


                label:

                    result


            });


        }


    }





    /**
     * Model güncelleme
     */
    updateModel(){



        this.model.version=

            (

                parseFloat(

                    this.model.version

                )

                +

                0.1

            )

            .toFixed(1);


    }





    /**
     * Model durumu
     */
    status(){



        return {


            model:

                this.model.type,


            trained:

                this.model.trained,


            samples:

                this.dataset.length,


            embeddings:

                this.embeddings.length


        };


    }





    /**
     * Reset
     */
    reset(){


        this.dataset=[];


        this.features=[];


        this.embeddings=[];


        this.model.trained=false;


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepMachineLearning",


            model:

                this.model.type,


            version:

                this.model.version,


            status:

                this.model.trained

                ?

                "LEARNING"

                :

                "EMPTY"


        };


    }


}