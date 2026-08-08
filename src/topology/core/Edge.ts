import { Vertex }
from "./Vertex";


import { Curve }
from "../../geometry/curve/Curve";







export class Edge {



    public curve:

    Curve|null = null;



    public reversed:

    boolean = false;



    private valid:

    boolean = true;







    constructor(


        public start:Vertex,


        public end:Vertex,


        curve:Curve|null = null

    ){



        this.curve =

        curve;



        this.start.addEdge(

            this

        );



        this.end.addEdge(

            this

        );

    }









    getStartVertex():

    Vertex {



        return this.start;

    }









    getEndVertex():

    Vertex {



        return this.end;

    }









    getLength():

    number {



        if(

            this.curve

        ){



            return this.curve.length();

        }





        return this.start.position

        .distanceTo(

            this.end.position

        );

    }









    getCurve():

    Curve|null {



        return this.curve;

    }









    setCurve(

        curve:Curve

    ):

    void {



        this.curve =

        curve;



        this.invalidate();

    }









    reverse():

    void {



        const temp =

        this.start;



        this.start =

        this.end;



        this.end =

        temp;



        this.reversed =

        !this.reversed;





        this.invalidate();

    }









    getDirection():

    {

        x:number,

        y:number,

        z:number

    } {



        const dx =

        this.end.position.x -

        this.start.position.x;



        const dy =

        this.end.position.y -

        this.start.position.y;



        const dz =

        this.end.position.z -

        this.start.position.z;





        const length =

        Math.sqrt(

            dx * dx +

            dy * dy +

            dz * dz

        );





        if(

            length === 0

        ){

            return {

                x:0,

                y:0,

                z:0

            };

        }





        return {

            x:

            dx / length,


            y:

            dy / length,


            z:

            dz / length

        };

    }









    containsVertex(

        vertex:Vertex

    ):

    boolean {



        return (

            this.start === vertex

            ||

            this.end === vertex

        );

    }









    otherVertex(

        vertex:Vertex

    ):

    Vertex|null {



        if(

            this.start === vertex

        ){

            return this.end;

        }





        if(

            this.end === vertex

        ){

            return this.start;

        }





        return null;

    }









    equals(

        edge:Edge,

        tolerance:number = 1e-6

    ):

    boolean {



        return (

            (

                this.start.equals(

                    edge.start,

                    tolerance

                )

                &&

                this.end.equals(

                    edge.end,

                    tolerance

                )

            )

            ||

            (

                this.start.equals(

                    edge.end,

                    tolerance

                )

                &&

                this.end.equals(

                    edge.start,

                    tolerance

                )

            )

        );

    }









    clone():

    Edge {



        return new Edge(

            this.start.clone(),

            this.end.clone(),

            this.curve

        );

    }









    invalidate():

    void {



        this.valid =

        false;

    }









    isValid():

    boolean {



        return this.valid;

    }









    remove():

    void {



        this.start.removeEdge(

            this

        );



        this.end.removeEdge(

            this

        );



        this.valid =

        false;

    }



}