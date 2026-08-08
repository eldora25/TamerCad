import { Command }
from "./Command";







export enum SketchHistoryEventType {


    Create = "Create",


    Modify = "Modify",


    Delete = "Delete",


    Constraint = "Constraint",


    Transform = "Transform"

}







export interface SketchHistoryEntry {


    id:string;


    type:

    SketchHistoryEventType;


    description:string;


    command?:Command;


    entityIds:string[];


    timestamp:Date;


    metadata?:Record<string, any>;

}







export interface HistoryQuery {


    type?:

    SketchHistoryEventType;


    entityId?:string;


}







export class SketchHistory {



    private entries:

    SketchHistoryEntry[] = [];







    add(

        entry:

        SketchHistoryEntry

    ):

    void {



        this.entries.push(

            entry

        );

    }







    recordCommand(

        command:

        Command,


        entityIds:

        string[] = []

    ):

    void {



        this.add({

            id:

            crypto.randomUUID(),


            type:

            SketchHistoryEventType.Modify,


            description:

            command.getDescription(),


            command,


            entityIds,


            timestamp:

            new Date()

        });

    }







    recordCreate(

        description:string,


        entityIds:string[]

    ):

    void {



        this.add({

            id:

            crypto.randomUUID(),


            type:

            SketchHistoryEventType.Create,


            description,


            entityIds,


            timestamp:

            new Date()

        });

    }







    recordDelete(

        description:string,


        entityIds:string[]

    ):

    void {



        this.add({

            id:

            crypto.randomUUID(),


            type:

            SketchHistoryEventType.Delete,


            description,


            entityIds,


            timestamp:

            new Date()

        });

    }







    recordConstraint(

        description:string,


        constraintId:string

    ):

    void {



        this.add({

            id:

            crypto.randomUUID(),


            type:

            SketchHistoryEventType.Constraint,


            description,


            entityIds:[

                constraintId

            ],


            timestamp:

            new Date()

        });

    }







    query(

        query:

        HistoryQuery

    ):

    SketchHistoryEntry[] {



        return this.entries.filter(

            entry => {


                if(

                    query.type &&

                    entry.type !== query.type

                ){

                    return false;

                }



                if(

                    query.entityId &&

                    !entry.entityIds.includes(

                        query.entityId

                    )

                ){

                    return false;

                }



                return true;

            }

        );

    }







    getEntry(

        id:string

    ):

    SketchHistoryEntry|null {



        return (

            this.entries.find(

                x =>

                x.id === id

            )

            ??

            null

        );

    }







    getTimeline():

    SketchHistoryEntry[] {



        return [

            ...this.entries

        ];

    }







    size():

    number {



        return this.entries.length;

    }







    clear():

    void {



        this.entries = [];

    }







    replay():

    void {



        for(

            const entry of

            this.entries

        ){



            if(

                entry.command

            ){



                entry.command.redo();

            }

        }

    }



}