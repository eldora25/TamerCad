import { RenderGraphPass } from "./RenderGraphPass";
import { RenderGraphResource } from "./RenderGraphResource";

export interface RenderGraphCompileResult {

    executionOrder: RenderGraphPass[];

    dependencies: Map<
        RenderGraphPass,
        RenderGraphPass[]
    >;

}

export class RenderGraphCompiler {

    compile(

        passes: readonly RenderGraphPass[],

        resources: readonly RenderGraphResource[]

    ): RenderGraphCompileResult {

        const dependencyMap =

            this.buildDependencies(

                passes,

                resources

            );

        const executionOrder =

            this.topologicalSort(

                passes,

                dependencyMap

            );

        return {

            executionOrder,

            dependencies: dependencyMap

        };

    }

    private buildDependencies(

        passes: readonly RenderGraphPass[],

        resources: readonly RenderGraphResource[]

    ): Map<
        RenderGraphPass,
        RenderGraphPass[]
    > {

        const map =

            new Map<
                RenderGraphPass,
                RenderGraphPass[]
            >();

        for (const pass of passes) {

            map.set(pass, []);

        }

        for (const resource of resources) {

            const producerName =
                resource.getProducer();

            if (!producerName) {
                continue;
            }

            const producer =

                passes.find(

                    p =>

                        p.name === producerName

                );

            if (!producer) {
                continue;
            }

            for (

                const consumerName of

                resource.getConsumers()

            ) {

                const consumer =

                    passes.find(

                        p =>

                            p.name === consumerName

                    );

                if (!consumer) {
                    continue;
                }

                if (producer === consumer) {
                    continue;
                }

                const deps =

                    map.get(consumer)!;

                if (

                    !deps.includes(producer)

                ) {

                    deps.push(

                        producer

                    );

                }

            }

        }

        return map;

    }

    private topologicalSort(

        passes: readonly RenderGraphPass[],

        dependencyMap: Map<
            RenderGraphPass,
            RenderGraphPass[]
        >

    ): RenderGraphPass[] {

        const result:

            RenderGraphPass[] = [];

        const visited =

            new Set<RenderGraphPass>();

        const visiting =

            new Set<RenderGraphPass>();

        const visit = (

            pass: RenderGraphPass

        ) => {

            if (

                visited.has(pass)

            ) {

                return;

            }

            if (

                visiting.has(pass)

            ) {

                throw new Error(

                    `RenderGraph cycle detected at ${pass.name}`

                );

            }

            visiting.add(pass);

            const deps =

                dependencyMap.get(pass) ?? [];

            for (const dep of deps) {

                visit(dep);

            }

            visiting.delete(pass);

            visited.add(pass);

            result.push(pass);

        };

        for (const pass of passes) {

            visit(pass);

        }

        return result;

    }

}