
import {

    BRepFeature,

    BRepFeatureType

}

from "./BRepFeature";





export type GeometryType =


    "PLANE"

    |

    "CYLINDER"

    |

    "CONE"

    |

    "SPHERE"

    |

    "TORUS"

    |

    "UNKNOWN";





export interface GeometryEntity {


    id:string;


    type:GeometryType;


    area?:number;


    radius?:number;


    normal?:any;


    data?:any;


}





export interface RecognizedFeature {


    type:BRepFeatureType;


    confidence:number;


    parameters:any;


    entities:string[];


}





export interface RecognitionResult {


    success:boolean;


    features:RecognizedFeature[];


}





export class BRepFeatureRecognizer {



    entities:GeometryEntity[];


    recognized:RecognizedFeature[];


    confidenceThreshold:number;





    constructor(){



        this.entities=[];


        this.recognized=[];


        this.confidenceThreshold=

            0.8;


    }





    /**
     * Geometri ekleme
     */
    addEntity(

        entity:GeometryEntity

    ){



        this.entities.push(

            entity

        );


    }





    /**
     * Yüzey tipi analizi
     */
    classifySurface(

        entity:GeometryEntity

    ):GeometryType {



        if(

            entity.type

        ){

            return entity.type;

        }



        return "UNKNOWN";


    }





    /**
     * Silindirik yüzey algılama
     */
    detectCylinder(

        entity:GeometryEntity

    ){



        if(

            entity.type==="CYLINDER"

        ){



            return {


                type:"HOLE",


                confidence:

                    0.95,


                parameters:{


                    radius:

                        entity.radius


                },


                entities:[

                    entity.id

                ]


            };


        }



        return null;


    }





    /**
     * Düz yüzey algılama
     */
    detectExtrude(

        entity:GeometryEntity

    ){



        if(

            entity.type==="PLANE"

        ){



            return {


                type:"EXTRUDE",


                confidence:

                    0.85,


                parameters:{


                    direction:

                        entity.normal


                },


                entities:[

                    entity.id

                ]


            };


        }



        return null;


    }





    /**
     * Yuvarlatılmış kenar algılama
     */
    detectFillet(

        entity:any

    ){



        if(

            entity.radius

            &&

            entity.radius>0

        ){



            return {


                type:"FILLET",


                confidence:

                    0.9,


                parameters:{


                    radius:

                        entity.radius


                },


                entities:[

                    entity.id

                ]


            };


        }



        return null;


    }





    /**
     * Chamfer algılama
     */
    detectChamfer(

        entity:any

    ){



        if(

            entity.angle

        ){



            return {


                type:"CHAMFER",


                confidence:

                    0.85,


                parameters:{


                    angle:

                        entity.angle


                },


                entities:[

                    entity.id

                ]


            };


        }



        return null;


    }





    /**
     * Pattern algılama
     */
    detectPattern(

        entities:GeometryEntity[]

    ){



        if(

            entities.length>2

        ){



            return {


                type:"PATTERN",


                confidence:

                    0.82,


                parameters:{


                    count:

                        entities.length


                },


                entities:

                    entities.map(

                        e=>

                        e.id

                    )


            };


        }



        return null;


    }





    /**
     * Tüm feature analizi
     */
    recognize(){



        this.recognized=[];



        for(

            const entity of this.entities

        ){



            const detectors=[


                this.detectCylinder(entity),


                this.detectExtrude(entity),


                this.detectFillet(entity),


                this.detectChamfer(entity)


            ];



            detectors.forEach(

                feature=>{


                    if(

                        feature

                        &&

                        feature.confidence >=

                        this.confidenceThreshold

                    ){



                        this.recognized.push(

                            feature as RecognizedFeature

                        );


                    }


                }

            );


        }





        const pattern=

            this.detectPattern(

                this.entities

            );



        if(pattern){


            this.recognized.push(

                pattern as RecognizedFeature

            );


        }



        return {


            success:true,


            features:

                this.recognized


        };


    }





    /**
     * Feature ağacı üretme
     */
    generateFeatureTree(){



        return this.recognized.map(

            (

                feature,

                index

            )=>({


                id:

                    `FEATURE_${index}`,


                type:

                    feature.type,


                parameters:

                    feature.parameters


            })

        );


    }





    /**
     * AI eğitim datası
     */
    exportTrainingData(){



        return {


            entities:

                this.entities,


            recognized:

                this.recognized


        };


    }





    /**
     * Reset
     */
    reset(){


        this.entities=[];


        this.recognized=[];


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureRecognizer",


            entities:

                this.entities.length,


            features:

                this.recognized.length


        };


    }


}