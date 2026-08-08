import { RenderContext } from "../RenderContext";
import { RenderGraphPass } from "./RenderGraphPass";
import { RenderGraphCompileResult } from "./RenderGraphCompiler";

export class RenderGraphExecutor {

    private lastExecution: RenderGraphPass[] = [];

    execute(

        context: RenderContext,

        compileResult: RenderGraphCompileResult

    ): void {

        this.lastExecution.length = 0;

        for (

            const pass of

            compileResult.executionOrder

        ) {

            this.beginPass(

                context,

                pass

            );

            pass.execute(

                context

            );

            this.endPass(

                context,

                pass

            );

            this.lastExecution.push(

                pass

            );

        }

    }

    private beginPass(

        context: RenderContext,

        pass: RenderGraphPass

    ): void {

        const anyContext =

            context as any;

        anyContext.pushDebugMarker?.(

            pass.name

        );

    }

    private endPass(

        context: RenderContext,

        pass: RenderGraphPass

    ): void {

        const anyContext =

            context as any;

        anyContext.popDebugMarker?.();

    }

    getLastExecution():

    readonly RenderGraphPass[] {

        return this.lastExecution;

    }

    debugInfo() {

        return {

            executed:

                this.lastExecution.map(

                    p => p.name

                )

        };

    }

}