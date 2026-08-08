import { Feature }
from "./Feature";


import { FeatureTree }
from "./FeatureTree";







export interface FeatureManagerResult {


    success:boolean;


    message?:string;


}







export class FeatureManager {



    public tree:

    FeatureTree;









    constructor(){



        this.tree =

        new FeatureTree();

    }









    addFeature(

        feature:Feature

    ):

    FeatureManagerResult {



        try {



            this.tree.addFeature(

                feature

            );





            return {


                success:true

            };

        }

        catch(error){



            return {


                success:false,


                message:

                String(error)

            };

        }

    }









    removeFeature(

        id:string

    ):

    FeatureManagerResult {



        const removed =

        this.tree.removeFeature(

            id

        );





        if(

            !removed

        ){



            return {


                success:false,


                message:

                "Feature not found"

            };

        }





        return {


            success:true

        };

    }









    activateFeature(

        id:string

    ):

    boolean {



        return this.tree

        .setActiveFeature(

            id

        );

    }









    getActiveFeature():

    Feature|null {



        return this.tree

        .getActiveFeature();

    }









    rebuild():

    void {



        this.tree.rebuild();

    }









    update():

    void {



        this.rebuild();

    }









    rollback(

        featureId:string

    ):

    Feature|null {



        const result =

        this.tree.rollback(

            featureId

        );





        return result;

    }









    getFeatures():

    Feature[] {



        return this.tree

        .getOrdered();

    }









    getFeatureCount():

    number {



        return this.tree.count;

    }









    clear():

    void {



        this.tree.clear();

    }







}