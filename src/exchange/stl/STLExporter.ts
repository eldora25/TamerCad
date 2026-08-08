import { MeshBody } from "../../geometry/mesh/MeshBody";
import { FileWriter } from "../../persistence/io/FileWriter";
import {
    STLFormat,
    STLWriter
} from "./STLWriter";

export interface STLExportOptions {

    format?: STLFormat;

    overwrite?: boolean;

    solidName?: string;

}

export interface STLExportResult {

    success: boolean;

    path: string;

    bytesWritten: number;

    error?: Error;

}

export class STLExporter {

    constructor(

        private readonly writer =
            new STLWriter(),

        private readonly fileWriter:
            FileWriter

    ) {}

    async export(

        body: MeshBody,

        path: string,

        options: STLExportOptions = {}

    ): Promise<STLExportResult> {

        try {

            const format =
                options.format ??
                "ascii";

            const output =
                this.writer.write(

                    body,

                    {

                        format,

                        solidName:
                            options.solidName

                    }

                );

            if (

                typeof output === "string"

            ) {

                const result =
                    await this.fileWriter.writeText(

                        path,

                        output,

                        {

                            overwrite:
                                options.overwrite

                        }

                    );

                return {

                    success:
                        result.success,

                    path:
                        result.path,

                    bytesWritten:
                        result.bytesWritten,

                    error:
                        result.error

                };

            }

            const result =
                await this.fileWriter.writeBinary(

                    path,

                    output,

                    {

                        overwrite:
                            options.overwrite

                    }

                );

            return {

                success:
                    result.success,

                path:
                    result.path,

                bytesWritten:
                    result.bytesWritten,

                error:
                    result.error

            };

        }

        catch (

            error

        ) {

            return {

                success: false,

                path,

                bytesWritten: 0,

                error:
                    error as Error

            };

        }

    }

    exportToString(

        body: MeshBody

    ): string {

        return this.writer.write(

            body,

            {

                format:
                    "ascii"

            }

        ) as string;

    }

    exportToBinary(

        body: MeshBody

    ): ArrayBuffer {

        return this.writer.write(

            body,

            {

                format:
                    "binary"

            }

        ) as ArrayBuffer;

    }

}