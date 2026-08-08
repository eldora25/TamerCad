
export type DecisionPriority =

    "LOW"

    |

    "MEDIUM"

    |

    "HIGH"

    |

    "CRITICAL";





export interface DesignAlternative {


    id:string;


    name:string;


    performance:number;


    cost:number;


    risk:number;


    manufacturability:number;


}





export interface DecisionScore {


    alternative:string;


    score:number;


    explanation:string;


}





export interface EngineeringDecision {


    selected:string;


    reason:string;


    confidence:number;


    priority:DecisionPriority;


}





export interface RiskReport {


    risk:number;


    level:DecisionPriority;


    recommendation:string;


}





export class BRepEngineeringDecision {



    alternatives:DesignAlternative[];


    decisions:EngineeringDecision[];


    history:DecisionScore[];





    constructor(){



        this.alternatives=[];


        this.decisions=[];


        this.history=[];


    }





    /**
     * Alternatif ekleme
     */
    addAlternative(

        alternative:DesignAlternative

    ){


        this.alternatives.push(

            alternative

        );


    }





    /**
     * Performans skoru
     */
    calculateScore(

        design:DesignAlternative

    ):number {



        const performance=

            design.performance*

            0.45;



        const manufacturing=

            design.manufacturability*

            0.25;



        const cost=

            (

                100-design.cost

            )

            *

            0.15;



        const risk=

            (

                100-design.risk

            )

            *

            0.15;



        return (

            performance+

            manufacturing+

            cost+

            risk

        );


    }





    /**
     * Alternatifleri sıralama
     */
    rankAlternatives(){



        const scores=

            this.alternatives.map(

                design=>({


                    alternative:

                        design.name,


                    score:

                        this.calculateScore(

                            design

                        ),


                    explanation:

                        "Weighted engineering evaluation"


                })

            );



        this.history.push(

            ...scores

        );



        return scores.sort(

            (

                a,

                b

            )=>

                b.score-a.score


        );


    }





    /**
     * Risk analizi
     */
    evaluateRisk(

        design:DesignAlternative

    ):RiskReport {



        if(

            design.risk>80

        ){



            return {


                risk:

                    design.risk,


                level:

                    "CRITICAL",


                recommendation:

                    "Redesign required"


            };


        }



        if(

            design.risk>50

        ){



            return {


                risk:

                    design.risk,


                level:

                    "HIGH",


                recommendation:

                    "Additional simulation required"


            };


        }



        return {


            risk:

                design.risk,


            level:

                "LOW",


            recommendation:

                "Acceptable"

        };


    }





    /**
     * En iyi mühendislik kararını seçme
     */
    selectBest(){

        

        const ranking=

            this.rankAlternatives();



        const best=

            ranking[0];



        if(!best)

            return null;



        const decision={


            selected:

                best.alternative,


            reason:

                best.explanation,


            confidence:

                Math.min(

                    best.score/

                    100,


                    1

                ),


            priority:

                "HIGH"

        };



        this.decisions.push(

            decision

        );



        return decision;


    }





    /**
     * Tasarım önerisi
     */
    recommend(

        design:DesignAlternative

    ){



        const risk=

            this.evaluateRisk(

                design

            );



        return {


            design:

                design.name,


            recommendation:

                risk.level==="LOW"

                ?

                "Proceed"

                :

                "Improve design",


            risk


        };


    }





    /**
     * İnsan onayı
     */
    approve(

        decision:EngineeringDecision

    ){



        return {


            approved:true,


            decision:


                decision.selected,


            timestamp:

                Date.now()


        };


    }





    /**
     * Karar hafızası
     */
    remember(

        decision:string

    ){



        this.history.push({


            alternative:

                decision,


            score:

                1,


            explanation:

                "Stored decision"


        });


    }





    /**
     * İstatistik
     */
    statistics(){



        return {


            alternatives:

                this.alternatives.length,


            decisions:

                this.decisions.length,


            history:

                this.history.length


        };


    }





    /**
     * Reset
     */
    reset(){


        this.alternatives=[];


        this.decisions=[];


        this.history=[];


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepEngineeringDecision",


            alternatives:

                this.alternatives.length,


            status:

                "DECISION READY"


        };


    }


}