import { Project }
from "./Project";

import { Document }
from "../core/Document";

import { PersistenceManager }
from "../core/PersistenceManager";

import { FileReader }
from "../io/FileReader";



export interface LoadProjectResult {

    success: boolean;

    project?: Project;

    path: string;

    error?: Error;

}



export class ProjectLoader {

    constructor(

        private persistence:

        PersistenceManager,



        private reader:

        FileReader

    ) {}



    async load(

        path: string

    ):

    Promise<LoadProjectResult> {



        try {



            const result =

            await this.reader.readText(

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



            const document:

            Document =

            this.persistence.load(

                result.content

            );



            const project =

            new Project(

                document.metadata.name

            );



            project.addDocument(

                document

            );



            return {

                success: true,

                path,

                project

            };



        }

        catch(error){

            return {

                success: false,

                path,

                error:

                error as Error

            };

        }

    }

}