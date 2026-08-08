import {
    DependencyGraph
} from "./DependencyGraph";

import {
    DependencyNode,
    DependencyState
} from "./DependencyNode";

export interface ResolveResult {

    success: boolean;

    updatedNodes: DependencyNode[];

    failedNodes: DependencyNode[];

}

export class DependencyResolver {

    constructor(

        private graph: DependencyGraph

    ) {}

    resolve(): ResolveResult {

        const ordered =

            this.graph.rebuildOrder();

        const updated: DependencyNode[] = [];

        const failed: DependencyNode[] = [];

        for (const node of ordered) {

            if (!node.isDirty()) {

                continue;

            }

            try {

                node.update();

                updated.push(node);

            }

            catch {

                failed.push(node);

            }

        }

        return {

            success:

                failed.length === 0,

            updatedNodes:

                updated,

            failedNodes:

                failed

        };

    }

    resolveFrom(

        nodeId: string

    ): ResolveResult {

        this.graph.markDirty(nodeId);

        return this.resolve();

    }

    rebuildDirty(): ResolveResult {

        return this.resolve();

    }

    getDirtyNodes():

    DependencyNode[] {

        return this.graph

            .getNodes()

            .filter(

                node =>

                node.getState() ===

                DependencyState.Dirty

            );

    }

    validate():

    boolean {

        return !

        this.graph.hasCycle();

    }

}