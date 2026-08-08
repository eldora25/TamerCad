export interface FileReadOptions {

    encoding?: string;

}

export interface FileReadResult {

    success: boolean;

    path: string;

    content?: string;

    data?: Uint8Array;

    bytesRead: number;

    error?: Error;

}

export abstract class FileReader {

    abstract readText(

        path: string,

        options?: FileReadOptions

    ): Promise<FileReadResult>;



    abstract readBinary(

        path: string

    ): Promise<FileReadResult>;



    abstract exists(

        path: string

    ): Promise<boolean>;



    abstract getFileSize(

        path: string

    ): Promise<number>;

}