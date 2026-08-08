import { RenderContext } from "../RenderContext";

import { RenderScene } from "../RenderScene";
import { RenderCamera } from "../RenderCamera";

import { RenderPass } from "../pass/RenderPass";

import { RenderGraphBuilder } from "../graph/RenderGraphBuilder";
import { RenderGraphCompiler } from "../graph/RenderGraphCompiler";
import { RenderGraphExecutor } from "../graph/RenderGraphExecutor";



export interface DeferredRendererOptions {

    context: RenderContext;

}



export class DeferredRenderer {

    protected readonly context: RenderContext;

    protected readonly graphBuilder: RenderGraphBuilder;

    protected readonly graphCompiler: RenderGraphCompiler;

    protected readonly graphExecutor: RenderGraphExecutor;

    protected readonly passes: RenderPass[] = [];

    protected initialized = false;

    protected frameIndex = 0;

    protected width = 1;

    protected height = 1;

    constructor(

        options: DeferredRendererOptions

    ) {

        this.context = options.context;

        this.graphBuilder =
            new RenderGraphBuilder();

        this.graphCompiler =
            new RenderGraphCompiler();

        this.graphExecutor =
            new RenderGraphExecutor();

    }

    initialize(): void {

        if (this.initialized) {

            return;

        }

        this.onInitialize();

        this.initialized = true;

    }

    dispose(): void {

        if (!this.initialized) {

            return;

        }

        for (const pass of this.passes) {

            pass.dispose(this.context);

        }

        this.passes.length = 0;

        this.initialized = false;

    }

    protected onInitialize(): void {

        for (const pass of this.passes) {

            pass.initialize(this.context);

        }

    }

    addPass(

        pass: RenderPass

    ): void {

        if (this.passes.includes(pass)) {

            return;

        }

        this.passes.push(pass);

        this.sortPasses();

        if (this.initialized) {

            pass.initialize(this.context);

        }

    }

    removePass(

        pass: RenderPass

    ): void {

        const index =
            this.passes.indexOf(pass);

        if (index < 0) {

            return;

        }

        pass.dispose(this.context);

        this.passes.splice(index, 1);

    }

    clearPasses(): void {

        for (const pass of this.passes) {

            pass.dispose(this.context);

        }

        this.passes.length = 0;

    }

    protected sortPasses(): void {

        this.passes.sort(

            (a, b) =>

                a.priority - b.priority

        );

    }

    resize(

        width: number,

        height: number

    ): void {

        this.width = width;

        this.height = height;

    }

    getPasses():

    readonly RenderPass[] {

        return this.passes;

    }

    getContext():

    RenderContext {

        return this.context;

    }

}
// -----------------------------------------------------------------------------
// Frame Graph Construction
// -----------------------------------------------------------------------------

protected buildGraph(

    scene: RenderScene,

    camera: RenderCamera

): void {

    this.graphBuilder.clear();

    this.registerResources();

    this.registerPasses(

        scene,

        camera

    );

}



// -----------------------------------------------------------------------------
// Resource Registration
// -----------------------------------------------------------------------------

protected registerResources(): void {

    //
    // Depth
    //

    this.graphBuilder.createResource(

        "Depth",

        RenderGraphResourceType.Depth,

        {

            width: this.width,

            height: this.height

        }

    );



    //
    // GBuffer
    //

    this.graphBuilder.createResource(

        "GBuffer",

        RenderGraphResourceType.Texture,

        {

            width: this.width,

            height: this.height

        }

    );



    //
    // HDR Lighting
    //

    this.graphBuilder.createResource(

        "HDR",

        RenderGraphResourceType.Texture,

        {

            width: this.width,

            height: this.height

        }

    );



    //
    // SSAO
    //

    this.graphBuilder.createResource(

        "SSAO",

        RenderGraphResourceType.Texture,

        {

            width: this.width,

            height: this.height

        }

    );



    //
    // SSR
    //

    this.graphBuilder.createResource(

        "SSR",

        RenderGraphResourceType.Texture,

        {

            width: this.width,

            height: this.height

        }

    );



    //
    // Bloom
    //

    this.graphBuilder.createResource(

        "Bloom",

        RenderGraphResourceType.Texture,

        {

            width: this.width,

            height: this.height

        }

    );

}



