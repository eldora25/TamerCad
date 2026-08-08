import { Solid3 } from "./Solid3";
import { Point3 } from "../point/Point3";
import { SphereSurface3 } from "../surface/SphereSurface3";


export class SphereSolid3 extends Solid3 {


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



        this.createSurface();

    }



    /**
     * Küre sınır yüzeyi
     */
    private createSurface():void {


        this.addSurface(

            new SphereSurface3(

                this.center,

                this.radius

            )

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
     * Kütle merkezi
     */
    centerOfMass():Point3 {


        return this.center.clone();

    }



    /**
     * Nokta küre içinde mi?
     */
    containsPoint(
        point:Point3
    ):boolean {


        return (

            this.center
                .distanceTo(
                    point
                )
            <=
            this.radius

        );

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
     * Çap
     */
    diameter():number {


        return (

            this.radius * 2

        );

    }



    /**
     * Yarıçap değiştirme
     */
    resize(
        radius:number
    ):void {


        if(radius <= 0){

            throw new Error(
                "Sphere radius must be positive"
            );

        }



        this.radius =
            radius;


        this.surfaces = [];


        this.createSurface();

    }



    type():string {


        return "SphereSolid3";

    }



    clone():SphereSolid3 {


        return new SphereSolid3(

            this.center.clone(),

            this.radius

        );

    }



    toString():string {


        return (

            `SphereSolid3(` +

            `Center:${this.center.toString()}, ` +

            `Radius:${this.radius}` +

            `)`

        );

    }

}