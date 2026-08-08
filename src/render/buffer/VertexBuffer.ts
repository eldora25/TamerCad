import { RenderContext } from "../RenderContext";

export enum BufferUsage {

    Static = "Static",

    Dynamic = "Dynamic",

    Stream = "Stream"

}


export enum BufferType {

    Vertex = "Vertex",

    Normal = "Normal",

    UV = "UV",

    Custom = "Custom"

}


export class VertexBuffer {

    private data:

        Float32Array | null = null;


    private gpuBuffer:

        any = null;


    private uploaded = false;


    constructor(

        public readonly type:

            BufferType =

            BufferType.Vertex,


        public readonly usage:

            BufferUsage =

            BufferUsage.Static

    ) {}



    setData(

        data: Float32Array

    ): void {

        this.data = data;

        this.uploaded = false;

    }



    getData():

    Float32Array | null {

        return this.data;

    }



    upload(

        context:

            RenderContext

    ): void {


        if (

            !this.data

        ) {

            return;

        }


        /**
         * Backend bağımsız GPU yükleme.
         *
         * WebGL:
         *
         * gl.createBuffer()
         * gl.bindBuffer()
         * gl.bufferData()
         *
         */


        if (

            context.nativeContext

        ) {

            this.gpuBuffer = {

                backend:

                    context.backend,

                size:

                    this.data.byteLength,

                usage:

                    this.usage

            };

        }


        this.uploaded = true;

    }



    bind(

        context:

            RenderContext

    ): void {


        if (

            !this.uploaded

        ) {

            this.upload(

                context

            );

        }


        /**
         * GPU bind işlemi
         *
         * WebGL:
         *
         * gl.bindBuffer(...)
         *
         */

    }



    update(

        data:

            Float32Array,

        context:

            RenderContext

    ): void {


        this.setData(

            data

        );


        this.upload(

            context

        );

    }



    isUploaded():

    boolean {

        return this.uploaded;

    }



    getSize():

    number {


        return this.data

            ? this.data.byteLength

            : 0;

    }



    dispose(): void {


        /**
         * GPU buffer silme
         *
         * gl.deleteBuffer()
         *
         */


        this.gpuBuffer = null;


        this.data = null;


        this.uploaded = false;

    }

}