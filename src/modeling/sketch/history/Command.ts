export interface CommandResult {


    success:boolean;


    message?:string;


}







export abstract class Command {



    public readonly id:string;


    public readonly createdAt:

    Date;





    protected executed:

    boolean = false;





    constructor(

        public description:string

    ){



        this.id =

        crypto.randomUUID();



        this.createdAt =

        new Date();

    }







    abstract execute():

    CommandResult;







    abstract undo():

    CommandResult;







    redo():

    CommandResult {



        return this.execute();

    }







    canUndo():

    boolean {



        return this.executed;

    }







    isExecuted():

    boolean {



        return this.executed;

    }







    protected markExecuted():

    void {



        this.executed = true;

    }







    protected markUndone():

    void {



        this.executed = false;

    }







    mergeWith(

        command:Command

    ):

    boolean {



        return false;

    }







    getDescription():

    string {



        return this.description;

    }







}