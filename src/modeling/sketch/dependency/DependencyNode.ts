id="dependency_node_ts"
export enum DependencyNodeType {


    Sketch = "Sketch",


    Entity = "Entity",


    Constraint = "Constraint",


    Profile = "Profile",


    Feature = "Feature",


    Solid = "Solid"

}







export enum DependencyState {


    Clean = "Clean",


    Dirty = "Dirty",


    Updating = "Updating",


    Failed = "Failed"

}







export interface DependencyMetadata {


    createdAt?:Date;


    modifiedAt?:Date;


    source?:string;


    properties?:Record<string,any>;

}







export class DependencyNode {



    public readonly id:string;



    private dependencies:

    Set<DependencyNode> =

    new Set();





    private dependents:

    Set<DependencyNode> =

    new Set();





    private state:

    DependencyState =

    DependencyState.Clean;





    private version:number = 0;







    constructor(


        id:string,


        public type:

        DependencyNodeType,


        public data?:any,


        public metadata:

        DependencyMetadata = {}

    ){



        this.id = id;

    }







    addDependency(

        node:

        DependencyNode

    ):

    void {



        if(

            node === this

        ){

            throw new Error(

                "Node cannot depend on itself"

            );

        }



        this.dependencies.add(

            node

        );



        node.addDependent(

            this

        );



        this.markDirty();

    }







    removeDependency(

        node:

        DependencyNode

    ):

    void {



        this.dependencies.delete(

            node

        );



        node.removeDependent(

            this

        );



        this.markDirty();

    }







    addDependent(

        node:

        DependencyNode

    ):

    void {



        this.dependents.add(

            node

        );

    }







    removeDependent(

        node:

        DependencyNode

    ):

    void {



        this.dependents.delete(

            node

        );

    }







    getDependencies():

    DependencyNode[] {



        return Array.from(

            this.dependencies

        );

    }







    getDependents():

    DependencyNode[] {



        return Array.from(

            this.dependents

        );

    }







    markDirty():

    void {



        this.state =

        DependencyState.Dirty;



        this.version++;

    }







    markClean():

    void {



        this.state =

        DependencyState.Clean;

    }







    isDirty():

    boolean {



        return (

            this.state ===

            DependencyState.Dirty

        );

    }







    getState():

    DependencyState {



        return this.state;

    }







    getVersion():

    number {



        return this.version;

    }







    update():

    void {



        this.state =

        DependencyState.Updating;



        try {



            if(

                this.data &&

                typeof this.data.update ===

                "function"

            ){



                this.data.update();

            }



            this.markClean();



        }

        catch(error){



            this.state =

            DependencyState.Failed;



            throw error;

        }

    }







    dependsOn(

        node:

        DependencyNode

    ):

    boolean {



        return this.dependencies.has(

            node

        );

    }







    toJSON():

    object {



        return {


            id:this.id,


            type:this.type,


            state:this.state,


            version:this.version,


            dependencies:

            Array.from(

                this.dependencies

            )

            .map(

                x=>x.id

            )

        };

    }



}