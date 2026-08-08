import { Document }
from "../../persistence/core/Document";

import { FileReader }
from "../../persistence/io/FileReader";

import { StepReader }
from "./StepReader";



export interface StepImportOptions {

    mergeIntoDocument?: boolean;

    repairTopology?: boolean;

}



export interface StepImportResult {

    success: boolean;

    document?: Document;

    path: string;

    error?: Error;

}



export class StepImporter {

    constructor(

        private readonly reader =
            new StepReader(),

        private readonly fileReader:
            FileReader

    ) {}



    async import(

        path: string,

        options: StepImportOptions = {}

    ): Promise<StepImportResult> {

        try {

            const result =

                await this.fileReader.readText(

                    path

                );



            if (

                !result.success ||

                !result.content

            ) {

                return {

                    success: false,

                    path,

                    error:

                        result.error

                };

            }



            const document =

                this.reader.read(

                    result.content

                );



            // Gelecekte:
            //
            // Topology repair
            //
            // Merge
            //
            // Healing
            //
            // Unit conversion



            return {

                success: true,

                path,

                document

            };

        }

        catch (error) {

            return {

                success: false,

                path,

                error:

                    error as Error

            };

        }

    }



    importFromString(

        step: string

    ): Document {

        return this.reader.read(

            step

        );

    }

}