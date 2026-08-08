import { BRepShell } from "./BRepShell";
import { Mesh3 } from "../mesh/Mesh3";



export class BRepSolid {


    public id:string;



    /**
     * Solid shell listesi
     */
    public shells:BRepShell[];



    /**
     * Metadata
     */
    public metadata:
    Record<string, any>;



    constructor(){


        this.id =
            crypto.randomUUID();



        this.shells =
            [];



        this.metadata =
            {};

    }





    /**
     * Shell ekleme
     */
    addShell(
        shell:BRepShell
    ):void {


        this.shells.push(
            shell
        );

    }





    /**
     * Shell kaldırma
     */
    removeShell(
        shellId:string
    ):void {


        this.shells =
            this.shells.filter(

                s =>
                    s.id !== shellId

            );

    }





    /**
     * Dış shell alma
     */
    outerShell():BRepShell | null {


        for(
            const shell of this.shells
        ){

            if(
                !shell.inner
            ){

                return shell;

            }

        }


        return null;

    }





    /**
     * İç boşluk shellleri
     */
    innerShells():BRepShell[] {


        return this.shells.filter(

            s =>
                s.inner

        );

    }





    /**
     * Shell sayısı
     */
    shellCount():number {


        return this.shells.length;

    }





    /**
     * Solid kapalı mı?
     */
    isClosed():boolean {


        const outer =
            this.outerShell();



        if(
            outer === null
        ){

            return false;

        }



        return outer.isClosed();

    }





    /**
     * Solid geçerli mi?
     */
    isValid():boolean {


        if(
            this.shells.length === 0
        ){

            return false;

        }



        for(
            const shell of this.shells
        ){

            if(
                !shell.isValid()
            ){

                return false;

            }

        }



        return true;

    }





    /**
     * Mesh oluşturma
     */
    tessellate():Mesh3 {


        const mesh =
            new Mesh3();



        for(
            const shell of this.shells
        ){

            const shellMesh =
                shell.tessellate();



            for(
                const vertex of shellMesh.vertices
            ){

                mesh.addVertex(
                    vertex
                );

            }



            for(
                const triangle of shellMesh.triangles
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
    surfaceArea():number {


        let area = 0;



        for(
            const shell of this.shells
        ){

            area +=
                shell.area();

        }



        return area;

    }





    /**
     * Hacim
     *
     * Mesh tabanlı yaklaşık hesap
     */
    volume():number {


        const mesh =
            this.tessellate();



        let volume = 0;



        for(
            const triangle of mesh.triangles
        ){


            const a =
                mesh.vertices[
                    triangle.a
                ];


            const b =
                mesh.vertices[
                    triangle.b
                ];


            const c =
                mesh.vertices[
                    triangle.c
                ];



            volume +=

                a.dot(

                    b.cross(c)

                )
                /
                6;

        }



        return Math.abs(volume);

    }





    /**
     * Clone
     */
    clone():BRepSolid {


        const solid =
            new BRepSolid();



        solid.shells =
            this.shells.map(

                shell =>
                    shell.clone()

            );



        solid.metadata =
            {
                ...this.metadata
            };



        return solid;

    }





    /**
     * Boolean operasyon hazırlığı
     */
    booleanReady():boolean {


        return (

            this.isValid()

            &&

            this.isClosed()

        );

    }





    /**
     * JSON export
     */
    toJSON(){


        return {


            id:
                this.id,


            shells:
                this.shells.map(

                    s =>
                        s.id

                )


        };

    }





    toString():string {


        return (

            `BRepSolid(` +

            `Shells:${this.shellCount()}` +

            `)`

        );

    }

}