import { MeshBody } from "../geometry/mesh/MeshBody";

export interface RenderObject {

    id: string;

    visible: boolean;

}

export class RenderScene {

    private readonly meshBodies =
        new Map<string, MeshBody>();

    private readonly objects =
        new Map<string, RenderObject>();

    private backgroundColor = {

        r: 0.15,

        g: 0.15,

        b: 0.18,

        a: 1.0

    };

    constructor() {}

    // ----------------------------------------------------
    // Mesh Bodies
    // ----------------------------------------------------

    addMeshBody(

        body: MeshBody

    ): void {

        this.meshBodies.set(

            body.id,

            body

        );

    }

    removeMeshBody(

        id: string

    ): boolean {

        return this.meshBodies.delete(

            id

        );

    }

    getMeshBody(

        id: string

    ): MeshBody | undefined {

        return this.meshBodies.get(

            id

        );

    }

    getMeshBodies():

    readonly MeshBody[] {

        return Array.from(

            this.meshBodies.values()

        );

    }

    clearMeshBodies(): void {

        this.meshBodies.clear();

    }

    // ----------------------------------------------------
    // Generic Render Objects
    // ----------------------------------------------------

    addObject(

        object: RenderObject

    ): void {

        this.objects.set(

            object.id,

            object

        );

    }

    removeObject(

        id: string

    ): boolean {

        return this.objects.delete(

            id

        );

    }

    getObjects():

    readonly RenderObject[] {

        return Array.from(

            this.objects.values()

        );

    }

    clearObjects(): void {

        this.objects.clear();

    }

    // ----------------------------------------------------
    // Scene
    // ----------------------------------------------------

    clear(): void {

        this.meshBodies.clear();

        this.objects.clear();

    }

    isEmpty(): boolean {

        return (

            this.meshBodies.size === 0 &&

            this.objects.size === 0

        );

    }

    // ----------------------------------------------------
    // Background
    // ----------------------------------------------------

    setBackgroundColor(

        r: number,

        g: number,

        b: number,

        a = 1.0

    ): void {

        this.backgroundColor = {

            r,

            g,

            b,

            a

        };

    }

    getBackgroundColor() {

        return {

            ...this.backgroundColor

        };

    }

    // ----------------------------------------------------
    // Statistics
    // ----------------------------------------------------

    getStatistics() {

        let vertices = 0;

        let triangles = 0;

        for (

            const body of

            this.meshBodies.values()

        ) {

            vertices +=

                body.getVertexCount();

            triangles +=

                body.getTriangleCount();

        }

        return {

            meshBodies:

                this.meshBodies.size,

            renderObjects:

                this.objects.size,

            vertices,

            triangles

        };

    }

}