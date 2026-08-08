import { Command }
from "./Command";







export interface HistoryState {


    index:number;


    size:number;


}







export interface Checkpoint {


    id:string;


    name:string;


    commandIndex:number;


    createdAt:Date;

}







export class UndoRedoManager {



    private history:

    Command[] = [];





    private cursor:number = -1;





    private checkpoints:

    Checkpoint[] = [];







    constructor(

        private maxHistory:number = 500

    ){}







    execute(

        command:

        Command

    ):



    boolean {



        const result =

        command.execute();



        if(

            !result.success

        ){

            return false;

        }





        // ileri tarih temizlenir

        this.history =

        this.history.slice(

            0,

            this.cursor + 1

        );



        this.history.push(

            command

        );



        this.cursor++;



        this.optimize();



        return true;

    }







    undo():

    boolean {



        if(

            !this.canUndo()

        ){

            return false;

        }





        const command =

        this.history[

            this.cursor

        ];



        const result =

        command.undo();



        if(

            result.success

        ){



            this.cursor--;

            return true;

        }



        return false;

    }







    redo():

    boolean {



        if(

            !this.canRedo()

        ){

            return false;

        }





        const command =

        this.history[

            this.cursor + 1

        ];



        const result =

        command.redo();



        if(

            result.success

        ){



            this.cursor++;

            return true;

        }



        return false;

    }







    jumpTo(

        index:number

    ):

    boolean {



        if(

            index < -1 ||

            index >= this.history.length

        ){

            return false;

        }





        while(

            this.cursor >

            index

        ){



            this.undo();

        }





        while(

            this.cursor <

            index

        ){



            this.redo();

        }



        return true;

    }







    createCheckpoint(

        name:string

    ):

    Checkpoint {



        const checkpoint = {


            id:

            crypto.randomUUID(),


            name,


            commandIndex:

            this.cursor,


            createdAt:

            new Date()


        };



        this.checkpoints.push(

            checkpoint

        );



        return checkpoint;

    }







    restoreCheckpoint(

        checkpointId:string

    ):

    boolean {



        const checkpoint =

        this.checkpoints.find(

            c =>

            c.id === checkpointId

        );



        if(

            !checkpoint

        ){

            return false;

        }





        return this.jumpTo(

            checkpoint.commandIndex

        );

    }







    clear():

    void {



        this.history = [];

        this.cursor = -1;

        this.checkpoints = [];

    }







    canUndo():

    boolean {



        return (

            this.cursor >= 0

        );

    }







    canRedo():

    boolean {



        return (

            this.cursor <

            this.history.length-1

        );

    }







    getState():

    HistoryState {



        return {


            index:

            this.cursor,


            size:

            this.history.length


        };

    }







    getHistory():

    Command[] {



        return [

            ...this.history

        ];

    }







    getCheckpoints():

    Checkpoint[] {



        return [

            ...this.checkpoints

        ];

    }







    private optimize():

    void {



        if(

            this.history.length

            >

            this.maxHistory

        ){



            const removeCount =

            this.history.length

            -

            this.maxHistory;



            this.history.splice(

                0,

                removeCount

            );



            this.cursor -=

            removeCount;

        }

    }



}