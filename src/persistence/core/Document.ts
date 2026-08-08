import { BRepModel }
from "../../topology/brep/BRepModel";

import { FeatureTree }
from "../../modeling/feature/FeatureTree";

import { SketchManager }
from "../../modeling/sketch/SketchManager";



export interface DocumentMetadata {

    id: string;

    name: string;

    author?: string;

    company?: string;

    description?: string;

    createdAt: Date;

    modifiedAt: Date;

    version: string;

}



export interface DocumentUnits {

    length: "mm" | "cm" | "m" | "inch";

    angle: "deg" | "rad";

}



export class Document {



    public readonly metadata:

    DocumentMetadata;



    public readonly brep:

    BRepModel;



    public readonly featureTree:

    FeatureTree;



    public readonly sketches:

    SketchManager;



    public readonly units:

    DocumentUnits;



    private customProperties:

    Map<string, any> =

    new Map();



    constructor(

        name: string

    ) {



        this.metadata = {

            id: crypto.randomUUID(),

            name,

            createdAt: new Date(),

            modifiedAt: new Date(),

            version: "1.0.0"

        };



        this.units = {

            length: "mm",

            angle: "deg"

        };



        this.brep =

        new BRepModel();



        this.featureTree =

        new FeatureTree();



        this.sketches =

        new SketchManager();

    }



    rename(

        name: string

    ): void {

        this.metadata.name = name;

        this.touch();

    }



    touch(): void {

        this.metadata.modifiedAt =

        new Date();

    }



    setProperty(

        key: string,

        value: any

    ): void {

        this.customProperties.set(

            key,

            value

        );



        this.touch();

    }



    getProperty(

        key: string

    ): any {

        return this.customProperties.get(

            key

        );

    }



    removeProperty(

        key: string

    ): boolean {

        const removed =

        this.customProperties.delete(

            key

        );



        if (removed) {

            this.touch();

        }



        return removed;

    }



    getProperties():

    Record<string, any> {



        return Object.fromEntries(

            this.customProperties

        );

    }



    clear(): void {

        this.customProperties.clear();

    }



    toJSON() {

        return {

            metadata:

            this.metadata,



            units:

            this.units,



            properties:

            this.getProperties()

        };

    }

}