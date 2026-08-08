import { Document } from "../core/Document";
import {
    Serializer,
    SerializerFormat,
    SerializerMetadata
} from "./Serializer";

import { StepReader }
from "../../exchange/step/StepReader";

import { StepWriter }
from "../../exchange/step/StepWriter";

export class StepSerializer
implements Serializer {

    readonly metadata: SerializerMetadata = {

        format: SerializerFormat.STEP,

        version: "AP242",

        mimeType: "application/step",

        extension: ".step"

    };

    constructor(

        private readonly reader =

            new StepReader(),

        private readonly writer =

            new StepWriter()

    ) {}

    serialize(
        document: Document
    ): string {

        return this.writer.write(document);

    }

    deserialize(
        data: string
    ): Document {

        return this.reader.read(data);

    }

    supports(
        format: SerializerFormat
    ): boolean {

        return format ===

            SerializerFormat.STEP;

    }

}