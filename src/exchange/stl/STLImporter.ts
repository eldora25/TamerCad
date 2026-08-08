import { Document } from "../../persistence/core/Document";
import { FileReader } from "../../persistence/io/FileReader";
import { STLReader } from "./STLReader";

export interface STLImportOptions {

    mergeIntoDocument?: boolean;

}

export interface STLImportResult {

    success: boolean;

    path: string;

    document?: Document;

    error?: Error;

}

export class STLImporter {

    constructor(

        private readonly reader =
            new STLReader(),

        private readonly fileReader:
            FileReader

    ) {}

    async import(

        path: string,

        _options: STLImportOptions = {}

    ): Promise<STLImportResult> {

        try {

            const extension =

                path

                .split(".")

                .pop()

                ?.toLowerCase();

            let document: Document;

            if (

                extension === "stla"

            ) {

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

                document =

                    this.reader.read(

                        result.content

                    );

            }

            else {

                const result =

                    await this.fileReader.readBinary(

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

                document =

                    this.reader.read(

                        result.content

                    );

            }

            return {

                success: true,

                path,

                document

            };

        }

        catch (

            error

        ) {

            return {

                success: false,

                path,

                error:

                    error as Error

            };

        }

    }

    importFromString(

        asciiSTL: string

    ): Document {

        return this.reader.read(

            asciiSTL

        );

    }

    importFromBinary(

        binarySTL: ArrayBuffer

    ): Document {

        return this.reader.read(

            binarySTL

        );

    }

}