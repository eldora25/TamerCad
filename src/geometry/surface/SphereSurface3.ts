import { Surface3 } from "./Surface3";
import { Point3 } from "../point/Point3";
import { Vector3 } from "../../math/vector/Vector3";


export class SphereSurface3 extends Surface3 {


    public center:Point3;

    public radius:number;



    constructor(
        center:Point3,
        radius:number
    ){

        super();


        if(radius <= 0){

            throw new Error(
                "Sphere radius must be positive"
            );

        }


        this.center =
            center.clone();


        this.radius =
            radius;

    }



    /**
     * Sphere parametrik yüzeyi
     *
     * u : longitude 0-1
     * v : latitude 0-1
     */
    evaluate(
        u:number,
        v:number
    ):Point3 {


        const theta =
            2 *
            Math.PI *
            u;


        const phi =
            Math.PI *
            (v - 0.5);



        const x =
            this.radius *
            Math.cos(phi) *
            Math.cos(theta);



        const y =
            this.radius *
            Math.cos(phi) *
            Math.sin(theta);



        const z =
            this.radius *
            Math.sin(phi);



        return new Point3(

            this.center.x + x,

            this.center.y + y,

            this.center.z + z

        );

    }



    /**
     * Başlangıç noktası
     */
    startPoint():Point3 {


        return this.evaluate(
            0,
            0.5
        );

    }



    /**
     * Küre normal vektörü
     */
    normal(
        u:number,
        v:number
    ):Vector3 {


        return this.evaluate(
            u,
            v
        )
        .subtract(
            this.center
        )
        .normalize();

    }



    /**
     * Noktanın küre üzerinde olup olmadığı
     */
    containsPoint(
        point:Point3,
        tolerance:number = 0.000001
    ):boolean {


        const distance =
            this.center
                .distanceTo(
                    point
                );



        return Math.abs(

            distance -
            this.radius

        )
        < tolerance;

    }



    /**
     * Küre yüzey alanı
     */
    surfaceArea():number {


        return (
            4 *
            Math.PI *
            this.radius *
            this.radius
        );

    }



    /**
     * Küre hacmi
     */
    volume():number {


        return (

            4 *
            Math.PI *
            Math.pow(
                this.radius,
                3
            )
            /
            3

        );

    }



    /**
     * Yarıçap değiştirme
     */
    setRadius(
        radius:number
    ):void {


        if(radius <= 0){

            throw new Error(
                "Sphere radius must be positive"
            );

        }


        this.radius =
            radius;

    }



    type():string {


        return "SphereSurface3";

    }



    clone():SphereSurface3 {


        return new SphereSurface3(

            this.center.clone(),

            this.radius

        );

    }



    toString():string {


        return (

            `SphereSurface3(` +

            `Center:${this.center.toString()}, ` +

            `Radius:${this.radius}` +

            `)`

        );

    }

}