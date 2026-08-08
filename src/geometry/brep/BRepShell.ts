import { BRepFace } from "./BRepFace";
import { Mesh3 } from "../mesh/Mesh3";
import { Tessellator3 } from "../mesh/Tessellator3";



export class BRepShell {


    public id:string;



    /**
     * Shell yüzleri
     */
    public faces:BRepFace[];



    /**
     * İç shell mi?
     */
    public inner:boolean;



    /**
     * Metadata
     */
    public metadata:
    Record<string, any>;



    constructor(

        inner:boolean = false

    ){

        this.id =
            crypto.randomUUID();



        this.faces =
            [];



        this.inner =
            inner;



        this.metadata =
            {};

    }





    /**
     * Face ekleme
     */
    addFace(
        face:BRepFace
    ):void {


        this.faces.push(
            face
        );

    }





    /**
     * Face kaldırma
     */
    removeFace(
        faceId:string
    ):void {


        this.faces =
            this.faces.filter(

                f =>
                    f.id !== faceId

            );

    }





    /**
     * Face sayısı
     */
    faceCount():number {


        return this.faces.length;

    }





    /**
     * Kapalı shell kontrolü
     *
     * Basitleştirilmiş topoloji kontrolü
     */
    isClosed():boolean {


        if(
            this.faces.length === 0
        ){

            return false;

        }



        for(
            const face of this.faces
        ){

            if(
                !face.isValid()
            ){

                return false;

            }

        }



        return true;

    }





    /**
     * Shell mesh üretimi
     */
    tessellate():Mesh3 {


        const mesh =
            new Mesh3();



        for(
            const face of this.faces
        ){


            const faceMesh =
                face.tessellate();



            for(
                const vertex of faceMesh.vertices
            ){

                mesh.addVertex(
                    vertex
                );

            }



            for(
                const triangle of faceMesh.triangles
            ){

                mesh.addTriangle(

                    triangle.a,

                    triangle.b,

                    triangle.c

                );

            }

        }



        mesh.computeNormals();


        return mesh;

    }





    /**
     * Yaklaşık yüzey alanı
     */
    area():number {


        let total = 0;



        for(
            const face of this.faces
        ){

            total +=
                face.area();

        }



        return total;

    }





    /**
     * Shell yön tersleme
     */
    reverse():void {


        for(
            const face of this.faces
        ){

            face.reverse();

        }

    }





    /**
     * Geçerlilik kontrolü
     */
    isValid():boolean {


        return (

            this.faces.length > 0

        );

    }





    /**
     * Clone
     */
    clone():BRepShell {


        const shell =
            new BRepShell(
                this.inner
            );



        shell.faces =
            this.faces.map(

                face =>
                    face.clone()

            );



        shell.metadata =
            {
                ...this.metadata
            };



        return shell;

    }





    toJSON(){

        return {

            id:
                this.id,


            faces:
                this.faces.map(

                    f =>
                        f.id

                ),


            inner:
                this.inner

        };

    }





    toString():string {


        return (

            `BRepShell(` +

            `Faces:${this.faces.length}, ` +

            `Inner:${this.inner}` +

            `)`

        );

    }

}