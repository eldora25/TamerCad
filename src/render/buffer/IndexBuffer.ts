import { RenderContext } from "../RenderContext";

export enum IndexType {

    Uint16 = "Uint16",

    Uint32 = "Uint32"

}


export enum IndexBufferUsage {

    Static = "Static",

    Dynamic = "Dynamic",

    Stream = "Stream"

}


export class IndexBuffer {

    private data:

        Uint16Array |

        Uint32Array |

        null = null;


    private gpuBuffer:

        any = null;


    private uploaded = false;


    constructor(

        public readonly type:

            IndexType =

            IndexType.Uint32,


        public readonly usage:

            IndexBufferUsage =

            IndexBufferUsage.Static

    ) {}



    setData(

        data:

            Uint16Array |

            Uint32Array

    ): void {


        this.data = data;


        this.uploaded = false;

    }



    getData():

    Uint16Array |

    Uint32Array |

    null {


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
         * GPU index buffer oluşturma.
         *
         * WebGL:
         *
         * gl.createBuffer()
         * gl.bindBuffer(ELEMENT_ARRAY_BUFFER)
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


                indexType:

                    this.type,


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
         * GPU bind işlemi.
         *
         * WebGL:
         *
         * gl.bindBuffer(
         *    gl.ELEMENT_ARRAY_BUFFER,
         *    buffer
         * )
         */

    }



    update(

        data:

            Uint16Array |

            Uint32Array,


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



    getCount():

    number {


        if (

            !this.data

        ) {

            return 0;

        }


        return this.data.length;

    }



    getSize():

    number {


        return this.data

            ? this.data.byteLength

            : 0;

    }



    getIndexType():

    IndexType {


        return this.type;

    }



    isUploaded():

    boolean {


        return this.uploaded;

    }



    dispose(): void {


        /**
         * GPU buffer temizleme.
         *
         * WebGL:
         *
         * gl.deleteBuffer()
         */


        this.gpuBuffer = null;


        this.data = null;


        this.uploaded = false;

    }

}