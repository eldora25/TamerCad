import { Point3 } from "../primitives/Point3";
import { Mesh } from "./Mesh";
import { MeshTriangle } from "./MeshTriangle";
import { MeshVertex } from "./MeshVertex";

export interface TriangleInput {

    vertices: [

        [number, number, number],

        [number, number, number],

        [number, number, number]

    ];

    normal?: [number, number, number];

}

export interface MeshBuildOptions {

    /**
     * Aynı koordinattaki vertexleri birleştir.
     */
    weldVertices?: boolean;

    /**
     * Karşılaştırma toleransı.
     */
    tolerance?: number;

}

export class MeshBuilder {

    build(

        triangles: TriangleInput[],

        options: MeshBuildOptions = {}

    ): Mesh {

        const mesh = new Mesh();

        const weld = options.weldVertices ?? true;
        const tolerance = options.tolerance ?? 1e-9;

        const vertexMap = new Map<string, number>();

        let vertexId = 0;
        let triangleId = 0;

        for (const triangle of triangles) {

            const indices: number[] = [];

            for (const p of triangle.vertices) {

                const key = weld
                    ? this.makeKey(
                        p[0],
                        p[1],
                        p[2],
                        tolerance
                    )
                    : `${vertexId}`;

                let index = vertexMap.get(key);

                if (index === undefined) {

                    index = mesh.addVertex(

                        new MeshVertex(

                            vertexId++,

                            new Point3(

                                p[0],

                                p[1],

                                p[2]

                            )

                        )

                    );

                    vertexMap.set(

                        key,

                        index

                    );

                }

                indices.push(index);

            }

            const face = new MeshTriangle(

                triangleId++,

                indices[0],

                indices[1],

                indices[2]

            );

            mesh.addTriangle(face);

        }

        return mesh;

    }

    private makeKey(

        x: number,

        y: number,

        z: number,

        tolerance: number

    ): string {

        const rx = Math.round(x / tolerance);
        const ry = Math.round(y / tolerance);
        const rz = Math.round(z / tolerance);

        return `${rx}:${ry}:${rz}`;

    }

}