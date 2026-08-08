import { BRepEdge } from "./BRepEdge";
import { Point3 } from "../point/Point3";


export class BRepLoop {


    public id:string;



    /**
     * Loop edge sırası
     */
    public edges:BRepEdge[];



    /**
     * Dış sınır mı?
     */
    public outer:boolean;



    /**
     * Metadata
     */
    public metadata:
    Record<string, any>;



    constructor(

        outer:boolean = true

    ){

        this.id =
            crypto.randomUUID();


        this.edges =
            [];


        this.outer =
            outer;


        this.metadata =
            {};

    }





    /**
     * Edge ekleme
     */
    addEdge(
        edge:BRepEdge
    ):void {


        this.edges.push(
            edge
        );

    }





    /**
     * Edge kaldırma
     */
    removeEdge(
        edgeId:string
    ):void {


        this.edges =
            this.edges.filter(

                e =>
                    e.id !== edgeId

            );

    }





    /**
     * Edge sayısı
     */
    edgeCount():number {


        return this.edges.length;

    }





    /**
     * Loop kapalı mı?
     */
    isClosed(
        tolerance:number = 0.000001
    ):boolean {


        if(
            this.edges.length < 2
        ){

            return false;

        }



        for(
            let i=0;
            i<this.edges.length;
            i++
        ){


            const current =
                this.edges[i];


            const next =
                this.edges[
                    (i+1)
                    %
                    this.edges.length
                ];



            if(
                current.endPoint()
                .distanceTo(

                    next.startPoint()

                )
                >
                tolerance
            ){

                return false;

            }

        }



        return true;

    }





    /**
     * Loop başlangıç noktası
     */
    startPoint():Point3 | null {


        if(
            this.edges.length === 0
        ){

            return null;

        }


        return this.edges[0]
            .startPoint();

    }





    /**
     * Loop uzunluğu
     */
    perimeter():number {


        let length = 0;



        for(
            const edge of this.edges
        ){

            length +=
                edge.length();

        }



        return length;

    }





    /**
     * Edge sırasını ters çevirme
     */
    reverse():void {


        this.edges.reverse();



        for(
            const edge of this.edges
        ){

            edge.reverse();

        }

    }





    /**
     * Dış / iç loop değişimi
     */
    toggleOuter():void {


        this.outer =
            !this.outer;

    }





    /**
     * Loop kopyalama
     */
    clone():BRepLoop {


        const loop =
            new BRepLoop(
                this.outer
            );



        loop.edges =
            this.edges.map(

                e =>
                    e.clone()

            );



        loop.metadata =
            {
                ...this.metadata
            };



        return loop;

    }





    /**
     * Loop doğrulama
     */
    isValid():boolean {


        return (

            this.edges.length > 0

            &&

            this.isClosed()

        );

    }





    /**
     * JSON export
     */
    toJSON(){


        return {


            id:
                this.id,


            edges:
                this.edges.map(

                    e =>
                        e.id

                ),


            outer:
                this.outer


        };

    }





    toString():string {


        return (

            `BRepLoop(` +

            `Edges:${this.edges.length}, ` +

            `Outer:${this.outer}` +

            `)`

        );

    }

}