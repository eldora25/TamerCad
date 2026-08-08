import { Project }
from "./Project";

import { PersistenceManager }
from "../core/PersistenceManager";

import { FileWriter }
from "../io/FileWriter";



export interface SaveProjectResult {

    success: boolean;

    path: string;

    bytesWritten: number;

    error?: Error;

}



export class ProjectSaver {

    constructor(

        private persistence:

        PersistenceManager,



        private writer:

        FileWriter

    ) {}



    async save(

        project: Project,

        path: string

    ):

    Promise<SaveProjectResult> {



        try {



            project.touch();



            const json =

            this.persistence.save(

                project.getActiveDocument()!

            );



            const result =

            await this.writer.writeText(

                path,

                json

            );



            return {

                success:

                result.success,



                path:

                result.path,



                bytesWritten:

                result.bytesWritten,



                error:

                result.error

            };



        }

        catch(error){



            return {

                success:false,

                path,

                bytesWritten:0,

                error:

                error as Error

            };

        }

    }



    async saveCopy(

        project: Project,

        path: string

    ):

    Promise<SaveProjectResult>{

        return this.save(

            project,

            path

        );

    }

}