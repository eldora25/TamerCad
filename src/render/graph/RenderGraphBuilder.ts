import { RenderGraphPass } from "./RenderGraphPass";
import {
    RenderGraphResource,
    RenderGraphResourceDescriptor,
    RenderGraphResourceType
} from "./RenderGraphResource";

export class RenderGraphBuilder {

    private readonly passes = new Map<string, RenderGraphPass>();

    private readonly resources = new Map<string, RenderGraphResource>();

    createPass(
        name: string
    ): RenderGraphPass {

        const existing = this.passes.get(name);

        if (existing) {
            return existing;
        }

        const pass = new RenderGraphPass(name);

        this.passes.set(name, pass);

        return pass;

    }

    createResource(

        name: string,

        type: RenderGraphResourceType,

        descriptor: RenderGraphResourceDescriptor = {}

    ): RenderGraphResource {

        const existing = this.resources.get(name);

        if (existing) {
            return existing;
        }

        const resource =

            new RenderGraphResource(

                name,

                type,

                descriptor

            );

        this.resources.set(

            name,

            resource

        );

        return resource;

    }

    read(

        pass: RenderGraphPass,

        resource: RenderGraphResource

    ): this {

        pass.read(resource);

        return this;

    }

    write(

        pass: RenderGraphPass,

        resource: RenderGraphResource

    ): this {

        pass.write(resource);

        return this;

    }

    dependency(

        before: RenderGraphPass,

        after: RenderGraphPass

    ): this {

        after.dependsOn(before);

        return this;

    }

    getPasses():

    readonly RenderGraphPass[] {

        return [...this.passes.values()];

    }

    getResources():

    readonly RenderGraphResource[] {

        return [...this.resources.values()];

    }

    clear(): void {

        this.passes.clear();

        this.resources.clear();

    }

    debugInfo() {

        return {

            passCount:

                this.passes.size,

            resourceCount:

                this.resources.size,

            passes:

                [...this.passes.keys()],

            resources:

                [...this.resources.keys()]

        };

    }

}