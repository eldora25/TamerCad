import { Solid }
from "../../topology/core/Solid";







export enum FeatureType {


    Primitive = "Primitive",


    Operation = "Operation",


    Modification = "Modification",


    Construction = "Construction"

}







export interface FeatureParameter {


    name:string;


    value:any;


}







export interface FeatureState {


    dirty:boolean;


    visible:boolean;


}







export abstract class Feature {



    public children:

    Feature[] = [];



    public parents:

    Feature[] = [];



    protected result:

    Solid | null = null;



    protected state:

    FeatureState = {


        dirty:true,


        visible:true


    };







    constructor(

        public id:string,


        public name:string,


        public type:FeatureType,


        public parameters:

        FeatureParameter[] = []

    ){}





    abstract rebuild():

    Solid;









    evaluate():

    Solid {



        if(

            this.state.dirty

            ||

            !this.result

        ){



            const rebuilt =

            this.rebuild();



            this.result =

            rebuilt;



            this.state.dirty =

            false;

        }





        return this.result as Solid;

    }









    getResult():

    Solid {



        return this.evaluate();

    }









    setParameter(

        name:string,


        value:any

    ):

    void {



        const parameter =

        this.parameters.find(

            p =>

            p.name === name

        );





        if(

            parameter

        ){



            parameter.value =

            value;

        }

        else {



            this.parameters.push({


                name,


                value


            });

        }





        this.invalidate();

    }









    getParameter(

        name:string

    ):

    any {



        const parameter =

        this.parameters.find(

            p =>

            p.name === name

        );





        return parameter?.value;

    }









    addChild(

        feature:Feature

    ):

    void {



        if(

            this.children.includes(

                feature

            )

        ){

            return;

        }





        this.children.push(

            feature

        );





        if(

            !feature.parents.includes(

                this

            )

        ){



            feature.parents.push(

                this

            );

        }

    }









    removeChild(

        feature:Feature

    ):

    void {



        const index =

        this.children.indexOf(

            feature

        );





        if(

            index !== -1

        ){



            this.children.splice(

                index,

                1

            );

        }





        const parentIndex =

        feature.parents.indexOf(

            this

        );





        if(

            parentIndex !== -1

        ){



            feature.parents.splice(

                parentIndex,

                1

            );

        }

    }









    invalidate():

    void {



        this.result =

        null;



        this.state.dirty =

        true;





        for(

            const child of

            this.children

        ){



            child.invalidate();

        }

    }









    setVisible(

        value:boolean

    ):

    void {



        this.state.visible =

        value;

    }









    isVisible():

    boolean {



        return this.state.visible;

    }









    isDirty():

    boolean {



        return this.state.dirty;

    }









    getParents():

    Feature[] {



        return this.parents;

    }









    getChildren():

    Feature[] {



        return this.children;

    }



}