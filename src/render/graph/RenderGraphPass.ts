import {
    RenderGraphResource
} from "./RenderGraphResource";

import {
    RenderContext
} from "../RenderContext";



export type RenderGraphExecuteCallback = (

    context: RenderContext

) => void;



export class RenderGraphPass {

    public readonly name: string;



    private readonly reads:

        RenderGraphResource[] = [];



    private readonly writes:

        RenderGraphResource[] = [];



    private readonly dependencies:

        RenderGraphPass[] = [];



    private executeCallback:

        RenderGraphExecuteCallback | null = null;



    constructor(

        name: string

    ) {

        this.name = name;

    }



    public read(

        resource:

            RenderGraphResource

    ): this {

        this.reads.push(

            resource

        );



        resource.addConsumer(

            this.name

        );



        return this;

    }



    public write(

        resource:

            RenderGraphResource

    ): this {

        this.writes.push(

            resource

        );



        resource.setProducer(

            this.name

        );



        return this;

    }



    public dependsOn(

        pass:

            RenderGraphPass

    ): this {

        if (

            !this.dependencies.includes(pass)

        ) {

            this.dependencies.push(

                pass

            );

        }



        return this;

    }



    public setExecute(

        callback:

            RenderGraphExecuteCallback

    ): this {

        this.executeCallback =

            callback;

        return this;

    }



    public execute(

        context:

            RenderContext

    ): void {

        if (

            this.executeCallback

        ) {

            this.executeCallback(

                context

            );

        }

    }



    public getReads():

    readonly RenderGraphResource[] {

        return this.reads;

    }



    public getWrites():

    readonly RenderGraphResource[] {

        return this.writes;

    }



    public getDependencies():

    readonly RenderGraphPass[] {

        return this.dependencies;

    }



    public debugInfo() {

        return {

            name:

                this.name,

            reads:

                this.reads.map(

                    r => r.name

                ),

            writes:

                this.writes.map(

                    r => r.name

                ),

            dependencies:

                this.dependencies.map(

                    d => d.name

                )

        };

    }

}