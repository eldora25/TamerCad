import { RenderViewport } from "./RenderViewport";
import { RenderCamera } from "./RenderCamera";

export enum RenderBackend {

    WebGL = "WebGL",

    WebGPU = "WebGPU",

    Software = "Software"

}


export interface RenderCapabilities {

    maxTextureSize: number;

    maxVertexAttributes: number;

    supportsInstancing: boolean;

    supportsFloatTextures: boolean;

}


export class RenderContext {

    /**
     * GPU / Rendering backend
     */
    public backend:

        RenderBackend =

        RenderBackend.Software;


    /**
     * Native graphics context
     *
     * WebGLRenderingContext
     * GPUDevice
     * vb.
     */
    public nativeContext: any = null;


    /**
     * Active viewport
     */
    public viewport:

        RenderViewport | null = null;


    /**
     * Active camera
     */
    public camera:

        RenderCamera | null = null;


    /**
     * Capabilities
     */
    public capabilities:

        RenderCapabilities = {

            maxTextureSize: 0,

            maxVertexAttributes: 0,

            supportsInstancing: false,

            supportsFloatTextures: false

        };


    private initialized = false;



    constructor(

        backend:

        RenderBackend =

            RenderBackend.Software

    ) {

        this.backend = backend;

    }



    initialize(

        nativeContext?: any

    ): void {


        this.nativeContext =

            nativeContext ?? null;


        this.detectCapabilities();


        this.initialized = true;

    }



    isInitialized(): boolean {

        return this.initialized;

    }



    setViewport(

        viewport: RenderViewport

    ): void {

        this.viewport = viewport;

    }



    setCamera(

        camera: RenderCamera

    ): void {

        this.camera = camera;

    }



    applyViewport(): void {


        if (

            this.viewport &&

            this.nativeContext

        ) {


            this.viewport.apply(

                this.nativeContext

            );

        }

    }



    clear(

        color = true,

        depth = true

    ): void {


        if (

            !this.nativeContext

        ) {

            return;

        }


        /**
         * Backend bağımsız
         *
         * Gerçek implementasyon:
         *
         * WebGL:
         * gl.clear(...)
         *
         * WebGPU:
         * commandEncoder.beginRenderPass(...)
         *
         */


        void color;

        void depth;

    }



    resize(

        width: number,

        height: number

    ): void {


        if (

            this.viewport

        ) {

            this.viewport.resize(

                width,

                height

            );

        }

    }



    getAspectRatio(): number {


        if (

            !this.viewport

        ) {

            return 1;

        }


        return this.viewport.getAspectRatio();

    }



    getCapabilities():

    RenderCapabilities {


        return {

            ...this.capabilities

        };

    }



    dispose(): void {


        this.nativeContext = null;


        this.viewport = null;


        this.camera = null;


        this.initialized = false;

    }



    private detectCapabilities(): void {


        if (

            this.backend ===

            RenderBackend.WebGL &&

            this.nativeContext

        ) {


            const gl =

                this.nativeContext;


            this.capabilities = {


                maxTextureSize:

                    gl.getParameter(

                        gl.MAX_TEXTURE_SIZE

                    ),


                maxVertexAttributes:

                    gl.getParameter(

                        gl.MAX_VERTEX_ATTRIBS

                    ),


                supportsInstancing:

                    !!gl.drawElementsInstanced,


                supportsFloatTextures:

                    !!gl.FLOAT

            };


            return;

        }



        if (

            this.backend ===

            RenderBackend.WebGPU

        ) {


            this.capabilities = {


                maxTextureSize:

                    16384,


                maxVertexAttributes:

                    16,


                supportsInstancing:

                    true,


                supportsFloatTextures:

                    true

            };


            return;

        }



        this.capabilities = {


            maxTextureSize:

                0,


            maxVertexAttributes:

                0,


            supportsInstancing:

                false,


            supportsFloatTextures:

                false

        };

    }

}