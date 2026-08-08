import { Surface3 } from "../surface/Surface3";
import { Point3 } from "../point/Point3";


export abstract class Solid3 {


    public id:string;


    /**
     * Katı sınır yüzeyleri
     */
    public surfaces:Surface3[];



    constructor(){

        this.id =
            crypto.randomUUID();


        this.surfaces = [];

    }



    /**
     * Solid üzerindeki yüzeyleri döndürür
     */
    getSurfaces():Surface3[] {


        return [
            ...this.surfaces
        ];

    }



    /**
     * Yüzey ekleme
     */
    addSurface(
        surface:Surface3
    ):void {


        this.surfaces.push(
            surface
        );

    }



    /**
     * Yaklaşık bounding box
     */
    boundingBox(){


        const points:Point3[] = [];


        for(
            const surface of this.surfaces
        ){

            points.push(
                ...surface.sample(
                    10,
                    10
                )
            );

        }



        if(points.length === 0){

            return {

                min:
                    Point3.origin(),


                max:
                    Point3.origin()

            };

        }



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
     * Hacim
     *
     * Alt sınıflar override eder.
     */
    abstract volume():number;



    /**
     * Kütle merkezi
     */
    abstract centerOfMass():Point3;



    /**
     * Katı doğrulama
     */
    isValid():boolean {


        return (
            this.surfaces.length > 0
        );

    }



    /**
     * Nokta katı içinde mi?
     */
    abstract containsPoint(
        point:Point3
    ):boolean;



    /**
     * Solid tipi
     */
    abstract type():string;



    /**
     * Kopyalama
     */
    clone():Solid3 {


        throw new Error(
            "Clone implementation required"
        );

    }



    toString():string {


        return (

            `Solid3(` +

            `Surfaces:${this.surfaces.length}` +

            `)`

        );

    }

}