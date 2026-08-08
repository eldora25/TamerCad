import { StepEntity } from "./StepEntity";
import { StepEntityFactory } from "./StepEntityFactory";
import { StepSchema } from "./StepSchema";

export interface StepHeader {

    fileDescription?: string;

    fileName?: string;

    fileSchema?: string;

}

export interface StepModel {

    header: StepHeader;

    entities: StepEntity[];

    fileName?: string;

}

export class StepParser {

    private readonly schema =
        new StepSchema();

    private readonly factory =
        new StepEntityFactory();

    parse(

        content: string

    ): StepModel {

        const normalized =

            content.replace(/\r\n/g, "\n");

        const header =

            this.parseHeader(

                normalized

            );

        const entities =

            this.parseEntities(

                normalized

            );

        return {

            header,

            entities,

            fileName:

                this.extractFileName(

                    header.fileName

                )

        };

    }

    private parseHeader(

        text: string

    ): StepHeader {

        const header: StepHeader = {};

        const match =

            text.match(

                /HEADER;(.*?)ENDSEC;/s

            );

        if (!match) {

            return header;

        }

        const section =

            match[1];

        const desc =

            section.match(

                /FILE_DESCRIPTION\s*\((.*?)\);/s

            );

        if (desc) {

            header.fileDescription =

                desc[1];

        }

        const name =

            section.match(

                /FILE_NAME\s*\((.*?)\);/s

            );

        if (name) {

            header.fileName =

                name[1];

        }

        const schema =

            section.match(

                /FILE_SCHEMA\s*\((.*?)\);/s

            );

        if (schema) {

            header.fileSchema =

                schema[1];

        }

        return header;

    }

    private parseEntities(

        text: string

    ): StepEntity[] {

        const output: StepEntity[] = [];

        const dataMatch =

            text.match(

                /DATA;(.*?)ENDSEC;/s

            );

        if (!dataMatch) {

            return output;

        }

        const data =

            dataMatch[1];

        const regex =

            /#(\d+)\s*=\s*([A-Z0-9_]+)\s*\((.*?)\);/gs;

        let match:
            RegExpExecArray | null;

        while (

            (match = regex.exec(data))

            !== null

        ) {

            const id =

                Number(match[1]);

            const type =

                match[2].toUpperCase();

            if (

                !this.schema.has(type)

            ) {

                continue;

            }

            const definition =

                this.schema.get(type);

            if (

                !definition ||

                !definition.supported

            ) {

                continue;

            }

            const parameters =

                this.tokenize(

                    match[3]

                );

            try {

                const entity =

                    this.factory.create(

                        id,

                        type,

                        parameters

                    );

                output.push(

                    entity

                );

            }

            catch {

                // geçersiz entity

            }

        }

        return output;

    }

    private tokenize(

        value: string

    ): string[] {

        const result: string[] = [];

        let current = "";

        let depth = 0;

        let inString = false;

        for (

            const c of value

        ) {

            if (c === "'") {

                inString =

                    !inString;

            }

            if (!inString) {

                if (c === "(") depth++;

                if (c === ")") depth--;

                if (

                    c === "," &&

                    depth === 0

                ) {

                    result.push(

                        current.trim()

                    );

                    current = "";

                    continue;

                }

            }

            current += c;

        }

        if (

            current.length > 0

        ) {

            result.push(

                current.trim()

            );

        }

        return result;

    }

    private extractFileName(

        value?: string

    ): string | undefined {

        if (!value) {

            return undefined;

        }

        const match =

            value.match(

                /^'([^']+)'/

            );

        return match?.[1];

    }

}