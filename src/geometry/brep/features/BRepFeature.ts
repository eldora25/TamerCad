
export type BRepFeatureType =

    "SKETCH"

    |

    "EXTRUDE"

    |

    "REVOLVE"

    |

    "POCKET"

    |

    "HOLE"

    |

    "FILLET"

    |

    "CHAMFER"

    |

    "PATTERN"

    |

    "SHELL"

    |

    "CUSTOM";





export type BRepFeatureStatus =

    "CREATED"

    |

    "VALID"

    |

    "FAILED"

    |

    "SUPPRESSED";





export interface FeatureParameter {


    name:string;


    value:any;


    expression?:string;


}





export interface FeatureDependency {


    id:string;


    type:string;


}





export interface FeatureResult {


    success:boolean;


    shape?:any;


    error?:string;


}





export abstract class BRepFeature {



    id:string;


    name:string;


    type:BRepFeatureType;


    status:BRepFeatureStatus;



    parameters:FeatureParameter[];


    dependencies:FeatureDependency[];


    parent?:BRepFeature;


    children:BRepFeature[];



    createdAt:number;


    updatedAt:number;





    constructor(

        id:string,

        name:string,

        type:BRepFeatureType

    ){


        this.id=id;


        this.name=name;


        this.type=type;


        this.status="CREATED";


        this.parameters=[];


        this.dependencies=[];


        this.children=[];


        this.createdAt=

            Date.now();


        this.updatedAt=

            Date.now();


    }





    /**
     * Feature hesaplama
     */
    abstract rebuild():

        FeatureResult;





    /**
     * Parametre ekleme
     */
    addParameter(

        parameter:FeatureParameter

    ){



        this.parameters.push(

            parameter

        );



        this.touch();

    }





    /**
     * Parametre güncelleme
     */
    updateParameter(

        name:string,

        value:any

    ){



        const parameter=

            this.parameters.find(

                p=>

                p.name===name

            );



        if(parameter){


            parameter.value=value;


            this.touch();


            return true;

        }



        return false;


    }





    /**
     * Bağımlılık ekleme
     */
    addDependency(

        dependency:FeatureDependency

    ){



        this.dependencies.push(

            dependency

        );


    }





    /**
     * Alt feature ekleme
     */
    addChild(

        feature:BRepFeature

    ){



        feature.parent=this;


        this.children.push(

            feature

        );


    }





    /**
     * Feature geçerli mi?
     */
    validate(){



        this.status=

            "VALID";



        return true;


    }





    /**
     * Feature bastırma
     */
    suppress(){



        this.status=

            "SUPPRESSED";


    }





    /**
     * Yeniden oluşturma
     */
    rebuildTree(){



        const result=

            this.rebuild();



        this.children.forEach(

            child=>{


                child.rebuildTree();


            }

        );



        return result;


    }





    /**
     * Değişim zamanı
     */
    protected touch(){



        this.updatedAt=

            Date.now();


    }





    /**
     * Serialize
     */
    serialize(){



        return {


            id:

                this.id,


            name:

                this.name,


            type:

                this.type,


            status:

                this.status,


            parameters:

                this.parameters,


            dependencies:

                this.dependencies


        };


    }





    /**
     * Debug
     */
    info(){



        return {


            feature:

                this.name,


            type:

                this.type,


            status:

                this.status


        };


    }


}