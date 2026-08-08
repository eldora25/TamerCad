import { Document }
from "./Document";

import { Serializer }
from "../serializer/Serializer";



export class PersistenceManager {



    constructor(

        private serializer:

        Serializer

    ) {}



    save(

        document:

        Document

    ):

    string {



        document.touch();



        return this.serializer.serialize(

            document

        );

    }



    load(

        data:

        string

    ):

    Document {



        return this.serializer.deserialize(

            data

        );

    }



    export(

        document:

        Document

    ):

    Uint8Array {



        const text =

        this.save(

            document

        );



        return new TextEncoder()

        .encode(

            text

        );

    }



    import(

        bytes:

        Uint8Array

    ):

    Document {



        const text =

        new TextDecoder()

        .decode(

            bytes

        );



        return this.load(

            text

        );

    }



    clone(

        document:

        Document

    ):

    Document {



        const serialized =

        this.save(

            document

        );



        return this.load(

            serialized

        );

    }



    validate(

        data:

        string

    ):

    boolean {



        try {

            this.load(

                data

            );



            return true;

        }

        catch {

            return false;

        }

    }

}