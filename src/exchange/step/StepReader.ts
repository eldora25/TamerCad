import { Document }
from "../../persistence/core/Document";

import { StepParser }
from "./StepParser";



export class StepReader {

    private readonly parser =

    new StepParser();



    read(

        stepContent: string

    ): Document {



        const parsed =

        this.parser.parse(

            stepContent

        );



        const document =

        new Document(

            parsed.fileName ??

            "Imported STEP"

        );



        // TODO
        //
        // parsed.entities
        //        ↓
        // Geometry Builder
        //        ↓
        // BRepModel
        //        ↓
        // document.brep



        return document;

    }

}