// -----------------------------------------------------------------------------
// Pass Registration
// -----------------------------------------------------------------------------

protected registerPasses(

    scene: RenderScene,

    camera: RenderCamera

): void {

    for (

        const renderPass of

        this.passes

    ) {

        const graphPass =

            this.graphBuilder.createPass(

                renderPass.name

            );



        graphPass.setExecute(

            () => {

                renderPass.render(

                    this.context,

                    scene,

                    camera

                );

            }

        );



        this.connectResources(

            graphPass,

            renderPass

        );

    }

}



// -----------------------------------------------------------------------------
// Resource Connections
// -----------------------------------------------------------------------------

protected connectResources(

    graphPass: RenderGraphPass,

    renderPass: RenderPass

): void {

    //
    // Geçici.
    //
    // Daha sonra her pass
    // kendi Read/Write listesini
    // bildirecek.
    //

}
// -----------------------------------------------------------------------------
// Compilation
// -----------------------------------------------------------------------------

protected compileGraph():

ReturnType<RenderGraphCompiler["compile"]> {

    return this.graphCompiler.compile(

        this.graphBuilder.getPasses(),

        this.graphBuilder.getResources()

    );

}



// -----------------------------------------------------------------------------
// Execution
// -----------------------------------------------------------------------------

protected executeGraph(

    compileResult:

        ReturnType<RenderGraphCompiler["compile"]>

): void {

    this.graphExecutor.execute(

        this.context,

        compileResult

    );

}



// -----------------------------------------------------------------------------
// Frame Render
// -----------------------------------------------------------------------------

render(

    scene: RenderScene,

    camera: RenderCamera

): void {

    if (!this.initialized) {

        this.initialize();

    }

    this.buildGraph(

        scene,

        camera

    );

    const compileResult =

        this.compileGraph();

    this.executeGraph(

        compileResult

    );

    this.frameIndex++;

}



// -----------------------------------------------------------------------------
// Frame
// -----------------------------------------------------------------------------

getFrameIndex(): number {

    return this.frameIndex;

}
// -----------------------------------------------------------------------------
// Statistics
// -----------------------------------------------------------------------------

private lastFrameTime = 0;

private lastPassCount = 0;

private lastResourceCount = 0;



// -----------------------------------------------------------------------------
// Profiling
// -----------------------------------------------------------------------------

private beginFrame(): number {

    return performance.now();

}

private endFrame(

    start: number

): void {

    this.lastFrameTime =

        performance.now() - start;

}



// -----------------------------------------------------------------------------
// Debug
// -----------------------------------------------------------------------------

dumpGraph(): void {

    console.group(

        "RenderGraph"

    );



    console.table(

        this.graphBuilder

            .getResources()

            .map(

                r => r.debugInfo()

            )

    );



    console.table(

        this.graphBuilder

            .getPasses()

            .map(

                p => p.debugInfo()

            )

    );



    console.groupEnd();

}



// -----------------------------------------------------------------------------
// Statistics
// -----------------------------------------------------------------------------

getStatistics() {

    return {

        frame:

            this.frameIndex,

        frameTime:

            this.lastFrameTime,

        passes:

            this.lastPassCount,

        resources:

            this.lastResourceCount

    };

}



// -----------------------------------------------------------------------------
// Render
// -----------------------------------------------------------------------------

render(

    scene: RenderScene,

    camera: RenderCamera

): void {

    if (!this.initialized) {

        this.initialize();

    }

    const start =

        this.beginFrame();

    this.buildGraph(

        scene,

        camera

    );

    this.lastPassCount =

        this.graphBuilder

            .getPasses()

            .length;

    this.lastResourceCount =

        this.graphBuilder

            .getResources()

            .length;

    const compiled =

        this.compileGraph();

    this.executeGraph(

        compiled

    );

    this.endFrame(

        start

    );

    this.frameIndex++;

}



// -----------------------------------------------------------------------------
// Hot Reload
// -----------------------------------------------------------------------------

reload(): void {

    this.dispose();

    this.initialize();

}