import { STLTriangle }
from "./STLReader";



export class STLAsciiReader {

    read(

        text: string

    ): STLTriangle[] {

        const triangles:

        STLTriangle[] = [];



        const lines =

            text

            .replace(/\r\n/g, "\n")

            .split("\n")

            .map(

                x => x.trim()

            )

            .filter(

                x => x.length > 0

            );



        let normal:

        [number, number, number] =

        [0, 0, 0];



        let vertices:

        [

            [number, number, number],

            [number, number, number],

            [number, number, number]

        ] = [

            [0,0,0],

            [0,0,0],

            [0,0,0]

        ];



        let vertexIndex = 0;



        for (

            const line of lines

        ) {



            if (

                line.startsWith(

                    "facet normal"

                )

            ) {

                const p =

                    line.split(/\s+/);



                normal = [

                    Number(p[2]),

                    Number(p[3]),

                    Number(p[4])

                ];



                vertexIndex = 0;

            }



            else if (

                line.startsWith(

                    "vertex"

                )

            ) {

                const p =

                    line.split(/\s+/);



                vertices[

                    vertexIndex++

                ] = [

                    Number(p[1]),

                    Number(p[2]),

                    Number(p[3])

                ];

            }



            else if (

                line ===

                "endfacet"

            ) {



                triangles.push({

                    normal,

                    vertices: [

                        [...vertices[0]],

                        [...vertices[1]],

                        [...vertices[2]]

                    ]

                });

            }

        }



        return triangles;

    }

}