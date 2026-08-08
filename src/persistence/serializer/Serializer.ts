import { Document }
from "../core/Document";



export enum SerializerFormat {

    JSON = "json",

    BINARY = "binary",

    BREP = "brep",

    STEP = "step",

    IGES = "iges",

    GLTF = "gltf"

}



export interface SerializerMetadata {

    format: SerializerFormat;

    version: string;

    mimeType: string;

    extension: string;

}



export interface Serializer {



    readonly metadata:

    SerializerMetadata;



    serialize(

        document: Document

    ): string;



    deserialize(

        data: string

    ): Document;



    supports(

        format: SerializerFormat

    ): boolean;

}