import { Solid3 } from "../solid/Solid3";
import { Surface3 } from "../surface/Surface3";
import { Mesh3 } from "./Mesh3";
import { Point3 } from "../point/Point3";


export interface TessellationOptions {


    uSegments:number;


    vSegments:number;


}



export class Tessellator3 {



    public options:TessellationOptions;



    constructor(

        options:TessellationOptions = {

            uSegments:20,

            vSegments:20

        }

    ){

        this.options =
            options;

    }



    /**
     * Solid → Mesh dönüşümü
     */
    tessellateSolid(
        solid:Solid3
    ):Mesh3 {


        const mesh =
            new Mesh3();



        for(
            const surface of solid.getSurfaces()
        ){

            this.tessellateSurface(

                surface,

                mesh

            );

        }



        mesh.computeNormals();


        return mesh;

    }





    /**
     * Surface → Triangle Mesh
     */
    tessellateSurface(

        surface:Surface3,

        mesh:Mesh3

    ):void {



        const vertexGrid:number[][] = [];



        for(
            let i=0;
            i<=this.options.uSegments;
            i++
        ){


            vertexGrid[i] = [];



            const u =
                i /
                this.options.uSegments;



            for(
                let j=0;
                j<=this.options.vSegments;
                j++
            ){



                const v =
                    j /
                    this.options.vSegments;



                const point =
                    surface.evaluate(
                        u,
                        v
                    );



                const index =
                    mesh.addVertex(
                        point
                    );



                vertexGrid[i][j] =
                    index;

            }

        }





        /*
            Grid triangle oluşturma
        */


        for(
            let i=0;
            i<this.options.uSegments;
            i++
        ){


            for(
                let j=0;
                j<this.options.vSegments;
                j++
            ){


                const a =
                    vertexGrid[i][j];


                const b =
                    vertexGrid[i+1][j];


                const c =
                    vertexGrid[i+1][j+1];


                const d =
                    vertexGrid[i][j+1];



                mesh.addTriangle(

                    a,

                    b,

                    c

                );



                mesh.addTriangle(

                    a,

                    c,

                    d

                );

            }

        }

    }




    /**
     * Kalite artırma
     */
    refine(
        level:number
    ):void {


        this.options.uSegments *=
            level;


        this.options.vSegments *=
            level;

    }



    /**
     * Hızlı düşük çözünürlük mesh
     */
    static preview(
        solid:Solid3
    ):Mesh3 {


        const tessellator =
            new Tessellator3({

                uSegments:8,

                vSegments:8

            });



        return tessellator
            .tessellateSolid(
                solid
            );

    }



    /**
     * Yüksek kalite üretim mesh
     */
    static production(
        solid:Solid3
    ):Mesh3 {


        const tessellator =
            new Tessellator3({

                uSegments:64,

                vSegments:64

            });



        return tessellator
            .tessellateSolid(
                solid
            );

    }



    /**
     * STL için optimize edilmiş mesh
     */
    static stl(
        solid:Solid3
    ):Mesh3 {


        const tessellator =
            new Tessellator3({

                uSegments:48,

                vSegments:48

            });



        return tessellator
            .tessellateSolid(
                solid
            );

    }


}