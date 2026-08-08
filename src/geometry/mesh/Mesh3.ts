import { Point3 } from "../point/Point3";
import { Vector3 } from "../../math/vector/Vector3";


export interface MeshTriangle {


    a:number;

    b:number;

    c:number;

}



export interface MeshFace {


    vertices:number[];

}



export class Mesh3 {


    public vertices:Point3[];


    public triangles:MeshTriangle[];


    public normals:Vector3[];


    public uvs:number[][];



    constructor(){


        this.vertices = [];


        this.triangles = [];


        this.normals = [];


        this.uvs = [];

    }



    /**
     * Vertex ekleme
     */
    addVertex(
        point:Point3
    ):number {


        this.vertices.push(

            point.clone()

        );


        return (
            this.vertices.length - 1
        );

    }



    /**
     * Triangle ekleme
     */
    addTriangle(

        a:number,

        b:number,

        c:number

    ):void {


        this.triangles.push({

            a,

            b,

            c

        });

    }



    /**
     * Normal hesaplama
     */
    computeNormals():void {


        this.normals = [];


        for(
            let i=0;
            i<this.vertices.length;
            i++
        ){

            this.normals.push(

                new Vector3(
                    0,
                    0,
                    0
                )

            );

        }



        for(
            const triangle of this.triangles
        ){


            const p1 =
                this.vertices[
                    triangle.a
                ];


            const p2 =
                this.vertices[
                    triangle.b
                ];


            const p3 =
                this.vertices[
                    triangle.c
                ];



            const edge1 =
                p2.subtract(
                    p1
                );


            const edge2 =
                p3.subtract(
                    p1
                );



            const normal =
                edge1
                .cross(
                    edge2
                )
                .normalize();



            this.normals[
                triangle.a
            ] =
                this.normals[
                    triangle.a
                ]
                .add(normal);



            this.normals[
                triangle.b
            ] =
                this.normals[
                    triangle.b
                ]
                .add(normal);



            this.normals[
                triangle.c
            ] =
                this.normals[
                    triangle.c
                ]
                .add(normal);

        }



        for(
            let i=0;
            i<this.normals.length;
            i++
        ){

            this.normals[i] =
                this.normals[i]
                .normalize();

        }

    }



    /**
     * Mesh yüzey alanı
     */
    area():number {


        let total = 0;



        for(
            const triangle of this.triangles
        ){


            const a =
                this.vertices[
                    triangle.a
                ];


            const b =
                this.vertices[
                    triangle.b
                ];


            const c =
                this.vertices[
                    triangle.c
                ];



            const ab =
                b.subtract(a);



            const ac =
                c.subtract(a);



            total +=

                ab
                .cross(ac)
                .length()
                *
                0.5;

        }



        return total;

    }



    /**
     * Bounding box
     */
    boundingBox(){


        if(
            this.vertices.length === 0
        ){

            return null;

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
            const p of this.vertices
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
     * Mesh temizleme
     */
    clear():void {


        this.vertices = [];

        this.triangles = [];

        this.normals = [];

        this.uvs = [];

    }



    /**
     * Clone
     */
    clone():Mesh3 {


        const mesh =
            new Mesh3();



        for(
            const v of this.vertices
        ){

            mesh.addVertex(
                v
            );

        }



        for(
            const t of this.triangles
        ){

            mesh.addTriangle(

                t.a,

                t.b,

                t.c

            );

        }



        mesh.computeNormals();


        return mesh;

    }



    vertexCount():number {


        return this.vertices.length;

    }



    triangleCount():number {


        return this.triangles.length;

    }



    toString():string {


        return (

            `Mesh3(` +

            `Vertices:${this.vertices.length}, ` +

            `Triangles:${this.triangles.length}` +

            `)`

        );

    }

}