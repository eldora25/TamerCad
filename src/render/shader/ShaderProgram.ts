import { RenderContext } from "../RenderContext";
import { Shader } from "./Shader";


export interface ShaderUniform {

    name: string;

    value: any;

}


export interface ShaderAttribute {

    name: string;

    location: number;

}



export class ShaderProgram {


    private linked = false;


    private nativeProgram:

        any = null;


    private uniforms =

        new Map<string, ShaderUniform>();


    private attributes =

        new Map<string, ShaderAttribute>();



    constructor(

        public readonly vertexShader:

            Shader,


        public readonly fragmentShader:

            Shader

    ) {}



    compile(

        context:

            RenderContext

    ): void {


        if (

            !this.vertexShader.isCompiled()

        ) {


            this.vertexShader.compile(

                context

            );

        }



        if (

            !this.fragmentShader.isCompiled()

        ) {


            this.fragmentShader.compile(

                context

            );

        }


    }



    link(

        context:

            RenderContext

    ): void {


        if (

            !this.vertexShader.validate()

            ||

            !this.fragmentShader.validate()

        ) {

            throw new Error(

                "Shader validation failed."

            );

        }



        /**
         * GPU program oluşturma.
         *
         * WebGL:
         *
         * gl.createProgram()
         * gl.attachShader()
         * gl.linkProgram()
         *
         */


        this.nativeProgram = {


            backend:

                context.backend,


            vertex:

                this.vertexShader.getNativeShader(),


            fragment:

                this.fragmentShader.getNativeShader()


        };



        this.linked = true;

    }



    use(

        context:

            RenderContext

    ): void {


        if (

            !this.linked

        ) {

            throw new Error(

                "Shader program is not linked."

            );

        }


        /**
         * GPU program aktif etme.
         *
         * WebGL:
         *
         * gl.useProgram()
         */

        void context;

    }



    setUniform(

        name: string,

        value: any

    ): void {


        this.uniforms.set(

            name,

            {

                name,

                value

            }

        );

    }



    getUniform(

        name: string

    ):

    ShaderUniform | undefined {


        return this.uniforms.get(

            name

        );

    }



    addAttribute(

        name: string,

        location: number

    ): void {


        this.attributes.set(

            name,

            {

                name,

                location

            }

        );

    }



    getAttribute(

        name: string

    ):

    ShaderAttribute | undefined {


        return this.attributes.get(

            name

        );

    }



    hasUniform(

        name: string

    ): boolean {


        return this.uniforms.has(

            name

        );

    }



    hasAttribute(

        name: string

    ): boolean {


        return this.attributes.has(

            name

        );

    }



    isLinked():

    boolean {


        return this.linked;

    }



    getNativeProgram():

    any {


        return this.nativeProgram;

    }



    dispose(): void {


        /**
         * GPU program temizleme.
         *
         * WebGL:
         *
         * gl.deleteProgram()
         */


        this.nativeProgram = null;


        this.uniforms.clear();


        this.attributes.clear();


        this.linked = false;

    }

}