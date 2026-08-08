
export type ConsensusMethod =

    "MAJORITY"

    |

    "WEIGHTED"

    |

    "CONFIDENCE"

    |

    "EXPERT";





export interface AgentOpinion {


    agent:string;


    expertise:string;


    decision:string;


    confidence:number;


    evidence:any;


}





export interface ConsensusDecision {


    decision:string;


    confidence:number;


    agreement:number;


    supporters:string[];


    rejected:string[];


}





export interface ConsensusSession {


    id:string;


    topic:string;


    opinions:AgentOpinion[];


    result?:ConsensusDecision;


}





export class BRepEngineeringAgentConsensus {



    opinions:AgentOpinion[];


    sessions:ConsensusSession[];


    method:ConsensusMethod;


    memory:any[];





    constructor(){



        this.opinions=[];


        this.sessions=[];


        this.method=

            "CONFIDENCE";


        this.memory=[];


    }





    /**
     * Konsensus yöntemi
     */
    setMethod(

        method:ConsensusMethod

    ){


        this.method=

            method;


    }





    /**
     * Ajan görüşü ekleme
     */
    addOpinion(

        opinion:AgentOpinion

    ){



        this.opinions.push(

            opinion

        );


    }





    /**
     * Görüş toplama
     */
    collect(

        opinions:AgentOpinion[]

    ){



        this.opinions.push(

            ...opinions

        );



        return this.opinions;


    }





    /**
     * Güven ağırlıklı hesap
     */
    calculateConfidence(){



        let total=0;



        this.opinions.forEach(

            opinion=>{


                total +=

                    opinion.confidence;


            }

        );



        return total /

            Math.max(

                this.opinions.length,

                1

            );


    }





    /**
     * Oylama
     */
    vote(){



        const votes:any={};



        this.opinions.forEach(

            opinion=>{


                if(!votes[opinion.decision])

                    votes[opinion.decision]=0;



                votes[opinion.decision] +=

                    opinion.confidence;


            }

        );



        return Object.entries(

            votes

        ).sort(

            (

                a:any,

                b:any

            )=>

                b[1]-a[1]

        )[0];

    }





    /**
     * Uzman sıralama
     */
    rankExperts(){



        return this.opinions.sort(

            (

                a,

                b

            )=>

                b.confidence -

                a.confidence

        );


    }





    /**
     * Çatışma çözme
     */
    resolveConflict(){



        const ranked=

            this.rankExperts();



        return {


            resolved:true,


            selected:

                ranked[0]


        };


    }





    /**
     * Nihai karar üretme
     */
    buildDecision():ConsensusDecision {



        const winner:any=

            this.vote();



        const supporters=

            this.opinions

                .filter(

                    opinion=>

                    opinion.decision===winner[0]

                )

                .map(

                    opinion=>

                    opinion.agent

                );



        const rejected=

            this.opinions

                .filter(

                    opinion=>

                    opinion.decision!==winner[0]

                )

                .map(

                    opinion=>

                    opinion.agent

                );



        const decision={


            decision:

                winner[0],


            confidence:

                this.calculateConfidence(),


            agreement:

                supporters.length /

                Math.max(

                    this.opinions.length,

                    1

                ),


            supporters,


            rejected


        };



        this.memory.push(

            decision

        );



        return decision;


    }





    /**
     * Konsensus oturumu
     */
    createSession(

        topic:string

    ){



        const session={


            id:

                crypto.randomUUID(),


            topic,


            opinions:

                []


        };



        this.sessions.push(

            session

        );



        return session;


    }





    /**
     * Oturum çalıştırma
     */
    runSession(

        topic:string

    ){



        const session=

            this.createSession(

                topic

            );



        session.opinions=

            this.opinions;



        session.result=

            this.buildDecision();



        return session;


    }





    /**
     * Öğrenme
     */
    learn(

        experience:any

    ){


        this.memory.push(

            experience

        );


    }





    /**
     * Durum
     */
    status(){



        return {


            method:

                this.method,


            opinions:

                this.opinions.length,


            sessions:

                this.sessions.length,


            memory:

                this.memory.length


        };


    }





    /**
     * Reset
     */
    reset(){


        this.opinions=[];


        this.sessions=[];


        this.memory=[];


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepEngineeringAgentConsensus",


            status:

                "CONSENSUS_READY"


        };


    }


}