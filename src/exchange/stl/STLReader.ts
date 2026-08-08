import { Document }
from "../../persistence/core/Document";

import { STLAsciiReader }
from "./STLAsciiReader";

import { STLBinaryReader }
from "./STLBinaryReader";

import { STLMeshConverter }
from "./STLMeshConverter";



export interface STLTriangle {

    normal: [number, number, number];

    vertices: [

        [number, number, number],

        [number, number, number],

        [number, number, number]

    ];

}



export class STLReader {

    private readonly asciiReader =

        new STLAsciiReader();

    private readonly binaryReader =

        new STLBinaryReader();

    private readonly converter =

        new STLMeshConverter();



    read(

        data: string | ArrayBuffer

    ): Document {

        const triangles =

            typeof data === "string"

                ? this.asciiReader.read(data)

                : this.binaryReader.read(data);



        return this.converter.convert(

            triangles

        );

    }

}