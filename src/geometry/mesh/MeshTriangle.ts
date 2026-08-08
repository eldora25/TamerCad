import { MeshVertex } from "./MeshVertex";

export class MeshTriangle {

    /**
     * Triangle id
     */
    public readonly id: number;

    /**
     * Vertex indices
     */
    public v1: number;

    public v2: number;

    public v3: number;

    /**
     * Face normal index
     */
    public normalIndex: number | null = null;

    /**
     * Material index
     */
    public materialIndex: number | null = null;

    constructor(

        id: number,

        v1: number,

        v2: number,

        v3: number

    ) {

        this.id = id;

        this.v1 = v1;

        this.v2 = v2;

        this.v3 = v3;

    }

    getVertexIndices(): number[] {

        return [

            this.v1,

            this.v2,

            this.v3

        ];

    }

    containsVertex(

        vertexIndex: number

    ): boolean {

        return (

            this.v1 === vertexIndex ||

            this.v2 === vertexIndex ||

            this.v3 === vertexIndex

        );

    }

    replaceVertex(

        oldIndex: number,

        newIndex: number

    ): void {

        if (

            this.v1 === oldIndex

        ) {

            this.v1 = newIndex;

        }

        if (

            this.v2 === oldIndex

        ) {

            this.v2 = newIndex;

        }

        if (

            this.v3 === oldIndex

        ) {

            this.v3 = newIndex;

        }

    }

    reverse(): void {

        const tmp = this.v2;

        this.v2 = this.v3;

        this.v3 = tmp;

    }

    isDegenerate(): boolean {

        return (

            this.v1 === this.v2 ||

            this.v2 === this.v3 ||

            this.v3 === this.v1

        );

    }

    clone(): MeshTriangle {

        const t =

            new MeshTriangle(

                this.id,

                this.v1,

                this.v2,

                this.v3

            );

        t.normalIndex =

            this.normalIndex;

        t.materialIndex =

            this.materialIndex;

        return t;

    }

    computeArea(

        vertices: MeshVertex[]

    ): number {

        const a =

            vertices[this.v1].position;

        const b =

            vertices[this.v2].position;

        const c =

            vertices[this.v3].position;

        const abx =

            b.x - a.x;

        const aby =

            b.y - a.y;

        const abz =

            b.z - a.z;

        const acx =

            c.x - a.x;

        const acy =

            c.y - a.y;

        const acz =

            c.z - a.z;

        const cx =

            aby * acz -

            abz * acy;

        const cy =

            abz * acx -

            abx * acz;

        const cz =

            abx * acy -

            aby * acx;

        return (

            0.5 *

            Math.sqrt(

                cx * cx +

                cy * cy +

                cz * cz

            )

        );

    }

    toJSON() {

        return {

            id: this.id,

            vertices: [

                this.v1,

                this.v2,

                this.v3

            ],

            normalIndex:

                this.normalIndex,

            materialIndex:

                this.materialIndex

        };

    }

    static fromJSON(

        data: any

    ): MeshTriangle {

        const t =

            new MeshTriangle(

                data.id,

                data.vertices[0],

                data.vertices[1],

                data.vertices[2]

            );

        t.normalIndex =

            data.normalIndex ?? null;

        t.materialIndex =

            data.materialIndex ?? null;

        return t;

    }

}