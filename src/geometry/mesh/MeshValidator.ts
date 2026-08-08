import { Mesh } from "./Mesh";
import { MeshTriangle } from "./MeshTriangle";

export interface MeshValidationIssue {

    type:

        | "EMPTY_MESH"

        | "DEGENERATE_TRIANGLE"

        | "INVALID_VERTEX_INDEX"

        | "DUPLICATE_TRIANGLE"

        | "NON_MANIFOLD_EDGE"

        | "OPEN_EDGE";

    message: string;

    triangleId?: number;

}

export interface MeshValidationResult {

    valid: boolean;

    issues: MeshValidationIssue[];

}

export class MeshValidator {

    validate(

        mesh: Mesh

    ): MeshValidationResult {

        const issues: MeshValidationIssue[] = [];



        if (

            mesh.vertexCount() === 0 ||

            mesh.triangleCount() === 0

        ) {

            issues.push({

                type: "EMPTY_MESH",

                message: "Mesh contains no geometry."

            });

        }



        this.validateTriangles(

            mesh,

            issues

        );



        this.validateEdges(

            mesh,

            issues

        );



        return {

            valid:

                issues.length === 0,

            issues

        };

    }







    private validateTriangles(

        mesh: Mesh,

        issues: MeshValidationIssue[]

    ): void {

        const triangleSet =

            new Set<string>();



        for (

            const triangle of

            mesh.getTriangles()

        ) {

            if (

                triangle.isDegenerate()

            ) {

                issues.push({

                    type:

                        "DEGENERATE_TRIANGLE",

                    triangleId:

                        triangle.id,

                    message:

                        `Triangle ${triangle.id} is degenerate.`

                });

            }



            for (

                const index of

                triangle.getVertexIndices()

            ) {

                if (

                    index < 0 ||

                    index >=

                    mesh.vertexCount()

                ) {

                    issues.push({

                        type:

                            "INVALID_VERTEX_INDEX",

                        triangleId:

                            triangle.id,

                        message:

                            `Triangle ${triangle.id} references invalid vertex ${index}.`

                    });

                }

            }



            const key =

                [...triangle

                    .getVertexIndices()]

                    .sort(

                        (a,b)=>a-b

                    )

                    .join("_");



            if (

                triangleSet.has(

                    key

                )

            ) {

                issues.push({

                    type:

                        "DUPLICATE_TRIANGLE",

                    triangleId:

                        triangle.id,

                    message:

                        `Duplicate triangle detected.`

                });

            }

            else {

                triangleSet.add(

                    key

                );

            }

        }

    }







    private validateEdges(

        mesh: Mesh,

        issues: MeshValidationIssue[]

    ): void {

        const edgeMap =

            new Map<string, number>();



        for (

            const triangle of

            mesh.getTriangles()

        ) {

            const v =

                triangle.getVertexIndices();



            this.addEdge(

                v[0],

                v[1],

                edgeMap

            );



            this.addEdge(

                v[1],

                v[2],

                edgeMap

            );



            this.addEdge(

                v[2],

                v[0],

                edgeMap

            );

        }



        for (

            const [

                edge,

                count

            ] of edgeMap

        ) {

            if (

                count === 1

            ) {

                issues.push({

                    type:

                        "OPEN_EDGE",

                    message:

                        `Open edge ${edge}`

                });

            }



            if (

                count > 2

            ) {

                issues.push({

                    type:

                        "NON_MANIFOLD_EDGE",

                    message:

                        `Non-manifold edge ${edge}`

                });

            }

        }

    }







    private addEdge(

        a:number,

        b:number,

        map:

        Map<string,number>

    ): void {

        const key =

            a < b

                ? `${a}_${b}`

                : `${b}_${a}`;



        map.set(

            key,

            (

                map.get(key)

                ?? 0

            ) + 1

        );

    }

}