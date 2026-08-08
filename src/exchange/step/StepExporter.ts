import { Document }
from "../../persistence/core/Document";

import { StepWriter }
from "./StepWriter";

import { FileWriter }
from "../../persistence/io/FileWriter";



export interface StepExportOptions {

    overwrite?: boolean;

    includeHiddenGeometry?: boolean;

    schema?: "AP203" | "AP214" | "AP242";

}



export interface StepExportResult {

    success: boolean;

    path: string;

    bytesWritten: number;

    error?: Error;

}



export class StepExporter {

    constructor(

        private readonly writer =
            new StepWriter(),

        private readonly fileWriter:
            FileWriter

    ) {}



    async export(

        document: Document,

        path: string,

        options: StepExportOptions = {}

    ): Promise<StepExportResult> {

        try {

            const step =

                this.writer.write(

                    document

                );



            const result =

                await this.fileWriter.writeText(

                    path,

                    step,

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

        catch (error) {

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

        document: Document

    ): string {

        return this.writer.write(

            document

        );

    }

}