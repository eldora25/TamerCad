import { Point3 } from "../point/Point3";
import { Vector3 } from "../../math/vector/Vector3";


export abstract class Curve3 {


    public id:string;



    constructor(){

        this.id =
            crypto.randomUUID();

    }



    /**
     * Curve üzerindeki noktayı parametre ile döndürür.
     *
     * t:
     * 0 -> başlangıç
     * 1 -> bitiş
     */
    abstract evaluate(
        t:number
    ):Point3;



    /**
     * Başlangıç noktası
     */
    abstract startPoint():Point3;



    /**
     * Bitiş noktası
     */
    abstract endPoint():Point3;



    /**
     * Eğri uzunluğu
     */
    abstract length():number;



    /**
     * Teğet vektörü
     */
    tangent(
        t:number
    ):Vector3 {


        const delta =
            0.000001;



        const p1 =
            this.evaluate(
                Math.max(
                    0,
                    t - delta
                )
            );



        const p2 =
            this.evaluate(
                Math.min(
                    1,
                    t + delta
                )
            );



        return p2
            .subtract(p1)
            .normalize();

    }



    /**
     * Eğri üzerindeki örnekleme
     */
    sample(
        segments:number = 32
    ):Point3[] {


        const points:Point3[] = [];



        for(
            let i=0;
            i<=segments;
            i++
        ){

            const t =
                i / segments;


            points.push(
                this.evaluate(t)
            );

        }


        return points;

    }



    /**
     * Bounding box hesabı
     */
    boundingBox(){


        const points =
            this.sample();



        let minX =
            Infinity;

        let minY =
            Infinity;

        let minZ =
            Infinity;



        let maxX =
            -Infinity;

        let maxY =
            -Infinity;

        let maxZ =
            -Infinity;



        for(
            const p of points
        ){

            minX =
                Math.min(
                    minX,
                    p.x
                );


            minY =
                Math.min(
                    minY,
                    p.y
                );


            minZ =
                Math.min(
                    minZ,
                    p.z
                );



            maxX =
                Math.max(
                    maxX,
                    p.x
                );


            maxY =
                Math.max(
                    maxY,
                    p.y
                );


            maxZ =
                Math.max(
                    maxZ,
                    p.z
                );

        }



        return {

            min:
                new Point3(
                    minX,
                    minY,
                    minZ
                ),


            max:
                new Point3(
                    maxX,
                    maxY,
                    maxZ
                )

        };

    }



    /**
     * Eğriyi ters çevirir
     */
    abstract reverse():Curve3;



    clone():Curve3 {

        throw new Error(
            "Clone implementation required"
        );

    }


}