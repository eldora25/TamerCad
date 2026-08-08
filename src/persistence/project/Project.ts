import { Document }
from "../core/Document";

export interface ProjectMetadata {

    id: string;

    name: string;

    description?: string;

    author?: string;

    company?: string;

    createdAt: Date;

    modifiedAt: Date;

    version: string;

}

export interface ProjectSettings {

    autoSave: boolean;

    autoSaveInterval: number;

    defaultLengthUnit:
        "mm" | "cm" | "m" | "inch";

    defaultAngleUnit:
        "deg" | "rad";

}

export class Project {

    readonly metadata:

    ProjectMetadata;

    readonly settings:

    ProjectSettings;

    private documents:

    Map<string, Document> =

    new Map();

    private activeDocumentId:

    string | null = null;

    private properties:

    Map<string, any> =

    new Map();

    constructor(

        name: string

    ) {

        this.metadata = {

            id:

            crypto.randomUUID(),

            name,

            createdAt:

            new Date(),

            modifiedAt:

            new Date(),

            version:

            "1.0.0"

        };

        this.settings = {

            autoSave: true,

            autoSaveInterval: 300,

            defaultLengthUnit: "mm",

            defaultAngleUnit: "deg"

        };

    }

    addDocument(

        document: Document

    ): void {

        this.documents.set(

            document.metadata.id,

            document

        );

        if (

            this.activeDocumentId === null

        ) {

            this.activeDocumentId =

            document.metadata.id;

        }

        this.touch();

    }

    removeDocument(

        id: string

    ): boolean {

        const removed =

        this.documents.delete(id);

        if (

            this.activeDocumentId === id

        ) {

            this.activeDocumentId =

            this.documents.size > 0

                ? Array.from(

                    this.documents.keys()

                  )[0]

                : null;

        }

        if (removed) {

            this.touch();

        }

        return removed;

    }

    getDocument(

        id: string

    ): Document | null {

        return (

            this.documents.get(id)

            ??

            null

        );

    }

    getDocuments():

    Document[] {

        return Array.from(

            this.documents.values()

        );

    }

    getActiveDocument():

    Document | null {

        if (

            !this.activeDocumentId

        ) {

            return null;

        }

        return this.getDocument(

            this.activeDocumentId

        );

    }

    setActiveDocument(

        id: string

    ): boolean {

        if (

            !this.documents.has(id)

        ) {

            return false;

        }

        this.activeDocumentId = id;

        this.touch();

        return true;

    }

    setProperty(

        key: string,

        value: any

    ): void {

        this.properties.set(

            key,

            value

        );

        this.touch();

    }

    getProperty(

        key: string

    ): any {

        return this.properties.get(key);

    }

    getProperties():

    Record<string, any> {

        return Object.fromEntries(

            this.properties

        );

    }

    touch(): void {

        this.metadata.modifiedAt =

        new Date();

    }

    toJSON() {

        return {

            metadata:

            this.metadata,

            settings:

            this.settings,

            activeDocumentId:

            this.activeDocumentId,

            documents:

            this.getDocuments()

            .map(

                doc =>

                doc.toJSON()

            ),

            properties:

            this.getProperties()

        };

    }

}