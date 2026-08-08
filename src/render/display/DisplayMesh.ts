import { Mesh } from "../../geometry/mesh/Mesh";
import { MeshTriangle } from "../../geometry/mesh/MeshTriangle";
import { MeshVertex } from "../../geometry/mesh/MeshVertex";

export class DisplayMesh {

    public readonly mesh: Mesh;

    /**
     * GPU vertex buffer
     * xyz xyz xyz ...
     */
    public vertexBuffer:
        Float32Array =
        new Float32Array();

    /**
     * GPU normal buffer
     */
    public normalBuffer:
        Float32Array =
        new Float32Array();

    /**
     * GPU uv buffer
     */
    public uvBuffer:
        Float32Array =
        new Float32Array();

    /**
     * GPU index buffer
     */
    public indexBuffer:
        Uint32Array =
        new Uint32Array();

    constructor(

        mesh: Mesh

    ) {

        this.mesh = mesh;

        this.rebuild();

    }

    rebuild(): void {

        this.buildVertexBuffer();

        this.buildIndexBuffer();

    }

    getVertexCount(): number {

        return this.mesh.vertexCount();

    }

    getTriangleCount(): number {

        return this.mesh.triangleCount();

    }

    private buildVertexBuffer(): void {

        const vertices =
            this.mesh.getVertices();

        const buffer =
            new Float32Array(

                vertices.length * 3

            );

        let offset = 0;

        for (

            const vertex of

            vertices

        ) {

            buffer[offset++] =
                vertex.position.x;

            buffer[offset++] =
                vertex.position.y;

            buffer[offset++] =
                vertex.position.z;

        }

        this.vertexBuffer =
            buffer;

    }

    private buildIndexBuffer(): void {

        const triangles =
            this.mesh.getTriangles();

        const indices =
            new Uint32Array(

                triangles.length * 3

            );

        let offset = 0;

        for (

            const triangle of

            triangles

        ) {

            indices[offset++] =
                triangle.v1;

            indices[offset++] =
                triangle.v2;

            indices[offset++] =
                triangle.v3;

        }

        this.indexBuffer =
            indices;

    }

    computeMemoryUsage(): number {

        return (

            this.vertexBuffer.byteLength +

            this.normalBuffer.byteLength +

            this.uvBuffer.byteLength +

            this.indexBuffer.byteLength

        );

    }

    dispose(): void {

        this.vertexBuffer =
            new Float32Array();

        this.normalBuffer =
            new Float32Array();

        this.uvBuffer =
            new Float32Array();

        this.indexBuffer =
            new Uint32Array();

    }

}