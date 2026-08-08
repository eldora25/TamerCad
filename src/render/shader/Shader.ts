import { RenderContext } from "../RenderContext";

export enum ShaderType {

    Vertex = "Vertex",

    Fragment = "Fragment",

    Compute = "Compute"

}


export class Shader {

    private compiled = false;

    private nativeShader:

        any = null;


    constructor(

        public readonly type:

            ShaderType,


        public readonly source:

            string

    ) {}



    compile(

        context:

            RenderContext

    ): void {


        if (

            !context.nativeContext

        ) {

            this.compiled = true;

            return;

        }


        /**
         * Backend bağımsız shader compile.
         *
         * WebGL:
         *
         * gl.createShader()
         * gl.shaderSource()
         * gl.compileShader()
         *
         */


        this.nativeShader = {


            backend:

                context.backend,


            type:

                this.type,


            source:

                this.source


        };


        this.compiled = true;

    }



    isCompiled():

    boolean {

        return this.compiled;

    }



    getNativeShader():

    any {

        return this.nativeShader;

    }



    validate():

    boolean {


        if (

            !this.source ||

            this.source.trim().length === 0

        ) {

            return false;

        }


        return true;

    }



    getSource():

    string {

        return this.source;

    }



    dispose(): void {


        /**
         * GPU shader silme.
         *
         * WebGL:
         *
         * gl.deleteShader()
         */


        this.nativeShader = null;


        this.compiled = false;

    }

}