import { Point3 } from "../point/Point3";
import { Vector3 } from "../../math/vector/Vector3";


export abstract class Surface3 {


    public id:string;



    constructor(){

        this.id =
            crypto.randomUUID();

    }



    /**
     * Parametric surface evaluation
     *
     * u,v:
     * Surface parametreleri
     */
    abstract evaluate(
        u:number,
        v:number
    ):Point3;



    /**
     * Surface normal hesaplama
     */
    normal(
        u:number,
        v:number
    ):Vector3 {


        const delta =
            0.000001;



        const p =
            this.evaluate(
                u,
                v
            );



        const pu =
            this.evaluate(
                u + delta,
                v
            )
            .subtract(p);



        const pv =
            this.evaluate(
                u,
                v + delta
            )
            .subtract(p);



        return pu
            .cross(pv)
            .normalize();

    }



    /**
     * Surface üzerinde nokta örnekleme
     */
    sample(
        uSegments:number = 20,
        vSegments:number = 20
    ):Point3[] {


        const points:Point3[] = [];



        for(
            let i=0;
            i<=uSegments;
            i++
        ){


            const u =
                i / uSegments;



            for(
                let j=0;
                j<=vSegments;
                j++
            ){


                const v =
                    j / vSegments;



                points.push(

                    this.evaluate(
                        u,
                        v
                    )

                );

            }

        }



        return points;

    }



    /**
     * Bounding box
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
     * Surface alanı yaklaşık hesabı
     */
    area(
        uSegments:number = 50,
        vSegments:number = 50
    ):number {


        let total = 0;



        for(
            let i=0;
            i<uSegments;
            i++
        ){


            for(
                let j=0;
                j<vSegments;
                j++
            ){


                const u1 =
                    i / uSegments;


                const v1 =
                    j / vSegments;


                const u2 =
                    (i+1) / uSegments;


                const v2 =
                    (j+1) / vSegments;



                const p1 =
                    this.evaluate(
                        u1,
                        v1
                    );


                const p2 =
                    this.evaluate(
                        u2,
                        v1
                    );


                const p3 =
                    this.evaluate(
                        u1,
                        v2
                    );



                const a =
                    p2.subtract(p1);



                const b =
                    p3.subtract(p1);



                total +=
                    a.cross(b)
                     .length()
                     * 0.5;

            }

        }



        return total;

    }



    /**
     * Surface tipi
     */
    abstract type():string;



    clone():Surface3 {


        throw new Error(
            "Clone implementation required"
        );

    }


}