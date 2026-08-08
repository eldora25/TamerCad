import { Solid3 } from "./Solid3";
import { Point3 } from "../point/Point3";
import { Vector3 } from "../../math/vector/Vector3";
import { PlaneSurface3 } from "../surface/PlaneSurface3";
import { CylinderSurface3 } from "../surface/CylinderSurface3";


export class CylinderSolid3 extends Solid3 {


    public origin:Point3;

    public axis:Vector3;

    public radius:number;

    public height:number;



    constructor(

        origin:Point3,

        radius:number,

        height:number,

        axis:Vector3 = new Vector3(0,0,1)

    ){

        super();


        if(radius <= 0){

            throw new Error(
                "Cylinder radius must be positive"
            );

        }


        if(height <= 0){

            throw new Error(
                "Cylinder height must be positive"
            );

        }



        this.origin =
            origin.clone();


        this.radius =
            radius;


        this.height =
            height;


        this.axis =
            axis.normalize();



        this.createSurfaces();

    }



    /**
     * Cylinder sınır yüzeyleri
     *
     * 1 adet lateral cylinder
     * 2 adet planar cap
     */
    private createSurfaces():void {


        /*
            Side surface
        */

        this.addSurface(

            new CylinderSurface3(

                this.origin,

                this.axis,

                this.radius

            )

        );



        /*
            Bottom cap
        */

        this.addSurface(

            new PlaneSurface3(

                this.origin,

                this.axis
                    .multiply(-1)

            )

        );



        /*
            Top cap
        */

        const topPoint =

            this.origin.add(

                this.axis
                    .multiply(
                        this.height
                    )

            );



        this.addSurface(

            new PlaneSurface3(

                topPoint,

                this.axis

            )

        );

    }



    /**
     * Hacim
     */
    volume():number {


        return (

            Math.PI *
            this.radius *
            this.radius *
            this.height

        );

    }



    /**
     * Kütle merkezi
     */
    centerOfMass():Point3 {


        return this.origin.add(

            this.axis.multiply(

                this.height / 2

            )

        );

    }



    /**
     * Nokta silindir içinde mi?
     */
    containsPoint(
        point:Point3
    ):boolean {


        const relative =
            point.subtract(
                this.origin
            );



        const heightPosition =
            relative.dot(
                this.axis
            );



        if(
            heightPosition < 0 ||
            heightPosition > this.height
        ){

            return false;

        }



        const radialVector =

            relative.subtract(

                this.axis.multiply(
                    heightPosition
                )

            );



        return (

            radialVector.length()
            <=
            this.radius

        );

    }



    /**
     * Yan yüzey alanı
     */
    lateralSurfaceArea():number {


        return (

            2 *
            Math.PI *
            this.radius *
            this.height

        );

    }



    /**
     * Toplam yüzey alanı
     */
    surfaceArea():number {


        return (

            this.lateralSurfaceArea()

            +

            2 *
            Math.PI *
            this.radius *
            this.radius

        );

    }



    /**
     * Boyut güncelleme
     */
    resize(

        radius:number,

        height:number

    ):void {


        if(radius <=0 || height<=0){

            throw new Error(
                "Invalid cylinder dimensions"
            );

        }


        this.radius =
            radius;


        this.height =
            height;



        this.surfaces = [];


        this.createSurfaces();

    }



    type():string {


        return "CylinderSolid3";

    }



    clone():CylinderSolid3 {


        return new CylinderSolid3(

            this.origin.clone(),

            this.radius,

            this.height,

            new Vector3(

                this.axis.x,

                this.axis.y,

                this.axis.z

            )

        );

    }



    toString():string {


        return (

            `CylinderSolid3(` +

            `Radius:${this.radius}, ` +

            `Height:${this.height}` +

            `)`

        );

    }

}