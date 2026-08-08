import { MeshBody } from "../../geometry/mesh/MeshBody";
import { MeshTriangle } from "../../geometry/mesh/MeshTriangle";

export interface STLBinaryWriteOptions {

    solidName?: string;

}

export class STLBinaryWriter {

    write(

        body: MeshBody,

        _options: STLBinaryWriteOptions = {}

    ): ArrayBuffer {

        const mesh = body.mesh;

        const triangleCount =

            mesh.triangleCount();

        const bufferSize =

            80 +

            4 +

            triangleCount * 50;

        const buffer =

            new ArrayBuffer(

                bufferSize

            );

        const view =

            new DataView(

                buffer

            );

        let offset = 80;

        view.setUint32(

            offset,

            triangleCount,

            true

        );

        offset += 4;

        for (

            const triangle of

            mesh.getTriangles()

        ) {

            const normal =

                this.computeNormal(

                    mesh,

                    triangle

                );

            view.setFloat32(offset, normal[0], true);
            view.setFloat32(offset + 4, normal[1], true);
            view.setFloat32(offset + 8, normal[2], true);

            offset += 12;

            for (

                const index of

                triangle.getVertexIndices()

            ) {

                const vertex =

                    mesh.getVertex(

                        index

                    ).position;

                view.setFloat32(offset, vertex.x, true);
                view.setFloat32(offset + 4, vertex.y, true);
                view.setFloat32(offset + 8, vertex.z, true);

                offset += 12;

            }

            view.setUint16(

                offset,

                0,

                true

            );

            offset += 2;

        }

        return buffer;

    }

    private computeNormal(

        mesh: MeshBody["mesh"],

        triangle: MeshTriangle

    ): [number, number, number] {

        const ids =

            triangle.getVertexIndices();

        const p0 =

            mesh.getVertex(ids[0]).position;

        const p1 =

            mesh.getVertex(ids[1]).position;

        const p2 =

            mesh.getVertex(ids[2]).position;

        const ux =

            p1.x - p0.x;

        const uy =

            p1.y - p0.y;

        const uz =

            p1.z - p0.z;

        const vx =

            p2.x - p0.x;

        const vy =

            p2.y - p0.y;

        const vz =

            p2.z - p0.z;

        let nx =

            uy * vz -

            uz * vy;

        let ny =

            uz * vx -

            ux * vz;

        let nz =

            ux * vy -

            uy * vx;

        const length =

            Math.sqrt(

                nx * nx +

                ny * ny +

                nz * nz

            );

        if (

            length > 0

        ) {

            nx /= length;

            ny /= length;

            nz /= length;

        }

        return [

            nx,

            ny,

            nz

        ];

    }

}