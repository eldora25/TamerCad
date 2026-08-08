import { RenderCamera } from "./RenderCamera";
import { RenderScene } from "./RenderScene";
import { MeshRenderer } from "./renderer/MeshRenderer";
import { DisplayMesh } from "./display/DisplayMesh";
import { MeshBody } from "../geometry/mesh/MeshBody";

export interface RenderEngineStatistics {

    frame: number;

    fps: number;

    drawCalls: number;

    renderedTriangles: number;

    renderedVertices: number;

}

export class RenderEngine {

    private readonly meshRenderer =
        new MeshRenderer();

    private readonly displayCache =
        new Map<string, DisplayMesh>();

    private lastFrameTime = 0;

    private frameCounter = 0;

    private fps = 0;

    constructor(

        public readonly scene: RenderScene,

        public readonly camera: RenderCamera

    ) {}

    render(

        viewportWidth: number,

        viewportHeight: number,

        time = performance.now()

    ): void {

        this.beginFrame(time);

        this.meshRenderer.beginFrame();

        for (

            const body of

            this.scene.getMeshBodies()

        ) {

            if (

                !body.visible

            ) {

                continue;

            }

            const displayMesh =
                this.getDisplayMesh(body);

            this.meshRenderer.render(

                displayMesh,

                this.camera,

                {

                    viewportWidth,

                    viewportHeight,

                    time

                }

            );

        }

        this.meshRenderer.endFrame();

        this.frameCounter++;

    }

    invalidateMesh(

        bodyId: string

    ): void {

        this.displayCache.delete(

            bodyId

        );

    }

    clearCache(): void {

        this.displayCache.clear();

    }

    getStatistics():

    RenderEngineStatistics {

        const rendererStats =
            this.meshRenderer.getStatistics();

        return {

            frame:

                this.frameCounter,

            fps:

                this.fps,

            drawCalls:

                rendererStats.drawCalls,

            renderedTriangles:

                rendererStats.renderedTriangles,

            renderedVertices:

                rendererStats.renderedVertices

        };

    }

    private getDisplayMesh(

        body: MeshBody

    ): DisplayMesh {

        let displayMesh =
            this.displayCache.get(

                body.id

            );

        if (

            !displayMesh

        ) {

            displayMesh =
                new DisplayMesh(

                    body.mesh

                );

            this.displayCache.set(

                body.id,

                displayMesh

            );

        }

        return displayMesh;

    }

    private beginFrame(

        currentTime: number

    ): void {

        if (

            this.lastFrameTime !== 0

        ) {

            const dt =
                currentTime -

                this.lastFrameTime;

            if (

                dt > 0

            ) {

                this.fps =
                    1000 / dt;

            }

        }

        this.lastFrameTime =
            currentTime;
    }

}