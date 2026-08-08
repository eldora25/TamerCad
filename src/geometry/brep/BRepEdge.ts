import { BRepVertex } from "./BRepVertex";
import { Curve3 } from "../curve/Curve3";


export class BRepEdge {


    public id:string;



    /**
     * Başlangıç vertex
     */
    public startVertex:BRepVertex;



    /**
     * Bitiş vertex
     */
    public endVertex:BRepVertex;



    /**
     * Edge geometrisi
     */
    public curve:Curve3;



    /**
     * Bağlı yüzler
     */
    public faces:string[];



    /**
     * Yön
     */
    public reversed:boolean;



    /**
     * Metadata
     */
    public metadata:
    Record<string, any>;



    constructor(

        startVertex:BRepVertex,

        endVertex:BRepVertex,

        curve:Curve3

    ){

        this.id =
            crypto.randomUUID();



        this.startVertex =
            startVertex;



        this.endVertex =
            endVertex;



        this.curve =
            curve;



        this.faces =
            [];



        this.reversed =
            false;



        this.metadata =
            {};



        /*
            Vertex topoloji bağlantısı
        */

        this.startVertex
            .addEdge(
                this.id
            );


        this.endVertex
            .addEdge(
                this.id
            );

    }



    /**
     * Edge uzunluğu
     */
    length():number {


        return this.curve.length();

    }



    /**
     * Başlangıç noktası
     */
    startPoint(){


        return this.startVertex
            .point
            .clone();

    }



    /**
     * Bitiş noktası
     */
    endPoint(){


        return this.endVertex
            .point
            .clone();

    }



    /**
     * Yüz bağlantısı ekleme
     */
    addFace(
        faceId:string
    ):void {


        if(
            !this.faces.includes(faceId)
        ){

            this.faces.push(
                faceId
            );

        }

    }



    /**
     * Yüz bağlantısı silme
     */
    removeFace(
        faceId:string
    ):void {


        const index =
            this.faces.indexOf(
                faceId
            );



        if(index !== -1){

            this.faces.splice(
                index,
                1
            );

        }

    }



    /**
     * Bağlı yüz sayısı
     */
    faceCount():number {


        return this.faces.length;

    }



    /**
     * Edge yön ters çevirme
     */
    reverse():void {


        const temp =
            this.startVertex;


        this.startVertex =
            this.endVertex;


        this.endVertex =
            temp;



        this.reversed =
            !this.reversed;

    }



    /**
     * Edge üzerinde nokta
     */
    evaluate(
        t:number
    ){

        return this.curve.evaluate(
            t
        );

    }



    /**
     * Clone
     */
    clone():BRepEdge {


        return new BRepEdge(

            this.startVertex.clone(),

            this.endVertex.clone(),

            this.curve.clone()

        );

    }



    /**
     * Edge doğrulama
     */
    isValid():boolean {


        return (

            this.startVertex !==
            this.endVertex

            &&

            this.curve !== undefined

        );

    }



    toJSON(){

        return {

            id:
                this.id,


            startVertex:
                this.startVertex.id,


            endVertex:
                this.endVertex.id,


            faces:
                this.faces,


            reversed:
                this.reversed

        };

    }



    toString():string {


        return (

            `BRepEdge(` +

            `${this.startVertex.id}` +

            " -> " +

            `${this.endVertex.id}, ` +

            `Faces:${this.faces.length}` +

            `)`

        );

    }

}