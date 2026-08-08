import { Point3 } from "../point/Point3";


export class BRepVertex {


    public id:string;


    /**
     * Geometrik konum
     */
    public point:Point3;



    /**
     * Bağlı edge listesi
     */
    public edges:string[];



    /**
     * Kullanıcı metadata
     */
    public metadata:
    Record<string, any>;



    constructor(
        point:Point3
    ){

        this.id =
            crypto.randomUUID();



        this.point =
            point.clone();



        this.edges =
            [];



        this.metadata =
            {};

    }



    /**
     * Edge bağlantısı ekleme
     */
    addEdge(
        edgeId:string
    ):void {


        if(
            !this.edges.includes(edgeId)
        ){

            this.edges.push(
                edgeId
            );

        }

    }



    /**
     * Edge bağlantısı silme
     */
    removeEdge(
        edgeId:string
    ):void {


        const index =
            this.edges.indexOf(
                edgeId
            );



        if(index !== -1){

            this.edges.splice(
                index,
                1
            );

        }

    }



    /**
     * Bağlı edge sayısı
     */
    edgeCount():number {


        return this.edges.length;

    }



    /**
     * Nokta güncelleme
     */
    move(
        point:Point3
    ):void {


        this.point =
            point.clone();

    }



    /**
     * Vertex kopyalama
     */
    clone():BRepVertex {


        const vertex =
            new BRepVertex(

                this.point.clone()

            );



        vertex.edges =
            [
                ...this.edges
            ];



        vertex.metadata =
            {
                ...this.metadata
            };



        return vertex;

    }



    /**
     * İki vertex eşit mi?
     */
    equals(
        other:BRepVertex,
        tolerance:number = 0.000001
    ):boolean {


        return (

            this.point.distanceTo(
                other.point
            )
            <
            tolerance

        );

    }



    /**
     * Serialize
     */
    toJSON(){

        return {

            id:
                this.id,


            point:
                {

                    x:this.point.x,

                    y:this.point.y,

                    z:this.point.z

                },


            edges:
                this.edges

        };

    }



    toString():string {


        return (

            `BRepVertex(` +

            `${this.point.toString()}, ` +

            `Edges:${this.edges.length}` +

            `)`

        );

    }

}