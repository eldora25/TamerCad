import { MeshBody } from "../../geometry/mesh/MeshBody";
import { STLAsciiWriter } from "./STLAsciiWriter";
import { STLBinaryWriter } from "./STLBinaryWriter";

export type STLFormat =
    | "ascii"
    | "binary";

export interface STLWriteOptions {

    format?: STLFormat;

    solidName?: string;

}

export class STLWriter {

    private readonly asciiWriter =
        new STLAsciiWriter();

    private readonly binaryWriter =
        new STLBinaryWriter();

    write(

        body: MeshBody,

        options: STLWriteOptions = {}

    ): string | ArrayBuffer {

        const format =
            options.format ?? "ascii";

        switch (format) {

            case "ascii":

                return this.asciiWriter.write(

                    body,

                    {

                        solidName:

                            options.solidName

                    }

                );

            case "binary":

                return this.binaryWriter.write(

                    body,

                    {

                        solidName:

                            options.solidName

                    }

                );

            default:

                throw new Error(

                    `Unsupported STL format: ${format}`

                );

        }

    }

}