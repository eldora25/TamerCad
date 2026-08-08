
export type KnowledgeCategory =

    "MATERIAL"

    |

    "MANUFACTURING"

    |

    "DESIGN_RULE"

    |

    "FAILURE"

    |

    "SIMULATION";





export interface KnowledgeItem {


    id:string;


    category:KnowledgeCategory;


    title:string;


    description:string;


    tags:string[];


    importance:number;


}





export interface MaterialProperty {


    name:string;


    density:number;


    strength:number;


    thermalLimit:number;


}





export interface ManufacturingRule {


    process:string;


    rule:string;


    severity:"LOW"|"MEDIUM"|"HIGH";


}





export interface KnowledgeQuery {


    keyword:string;


    category?:KnowledgeCategory;


}





export class BRepEngineeringKnowledge {



    knowledge:KnowledgeItem[];


    materials:MaterialProperty[];


    manufacturingRules:ManufacturingRule[];


    learningMemory:string[];





    constructor(){



        this.knowledge=[];


        this.materials=[];


        this.manufacturingRules=[];


        this.learningMemory=[];


        this.initializeDefaultKnowledge();


    }





    /**
     * Varsayılan mühendislik bilgileri
     */
    initializeDefaultKnowledge(){



        this.addMaterial({

            name:

                "Aluminum 7075",


            density:

                2810,


            strength:

                572,


            thermalLimit:

                150


        });



        this.addRule({

            process:

                "CNC",


            rule:

                "Avoid unreachable internal corners",


            severity:

                "HIGH"


        });



        this.addKnowledge({

            id:

                "FAIL001",


            category:

                "FAILURE",


            title:

                "Fatigue Crack",


            description:

                "Stress concentration causes fatigue failure",


            tags:[

                "fatigue",

                "stress",

                "crack"

            ],


            importance:

                10


        });


    }





    /**
     * Bilgi ekleme
     */
    addKnowledge(

        item:KnowledgeItem

    ){


        this.knowledge.push(

            item

        );


    }





    /**
     * Malzeme ekleme
     */
    addMaterial(

        material:MaterialProperty

    ){


        this.materials.push(

            material

        );


    }





    /**
     * Üretim kuralı ekleme
     */
    addRule(

        rule:ManufacturingRule

    ){


        this.manufacturingRules.push(

            rule

        );


    }





    /**
     * Bilgi arama
     */
    search(

        query:KnowledgeQuery

    ){



        return this.knowledge.filter(

            item=>

                item.title

                .toLowerCase()

                .includes(

                    query.keyword

                    .toLowerCase()

                )

                ||

                item.tags.some(

                    tag=>

                    tag.includes(

                        query.keyword

                    )

                )

        );


    }





    /**
     * Malzeme önerisi
     */
    recommendMaterial(

        requirement:string

    ){



        if(

            requirement.includes(

                "lightweight"

            )

        ){



            return this.materials.sort(

                (

                    a,

                    b

                )=>

                a.density-b.density


            )[0];


        }



        return this.materials[0];


    }





    /**
     * Üretim kontrolü
     */
    validateManufacturing(

        process:string

    ){



        return this.manufacturingRules.filter(

            rule=>

            rule.process===process


        );


    }





    /**
     * Tasarım standardı sorgusu
     */
    getDesignRules(

        tag:string

    ){



        return this.knowledge.filter(

            item=>

            item.category==="DESIGN_RULE"

            &&

            item.tags.includes(tag)


        );


    }





    /**
     * Failure knowledge
     */
    analyzeFailure(

        failure:string

    ){



        return this.search({

            keyword:

                failure,


            category:

                "FAILURE"


        });


    }





    /**
     * Simulation tecrübesi
     */
    addSimulationExperience(

        result:string

    ){



        this.learningMemory.push(

            result

        );


    }





    /**
     * AI memory öğrenme
     */
    learn(

        information:string

    ){



        this.learningMemory.push(

            information

        );


    }





    /**
     * Knowledge statistics
     */
    statistics(){



        return {


            totalKnowledge:

                this.knowledge.length,


            materials:

                this.materials.length,


            rules:

                this.manufacturingRules.length,


            memories:

                this.learningMemory.length


        };


    }





    /**
     * Reset
     */
    reset(){


        this.knowledge=[];


        this.materials=[];


        this.manufacturingRules=[];


        this.learningMemory=[];


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepEngineeringKnowledge",


            knowledge:

                this.knowledge.length,


            materials:

                this.materials.length,


            status:

                "READY"


        };


    }


}