
import {

    BRepFeature

}

from "./BRepFeature";



export type ValidationStatus =


    "VALID"

    |

    "WARNING"

    |

    "ERROR";





export interface ValidationIssue {


    type:string;


    message:string;


    severity:"LOW"|"MEDIUM"|"HIGH";


}





export interface ValidationReport {


    featureId:string;


    status:ValidationStatus;


    score:number;


    issues:ValidationIssue[];


}





export class BRepFeatureValidator {



    tolerance:number;


    reports:ValidationReport[];





    constructor(){



        this.tolerance=

            0.001;


        this.reports=[];


    }





    /**
     * Feature varlık kontrolü
     */
    validateExistence(

        feature:BRepFeature

    ){

        if(!feature){


            return {


                valid:false,


                issue:"Feature missing"


            };


        }



        return {


            valid:true


        };


    }





    /**
     * Parametre kontrolü
     */
    validateParameters(

        feature:BRepFeature

    ):ValidationIssue[] {



        const issues:ValidationIssue[]=[];



        for(

            const parameter of feature.parameters

        ){



            if(

                parameter.value===undefined

            ){



                issues.push({


                    type:

                        "PARAMETER",


                    message:

                        `${parameter.name} undefined`,


                    severity:

                        "HIGH"


                });


            }



        }



        return issues;


    }





    /**
     * Feature tipi kontrolü
     */
    validateType(

        feature:BRepFeature

    ){



        const supported=[


            "SKETCH",

            "EXTRUDE",

            "REVOLVE",

            "POCKET",

            "HOLE",

            "FILLET",

            "CHAMFER",

            "PATTERN",

            "SHELL"

        ];



        return supported.includes(

            feature.type

        );


    }





    /**
     * Geometrik doğrulama
     */
    validateGeometry(

        feature:BRepFeature

    ):ValidationIssue[] {



        const issues:ValidationIssue[]=[];



        if(

            feature.type==="FILLET"

        ){



            const radius=

                feature.parameters.find(

                    p=>

                    p.name==="radius"

                );



            if(

                radius

                &&

                radius.value<=0

            ){



                issues.push({


                    type:

                        "GEOMETRY",


                    message:

                        "Invalid fillet radius",


                    severity:

                        "HIGH"


                });


            }


        }



        return issues;


    }





    /**
     * Constraint sonucu kontrolü
     */
    validateConstraints(

        constraints:any[]

    ):ValidationIssue[] {



        const issues:ValidationIssue[]=[];



        for(

            const constraint of constraints

        ){



            if(

                constraint.status==="CONFLICT"

            ){



                issues.push({


                    type:

                        "CONSTRAINT",


                    message:

                        "Constraint conflict",


                    severity:

                        "HIGH"


                });


            }


        }



        return issues;


    }





    /**
     * Topoloji kontrolü
     */
    validateTopology(

        feature:BRepFeature

    ){



        if(

            feature.children.length>

            1000

        ){



            return {


                valid:false,


                issue:

                "Excessive topology complexity"


            };


        }



        return {


            valid:true


        };


    }





    /**
     * Üretilebilirlik kontrolü
     */
    validateManufacturing(

        feature:BRepFeature

    ):ValidationIssue[] {



        const issues:ValidationIssue[]=[];



        if(

            feature.type==="HOLE"

        ){



            const diameter=

                feature.parameters.find(

                    p=>

                    p.name==="diameter"

                );



            if(

                diameter

                &&

                diameter.value<0.5

            ){



                issues.push({


                    type:

                        "MANUFACTURING",


                    message:

                        "Hole below manufacturing limit",


                    severity:

                        "MEDIUM"


                });


            }


        }



        return issues;


    }





    /**
     * Ana doğrulama
     */
    validate(

        feature:BRepFeature,

        constraints:any[]=[]

    ):ValidationReport {



        const issues:

            ValidationIssue[]=[];



        const parameterIssues=

            this.validateParameters(

                feature

            );



        const geometryIssues=

            this.validateGeometry(

                feature

            );



        const constraintIssues=

            this.validateConstraints(

                constraints

            );



        const manufacturingIssues=

            this.validateManufacturing(

                feature

            );



        issues.push(

            ...parameterIssues,

            ...geometryIssues,

            ...constraintIssues,

            ...manufacturingIssues

        );





        let status:

            ValidationStatus=

            "VALID";



        if(

            issues.length>0

        ){


            status=

                issues.some(

                    i=>

                    i.severity==="HIGH"

                )

                ?

                "ERROR"

                :

                "WARNING";


        }





        const score=

            Math.max(

                0,

                1 -

                issues.length*

                0.1

            );





        const report={


            featureId:

                feature.id,


            status,


            score,


            issues


        };



        this.reports.push(

            report

        );



        return report;


    }





    /**
     * Toplu doğrulama
     */
    validateAll(

        features:BRepFeature[]

    ){



        return features.map(

            feature=>

            this.validate(

                feature

            )

        );


    }





    /**
     * Son kalite skoru
     */
    qualityScore(){



        if(

            this.reports.length===0

        )

            return 1;



        return this.reports.reduce(

            (

                sum,

                report

            )=>

            sum+

            report.score,

            0

        )

        /

        this.reports.length;


    }





    /**
     * Serialize
     */
    serialize(){



        return {


            reports:

                this.reports,


            quality:

                this.qualityScore()


        };


    }





    /**
     * Reset
     */
    reset(){


        this.reports=[];


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureValidator",


            reports:

                this.reports.length,


            quality:

                this.qualityScore()


        };


    }


}