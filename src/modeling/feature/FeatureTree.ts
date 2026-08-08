import { Feature }
from "./Feature";


import { Solid }
from "../../topology/core/Solid";







export class FeatureTree {



    private features:

    Feature[] = [];



    private activeFeature:

    Feature | null = null;







    constructor(

        public name:string =

        "Model"

    ){}



    







    addFeature(

        feature:Feature

    ):

    void {



        if(

            this.getFeature(

                feature.id

            )

        ){

            throw new Error(

                "Feature id already exists"

            );

        }





        const previous =

        this.getLastFeature();





        if(

            previous

        ){

            previous.addChild(

                feature

            );

        }





        this.features.push(

            feature

        );





        this.activeFeature =

        feature;

    }









    add(

        feature:Feature

    ):

    void {



        this.addFeature(

            feature

        );

    }









    removeFeature(

        id:string

    ):

    boolean {



        const feature =

        this.getFeature(

            id

        );





        if(

            !feature

        ){

            return false;

        }





        for(

            const parent of

            feature.getParents()

        ){



            parent.removeChild(

                feature

            );

        }





        for(

            const child of

            feature.getChildren()

        ){



            child.parents =

            child.parents.filter(

                p =>

                p !== feature

            );

        }





        const index =

        this.features.indexOf(

            feature

        );





        if(

            index !== -1

        ){



            this.features.splice(

                index,

                1

            );

        }





        if(

            this.activeFeature === feature

        ){



            this.activeFeature =

            this.getLastFeature();

        }





        return true;

    }









    remove(

        id:string

    ):

    boolean {



        return this.removeFeature(

            id

        );

    }









    getFeature(

        id:string

    ):

    Feature | undefined {



        return this.features.find(

            feature =>

            feature.id === id

        );

    }









    find(

        id:string

    ):

    Feature | undefined {



        return this.getFeature(

            id

        );

    }









    getLastFeature():

    Feature | null {



        if(

            this.features.length === 0

        ){

            return null;

        }





        return this.features[

            this.features.length - 1

        ];

    }









    setActiveFeature(

        id:string

    ):

    boolean {



        const feature =

        this.find(

            id

        );





        if(

            !feature

        ){

            return false;

        }





        this.activeFeature =

        feature;



        return true;

    }









    getActiveFeature():

    Feature | null {



        return this.activeFeature;

    }









    rebuild():

    Solid | null {



        let result:

        Solid | null = null;





        for(

            const feature of

            this.features

        ){



            result =

            feature.evaluate();

        }





        return result;

    }









    getOrdered():

    Feature[] {



        return [

            ...this.features

        ];

    }









    rollback(

        id:string

    ):

    Solid | null {



        const index =

        this.features.findIndex(

            feature =>

            feature.id === id

        );





        if(

            index < 0

        ){

            return null;

        }





        return this.setEnd(

            this.features[index]

        );

    }









    setEnd(

        feature:Feature

    ):

    Solid | null {



        const index =

        this.features.indexOf(

            feature

        );





        if(

            index < 0

        ){

            return null;

        }





        for(

            let i = 0;

            i < this.features.length;

            i++

        ){



            this.features[i]

            .invalidate();

        }





        let result:

        Solid | null = null;





        for(

            let i = 0;

            i <= index;

            i++

        ){



            result =

            this.features[i]

            .evaluate();

        }





        this.activeFeature =

        feature;





        return result;

    }









    traverse(

        callback:

        (

            feature:Feature

        )=>void

    ):

    void {



        for(

            const feature of

            this.features

        ){



            callback(

                feature

            );

        }

    }









    clear():

    void {



        this.features = [];



        this.activeFeature =

        null;

    }









    get count():

    number {



        return this.features.length;

    }



}