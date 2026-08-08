import { RenderCamera } from "../RenderCamera";
import { DisplayMesh } from "../display/DisplayMesh";

export interface MeshRenderContext {

    viewportWidth: number;

    viewportHeight: number;

    time?: number;

}

export interface MeshRenderStatistics {

    drawCalls: number;

    renderedTriangles: number;

    renderedVertices: number;

}

export class MeshRenderer {

    private statistics: MeshRenderStatistics = {

        drawCalls: 0,

        renderedTriangles: 0,

        renderedVertices: 0

    };

    constructor() {}

    beginFrame(): void {

        this.statistics.drawCalls = 0;

        this.statistics.renderedTriangles = 0;

        this.statistics.renderedVertices = 0;

    }

    render(

        mesh: DisplayMesh,

        camera: RenderCamera,

        context: MeshRenderContext

    ): void {

        /**
         * Burada gerçek GPU çağrıları
         * ileride yapılacak.
         *
         * OpenGL
         * WebGPU
         * ThreeJS
         */

        const viewMatrix =

            camera.getViewMatrix();

        const projectionMatrix =

            camera.getProjectionMatrix();

        // Placeholder
        void viewMatrix;
        void projectionMatrix;
        void context;

        this.statistics.drawCalls++;

        this.statistics.renderedTriangles +=

            mesh.getTriangleCount();

        this.statistics.renderedVertices +=

            mesh.getVertexCount();

    }

    endFrame(): void {

        /**
         * SwapBuffers
         *