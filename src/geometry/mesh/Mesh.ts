import { MeshVertex } from "./MeshVertex";
import { MeshTriangle } from "./MeshTriangle";

export class Mesh {

    private readonly vertices: MeshVertex[] = [];

    private readonly triangles: MeshTriangle[] = [];

    constructor(

        public name: string = "Mesh"

    ) {}

    addVertex(

        vertex: MeshVertex

    ): number {

        this.vertices.push(vertex);

        return this.vertices.length - 1;

    }

    addTriangle(

        triangle: MeshTriangle

    ): void {

        this.triangles.push(triangle);

    }

    getVertex(

        index: number

    ): MeshVertex {

        return this.vertices[index];

    }

    getTriangle(

        index: number

    ): MeshTriangle {

        return this.triangles[index];

    }

    getVertices(): readonly MeshVertex[] {

        return this.vertices;

    }

    getTriangles(): readonly MeshTriangle[] {

        return this.triangles;

    }

    vertexCount(): number {

        return this.vertices.length;

    }

    triangleCount(): number {

        return this.triangles.length;

    }

    clear(): void {

        this.vertices.length = 0;

        this.triangles.length = 0;

    }

    isEmpty(): boolean {

        return (

            this.vertices.length === 0 ||

            this.triangles.length === 0

        );

    }

    computeSurfaceArea(): number {

        let area = 0;

        for (

            const triangle of this.triangles

        ) {

            area += triangle.computeArea(

                this.vertices

            );

        }

        return area;

    }

    getBoundingBox() {

        if (

            this.vertices.length === 0

        ) {

            return null;

        }

        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let minZ = Number.POSITIVE_INFINITY;

        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        let maxZ = Number.NEGATIVE_INFINITY;

        for (

            const v of this.vertices

        ) {

            minX = Math.min(

                minX,

                v.position.x

            );

            minY = Math.min(

                minY,

                v.position.y

            );

            minZ = Math.min(

                minZ,

                v.position.z

            );

            maxX = Math.max(

                maxX,

                v.position.x

            );

            maxY = Math.max(

                maxY,

                v.position.y

            );

            maxZ = Math.max(

                maxZ,

                v.position.z

            );

        }

        return {

            min: {

                x: minX,

                y: minY,

                z: minZ

            },

            max: {

                x: maxX,

                y: maxY,

                z: maxZ

            }

        };

    }

    clone(): Mesh {

        const mesh =

            new Mesh(

                this.name

            );

        for (

            const v of this.vertices

        ) {

            mesh.addVertex(

                v.clone()

            );

        }

        for (

            const t of this.triangles

        ) {

            mesh.addTriangle(

                t.clone()

            );

        }

        return mesh;

    }

    toJSON() {

        return {

            name: this.name,

            vertices:

                this.vertices.map(

                    v => v.toJSON()

                ),

            triangles:

                this.triangles.map(

                    t => t.toJSON()

                )

        };

    }

    static fromJSON(

        data: any

    ): Mesh {

        const mesh =

            new Mesh(

                data.name

            );

        for (

            const v of data.vertices

        ) {

            mesh.addVertex(

                MeshVertex.fromJSON(v)

            );

        }

        for (

            const t of data.triangles

        ) {

            mesh.addTriangle(

                MeshTriangle.fromJSON(t)

            );

        }

        return mesh;

    }

}