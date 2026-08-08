import { Sketch }
from "./Sketch";


import { SketchEntity }
from "./SketchEntity";


import { SketchProfile }
from "./SketchProfile";



export enum ValidationSeverity {


    Error = "Error",


    Warning = "Warning"

}







export interface ValidationIssue {


    severity:

    ValidationSeverity;


    message:string;


    entityId?:string;

}







export class SketchValidator {



    constructor(

        public tolerance:number = 1e-6

    ){}





    validateSketch(

        sketch:Sketch

    ):

    ValidationIssue[] {



        const issues:

        ValidationIssue[] = [];



        if(

            sketch.entities.length === 0

        ){



            issues.push({

                severity:

                ValidationSeverity.Warning,


                message:

                "Sketch is empty"

            });



            return issues;

        }





        issues.push(

            ...

            this.checkDuplicateEntities(

                sketch.entities

            )

        );



        issues.push(

            ...

            this.checkZeroLengthEntities(

                sketch.entities

            )

        );



        issues.push(

            ...

            this.checkConstraintState(

                sketch

            )

        );



        return issues;

    }







    validateProfile(

        profile:

        SketchProfile

    ):

    ValidationIssue[] {



        const issues:

        ValidationIssue[] = [];



        if(

            !profile.isClosed()

        ){



            issues.push({

                severity:

                ValidationSeverity.Error,


                message:

                "Profile is not closed"

            });

        }



        issues.push(

            ...

            this.checkSelfIntersection(

                profile

            )

        );



        return issues;

    }







    isValidSketch(

        sketch:Sketch

    ):

    boolean {



        return this.validateSketch(

            sketch

        )

        .filter(

            x =>

            x.severity ===

            ValidationSeverity.Error

        )

        .length === 0;

    }







    isValidProfile(

        profile:

        SketchProfile

    ):

    boolean {



        return this.validateProfile(

            profile

        )

        .filter(

            x =>

            x.severity ===

            ValidationSeverity.Error

        )

        .length === 0;

    }







    private checkDuplicateEntities(

        entities:

        SketchEntity[]

    ):

    ValidationIssue[] {



        const issues:

        ValidationIssue[] = [];



        for(

            let i=0;

            i<entities.length;

            i++

        ){



            for(

                let j=i+1;

                j<entities.length;

                j++

            ){



                if(

                    entities[i].id ===

                    entities[j].id

                ){



                    issues.push({

                        severity:

                        ValidationSeverity.Error,


                        message:

                        "Duplicate entity id",


                        entityId:

                        entities[i].id

                    });

                }

            }

        }



        return issues;

    }







    private checkZeroLengthEntities(

        entities:

        SketchEntity[]

    ):

    ValidationIssue[] {



        const issues:

        ValidationIssue[] = [];



        for(

            const entity of

            entities

        ){



            const points =

            entity.getPoints();



            if(

                points.length < 2

            ){

                continue;

            }



            const a =

            points[0];



            const b =

            points[1];



            const length =

            Math.sqrt(

                Math.pow(

                    a.x-b.x,

                    2

                )

                +

                Math.pow(

                    a.y-b.y,

                    2

                )

            );



            if(

                length <

                this.tolerance

            ){



                issues.push({

                    severity:

                    ValidationSeverity.Error,


                    message:

                    "Zero length geometry",


                    entityId:

                    entity.id

                });

            }

        }



        return issues;

    }







    private checkConstraintState(

        sketch:Sketch

    ):

    ValidationIssue[] {



        const issues:

        ValidationIssue[] = [];



        if(

            sketch.solverStatus ===

            "Failed"

        ){



            issues.push({

                severity:

                ValidationSeverity.Error,


                message:

                "Constraint solver failed"

            });

        }



        return issues;

    }







    private checkSelfIntersection(

        profile:

        SketchProfile

    ):

    ValidationIssue[] {



        const issues:

        ValidationIssue[] = [];



        // Gerçek kernel'de:

        // curve-curve intersection

        // algoritmaları çalışır.



        return issues;

    }



}