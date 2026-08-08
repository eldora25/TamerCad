import { Mesh } from "./Mesh";
import { MeshBody } from "./MeshBody";

export interface SerializedMeshDocument {

    version: number;

    mesh: any;

}

export interface SerializedMeshBody {

    version: number;

    body: any;

}

export class MeshSerializer {

    public static readonly VERSION = 1;

    serializeMesh(

        mesh: Mesh,

        pretty = true

    ): string {

        const data: SerializedMeshDocument = {

            version:

                MeshSerializer.VERSION,

            mesh:

                mesh.toJSON()

        };

        return pretty

            ? JSON.stringify(

                data,

                null,

                4

            )

            : JSON.stringify(

                data

            );

    }

    deserializeMesh(

        json: string

    ): Mesh {

        const data:

            SerializedMeshDocument =

            JSON.parse(

                json

            );

        this.checkVersion(

            data.version

        );

        return Mesh.fromJSON(

            data.mesh

        );

    }

    serializeBody(

        body: MeshBody,

        pretty = true

    ): string {

        const data:

            SerializedMeshBody = {

            version:

                MeshSerializer.VERSION,

            body:

                body.toJSON()

        };

        return pretty

            ? JSON.stringify(

                data,

                null,

                4

            )

            : JSON.stringify(

                data

            );

    }

    deserializeBody(

        json: string

    ): MeshBody {

        const data:

            SerializedMeshBody =

            JSON.parse(

                json

            );

        this.checkVersion(

            data.version

        );

        return MeshBody.fromJSON(

            data.body

        );

    }

    toObject(

        mesh: Mesh

    ): object {

        return {

            version:

                MeshSerializer.VERSION,

            mesh:

                mesh.toJSON()

        };

    }

    fromObject(

        object: any

    ): Mesh {

        this.checkVersion(

            object.version

        );

        return Mesh.fromJSON(

            object.mesh

        );

    }

    private checkVersion(

        version: number

    ): void {

        if (

            version >

            MeshSerializer.VERSION

        ) {

            throw new Error(

                `Unsupported mesh serialization version ${version}.`

            );

        }

    }

}