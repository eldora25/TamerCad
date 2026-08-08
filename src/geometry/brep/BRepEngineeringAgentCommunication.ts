
export type AgentMessageType =

    "REQUEST"

    |

    "RESPONSE"

    |

    "INFORMATION"

    |

    "WARNING"

    |

    "CONSENSUS"

    |

    "NEGOTIATION";





export interface AgentMessage {


    id:string;


    sender:string;


    receiver:string;


    type:AgentMessageType;


    content:any;


    timestamp:number;


}





export interface SharedEngineeringContext {


    problem:string;


    geometry:any;


    simulation:any;


    decisions:any[];


}





export interface CommunicationEvent {


    message:AgentMessage;


    processed:boolean;


}





export interface NegotiationResult {


    agreement:boolean;


    decision:string;


    participants:string[];


}





export class BRepEngineeringAgentCommunication {



    messages:AgentMessage[];


    events:CommunicationEvent[];


    context:SharedEngineeringContext;


    memory:any[];





    constructor(){



        this.messages=[];


        this.events=[];


        this.memory=[];



        this.context={


            problem:"",


            geometry:null,


            simulation:null,


            decisions:[]


        };


    }





    /**
     * Mesaj gönderme
     */
    send(

        message:AgentMessage

    ){



        this.messages.push(

            message

        );



        this.events.push({


            message,


            processed:false


        });



        return message;


    }





    /**
     * Mesaj alma
     */
    receive(

        agent:string

    ){



        return this.messages.filter(

            m=>

            m.receiver===agent

        );


    }





    /**
     * Agent cevabı
     */
    reply(

        sender:string,

        receiver:string,

        content:any

    ){



        return this.send({


            id:

                crypto.randomUUID(),


            sender,


            receiver,


            type:

                "RESPONSE",


            content,


            timestamp:

                Date.now()


        });


    }





    /**
     * Bilgi paylaşımı
     */
    broadcast(

        sender:string,

        content:any

    ){



        const agents=[


            "CAD_AGENT",

            "CAE_AGENT",

            "CAM_AGENT",

            "OPT_AGENT"


        ];



        agents.forEach(

            receiver=>{


                this.send({


                    id:

                        crypto.randomUUID(),


                    sender,


                    receiver,


                    type:

                        "INFORMATION",


                    content,


                    timestamp:

                        Date.now()


                });


            }

        );


    }





    /**
     * Ortak mühendislik hafızası
     */
    updateContext(

        context:Partial<SharedEngineeringContext>

    ){



        this.context={


            ...this.context,


            ...context


        };



    }





    /**
     * Ortak bağlam okuma
     */
    getContext(){


        return this.context;


    }





    /**
     * Uyarı gönderme
     */
    warn(

        sender:string,

        receiver:string,

        warning:string

    ){



        return this.send({


            id:

                crypto.randomUUID(),


            sender,


            receiver,


            type:

                "WARNING",


            content:

                warning,


            timestamp:

                Date.now()


        });


    }





    /**
     * Agent müzakeresi
     */
    negotiate(

        participants:string[]

    ):NegotiationResult {



        const result={


            agreement:true,


            decision:

                "Selected optimized engineering solution",


            participants


        };



        this.memory.push(

            result

        );



        return result;


    }





    /**
     * Consensus mesajı
     */
    createConsensus(

        decision:any

    ){



        const message={


            id:

                crypto.randomUUID(),


            sender:

                "ORCHESTRATOR",


            receiver:

                "ALL_AGENTS",


            type:

                "CONSENSUS",


            content:

                decision,


            timestamp:

                Date.now()


        };



        return this.send(

            message

        );


    }





    /**
     * Mesaj önceliği
     */
    prioritize(){

        

        return this.messages.sort(

            (

                a,

                b

            )=>{


                const priority={


                    WARNING:5,


                    CONSENSUS:4,


                    REQUEST:3,


                    RESPONSE:2,


                    INFORMATION:1,


                    NEGOTIATION:3


                };



                return priority[b.type]

                    -

                    priority[a.type];


            }

        );


    }





    /**
     * Event işleme
     */
    processEvents(){



        this.events.forEach(

            event=>{


                event.processed=true;


            }

        );



        return {


            processed:

                this.events.length


        };


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


            messages:

                this.messages.length,


            events:

                this.events.length,


            memory:

                this.memory.length


        };


    }





    /**
     * Reset
     */
    reset(){


        this.messages=[];


        this.events=[];


        this.memory=[];


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepEngineeringAgentCommunication",


            status:

                "COMMUNICATION_BUS_ACTIVE"


        };


    }


}