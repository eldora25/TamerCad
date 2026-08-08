import { Command,
         CommandResult }

from "./Command";







export interface CommandEvent {


    type:

    "execute"

    |

    "undo"

    |

    "redo";



    command:

    Command;

}







export class CommandManager {



    private undoStack:

    Command[] = [];





    private redoStack:

    Command[] = [];





    private listeners:

    (

        event:CommandEvent

    )=>void

    [] = [];





    private transactionCommands:

    Command[]|null = null;







    execute(

        command:

        Command

    ):

    CommandResult {



        const result =

        command.execute();



        if(

            !result.success

        ){

            return result;

        }





        if(

            this.transactionCommands

        ){



            this.transactionCommands

            .push(

                command

            );



        }

        else {



            this.undoStack.push(

                command

            );



            this.redoStack = [];

        }





        this.emit({

            type:

            "execute",


            command

        });



        return result;

    }







    undo():

    CommandResult {



        const command =

        this.undoStack.pop();



        if(

            !command

        ){



            return {

                success:false,


                message:

                "Nothing to undo"

            };

        }





        const result =

        command.undo();



        if(

            result.success

        ){



            this.redoStack.push(

                command

            );



            this.emit({

                type:

                "undo",


                command

            });

        }



        return result;

    }







    redo():

    CommandResult {



        const command =

        this.redoStack.pop();



        if(

            !command

        ){



            return {

                success:false,


                message:

                "Nothing to redo"

            };

        }





        const result =

        command.redo();



        if(

            result.success

        ){



            this.undoStack.push(

                command

            );



            this.emit({

                type:

                "redo",


                command

            });

        }



        return result;

    }







    beginTransaction():

    void {



        this.transactionCommands = [];

    }







    commitTransaction():

    void {



        if(

            !this.transactionCommands

        ){

            return;

        }



        const commands =

        this.transactionCommands;



        this.transactionCommands =

        null;



        if(

            commands.length === 1

        ){



            this.undoStack.push(

                commands[0]

            );



        }

        else if(

            commands.length > 1

        ){



            this.undoStack.push(

                new CompositeCommand(

                    commands

                )

            );

        }



        this.redoStack = [];

    }







    rollbackTransaction():

    void {



        if(

            !this.transactionCommands

        ){

            return;

        }



        for(

            let i =

            this.transactionCommands.length-1;


            i >=0;


            i--

        ){



            this.transactionCommands[i]

            .undo();

        }



        this.transactionCommands =

        null;

    }







    subscribe(

        listener:

        (

            event:CommandEvent

        )=>void

    ):

    void {



        this.listeners.push(

            listener

        );

    }







    clear():

    void {



        this.undoStack = [];

        this.redoStack = [];

    }







    canUndo():

    boolean {



        return (

            this.undoStack.length

            >

            0

        );

    }







    canRedo():

    boolean {



        return (

            this.redoStack.length

            >

            0

        );

    }







    private emit(

        event:

        CommandEvent

    ):

    void {



        for(

            const listener of

            this.listeners

        ){



            listener(

                event

            );

        }

    }



}







export class CompositeCommand

extends Command {



    constructor(

        private commands:

        Command[]

    ){



        super(

            "Composite Command"

        );

    }





    execute():

    CommandResult {



        for(

            const command of

            this.commands

        ){



            command.redo();

        }



        return {

            success:true

        };

    }





    undo():

    CommandResult {



        for(

            let i =

            this.commands.length-1;


            i>=0;


            i--

        ){



            this.commands[i]

            .undo();

        }



        return {

            success:true

        };

    }



}