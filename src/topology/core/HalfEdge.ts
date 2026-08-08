import { Edge }
from "./Edge";


import { Vertex }
from "./Vertex";







export class HalfEdge {



    public next:

    HalfEdge|null = null;



    public previous:

    HalfEdge|null = null;



    public twin:

    HalfEdge|null = null;







    constructor(


        public edge:Edge,


        public start:Vertex,


        public end:Vertex


    ){



        if(

            !edge.containsVertex(

                start

            )

        ){

            throw new Error(

                "HalfEdge start vertex does not belong to edge"

            );

        }





        if(

            !edge.containsVertex(

                end

            )

        ){

            throw new Error(

                "HalfEdge end vertex does not belong to edge"

            );

        }





        if(

            start === end

        ){

            throw new Error(

                "HalfEdge cannot have same start and end vertex"

            );

        }

    }









    setNext(

        halfEdge:HalfEdge|null

    ):

    void {



        this.next =

        halfEdge;

    }









    setPrevious(

        halfEdge:HalfEdge|null

    ):

    void {



        this.previous =

        halfEdge;

    }









    setTwin(

        halfEdge:HalfEdge|null

    ):

    void {



        this.twin =

        halfEdge;



        if(

            halfEdge

        ){



            halfEdge.twin =

            this;

        }

    }









    getStart():

    Vertex {



        return this.start;

    }









    getEnd():

    Vertex {



        return this.end;

    }









    getEdge():

    Edge {



        return this.edge;

    }









    getNext():

    HalfEdge|null {



        return this.next;

    }









    getPrevious():

    HalfEdge|null {



        return this.previous;

    }









    getTwin():

    HalfEdge|null {



        return this.twin;

    }









    reverse():

    HalfEdge {



        this.edge.reverse();



        return new HalfEdge(

            this.edge,

            this.end,

            this.start

        );

    }









    length():

    number {



        return this.edge.getLength();

    }









    connects(

        vertex:Vertex

    ):

    boolean {



        return (

            this.start === vertex

            ||

            this.end === vertex

        );

    }









    isClosed():

    boolean {



        return (

            this.start === this.end

        );

    }









    clone():

    HalfEdge {



        const cloned =

        new HalfEdge(

            this.edge.clone(),

            this.start.clone(),

            this.end.clone()

        );





        return cloned;

    }









    hasTwin():

    boolean {



        return this.twin !== null;

    }









    hasLoop():

    boolean {



        return (

            this.next === this

        );

    }



}