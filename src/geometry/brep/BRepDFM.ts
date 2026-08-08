export type DFMProcess =

    "CNC"

    |

    "3D_PRINT"

    |

    "CASTING"

    |

    "INJECTION";





export interface DFMRule {


    id:string;


    name:string;


    severity:

        "INFO"

        |

        "WARNING"

        |

        "ERROR";


}





export interface DFMIssue {


    rule:string;


    message:string;


    severity:string;


}





export interface DFMReport {


    score:number;


    manufacturable:boolean;


    issues:DFMIssue[];


    recommendations:string[];


}





export interface FeatureInfo {


    type:string;


    size:number;


    complexity:number;


}





export class BRepDFM {



    process:DFMProcess;


    rules:DFMRule[];


    issues:DFMIssue[];


    features:FeatureInfo[];





    constructor(){



        this.process="CNC";


        this.rules=[];


        this.issues=[];


        this.features=[];


    }





    /**
     * Üretim yöntemi
     */
    setProcess(

        process:DFMProcess

    ){


        this.process=

            process;


    }





    /**
     * Kural ekleme
     */
    addRule(

        rule:DFMRule

    ){


        this.rules.push(

            rule

        );


    }





    /**
     * Feature analizi
     */
    analyzeFeatures(){



        /*
        
        Hole

        Pocket

        Boss

        Fillet

        Chamfer

        Thread

        */


        return this.features;


    }





    /**
     * Feature ekleme
     */
    addFeature(

        feature:FeatureInfo

    ){


        this.features.push(

            feature

        );


    }





    /**
     * Ana DFM analizi
     */
    analyze():DFMReport {



        this.issues=[];



        this.checkRules();


        this.checkComplexity();


        this.checkManufacturing();



        return {


            score:

                this.calculateScore(),


            manufacturable:

                this.issues.every(

                    issue=>

                    issue.severity!=="ERROR"

                ),


            issues:

                this.issues,


            recommendations:

                this.generateRecommendations()


        };


    }





    /**
     * Rule kontrolü
     */
    checkRules(){



        for(

            const rule of

            this.rules

        ){



            if(

                rule.severity==="ERROR"

            ){



                this.issues.push({


                    rule:

                        rule.id,


                    message:

                        rule.name,


                    severity:

                        rule.severity


                });


            }


        }


    }





    /**
     * Karmaşıklık analizi
     */
    checkComplexity(){



        let complexity=0;



        for(

            const feature of

            this.features

        ){



            complexity +=

                feature.complexity;


        }



        if(

            complexity > 100

        ){



            this.issues.push({


                rule:

                    "COMPLEXITY",


                message:

                    "Part complexity is high",


                severity:

                    "WARNING"


            });


        }


    }





    /**
     * Üretim kontrolü
     */
    checkManufacturing(){



        switch(

            this.process

        ){



            case "CNC":


                this.checkCNC();


                break;



            case "3D_PRINT":


                this.check3DPrint();


                break;



            case "CASTING":


                this.checkCasting();


                break;


        }


    }





    /**
     * CNC kuralları
     */
    checkCNC(){



        this.features.forEach(

            feature=>{


                if(

                    feature.size < 1

                ){



                    this.issues.push({


                        rule:

                            "SMALL_FEATURE",


                        message:

                            "Feature too small for CNC",


                        severity:

                            "WARNING"


                    });


                }


            }

        );


    }





    /**
     * 3D print kuralları
     */
    check3DPrint(){



        this.issues.push({


            rule:

                "SUPPORT_CHECK",


            message:

                "Overhang analysis required",


            severity:

                "INFO"


        });


    }





    /**
     * Döküm kontrolü
     */
    checkCasting(){



        this.issues.push({


            rule:

                "DRAFT_ANGLE",


            message:

                "Draft angle verification needed",


            severity:

                "WARNING"


        });


    }





    /**
     * DFM skoru
     */
    calculateScore(){



        let score=100;



        for(

            const issue of

            this.issues

        ){



            if(

                issue.severity==="ERROR"

            )

                score-=30;



            if(

                issue.severity==="WARNING"

            )

                score-=10;



        }



        return Math.max(

            0,

            score

        );


    }





    /**
     * Öneri üretme
     */
    generateRecommendations(){



        const suggestions:string[]=[];



        if(

            this.issues.length

        ){



            suggestions.push(

                "Reduce feature complexity"

            );


            suggestions.push(

                "Increase manufacturable radii"

            );


            suggestions.push(

                "Simplify geometry"

            );


        }



        return suggestions;


    }





    /**
     * Maliyet tahmini
     */
    estimateManufacturingCost(){



        return {


            material:50,


            machining:100,


            assembly:20,


            total:170


        };


    }





    /**
     * Reset
     */
    reset(){


        this.issues=[];


        this.features=[];


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepDFM",


            process:

                this.process,


            features:

                this.features.length,


            status:

                "READY"


        };


    }


}