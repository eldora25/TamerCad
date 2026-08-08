import { Document }
from "../../persistence/core/Document";

import { STLTriangle }
from "./STLReader";

export class STLMeshConverter {

    convert(

        triangles: STLTriangle[]

    ): Document {

        const document =

            new Document(

                "Imported STL"

            );



        document.metadata = {

            ...document.metadata,



            sourceFormat: "STL",



            triangleCount:

                triangles.length,



            mesh: {

                triangles

            }

        };



        return document;

    }

}