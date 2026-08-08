import { Surface3 } from "../surface/Surface3";
import { BRepLoop } from "./BRepLoop";
import { Mesh3 } from "../mesh/Mesh3";
import { Tessellator3 } from "../mesh/Tessellator3";



export class BRepFace {


    public id:string;



    /**
     * Geometrik yüzey
     */
    public surface:Surface3;



    /**
     * Dış sınır
     */
    public outerLoop:BRepLoop;



    /**
     * Delik loopları
     */
    public innerLoops:BRepLoop[];



    /**
     * Yüz yönü
     */
    public reversed:boolean;



    /**
     * Metadata
     */
    public metadata:
    Record<string, any>;



    constructor(

        surface:Surface3,

        outerLoop:BRepLoop

    ){

        this.id =
            crypto.randomUUID();


        this.surface =
            surface;


        this.outerLoop =
            outerLoop;


        this.innerLoops =
            [];


        this.reversed =
            false;


        this.metadata =
            {};

    }





    /**
     * İç loop ekleme
     */
    addInnerLoop(
        loop:BRepLoop
    ):void {


        this.innerLoops.push(
            loop
        );

    }





    /**
     * İç loop silme
     */
    removeInnerLoop(
        index:number
    ):void {


        this.innerLoops.splice(

            index,

            1

        );

    }





    /**
     * Loop sayısı
     */
    loopCount():number {


        return (

            1 +
            this.innerLoops.length

        );

    }





    /**
     * Yüz ters çevirme
     */
    reverse():void {


        this.reversed =
            !this.reversed;



        this.outerLoop
            .reverse();



        for(
            const loop of this.innerLoops
        ){

            loop.reverse();

        }

    }





    /**
     * Yaklaşık alan hesabı
     */
    area():number {


        const mesh =
            this.tessellate();



        return mesh.area();

    }





    /**
     * Mesh üretimi
     */
    tessellate():Mesh3 {


        return Tessellator3
            .production(

                {

                    getSurfaces:()=>[
                        this.surface
                    ]

                } as any

            );

    }





    /**
     * Yüz geçerli mi
     */
    isValid():boolean {


        return (

            this.surface !== undefined

            &&

            this.outerLoop.isValid()

        );

    }





    /**
     * Nokta yüz üzerinde mi
     */
    containsPoint(
        point
    ):boolean {


        return this.surface
            .containsPoint(
                point
            );

    }





    /**
     * Clone
     */
    clone():BRepFace {


        const face =
            new BRepFace(

                this.surface.clone(),

                this.outerLoop.clone()

            );



        face.innerLoops =
            this.innerLoops.map(

                loop =>
                    loop.clone()

            );



        face.reversed =
            this.reversed;



        face.metadata =
            {
                ...this.metadata
            };



        return face;

    }





    /**
     * JSON export
     */
    toJSON(){


        return {

            id:
                this.id,


            outerLoop:
                this.outerLoop.id,


            innerLoops:
                this.innerLoops.map(

                    l =>
                        l.id

                ),


            reversed:
                this.reversed

        };

    }





    toString():string {


        return (

            `BRepFace(` +

            `Loops:${this.loopCount()}, ` +

            `Reversed:${this.reversed}` +

            `)`

        );

    }

}