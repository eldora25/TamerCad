export interface FileWriteOptions {

    overwrite?: boolean;

    createDirectories?: boolean;

    encoding?: string;

}

export interface FileWriteResult {

    success: boolean;

    path: string;

    bytesWritten: number;

    error?: Error;

}

export abstract class FileWriter {

    abstract writeText(

        path: string,

        content: string,

        options?: FileWriteOptions

    ): Promise<FileWriteResult>;



    abstract writeBinary(

        path: string,

        data: Uint8Array,

        options?: FileWriteOptions

    ): Promise<FileWriteResult>;



    abstract exists(

        path: string

    ): Promise<boolean>;



    abstract delete(

        path: string

    ): Promise<boolean>;

}