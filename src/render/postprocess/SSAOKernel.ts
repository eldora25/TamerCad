export interface SSAOKernelSample {

    x: number;

    y: number;

    z: number;

}

export class SSAOKernel {

    private samples:

        SSAOKernelSample[] = [];

    constructor(

        sampleCount = 64

    ) {

        this.generate(

            sampleCount

        );

    }

    generate(

        sampleCount: number

    ): void {

        this.samples.length = 0;

        for (

            let i = 0;

            i < sampleCount;

            i++

        ) {

            let x =
                Math.random() * 2 - 1;

            let y =
                Math.random() * 2 - 1;

            let z =
                Math.random();

            let length =

                Math.sqrt(

                    x * x +

                    y * y +

                    z * z

                );

            if (length > 0.00001) {

                x /= length;

                y /= length;

                z /= length;

            }

            const scale =

                i / sampleCount;

            const lerp =

                this.lerp(

                    0.1,

                    1.0,

                    scale * scale

                );

            this.samples.push({

                x: x * lerp,

                y: y * lerp,

                z: z * lerp

            });

        }

    }

    getSamples():

    readonly SSAOKernelSample[] {

        return this.samples;

    }

    getFlatArray():

    Float32Array {

        const data =

            new Float32Array(

                this.samples.length * 3

            );

        let ptr = 0;

        for (

            const sample of

            this.samples

        ) {

            data[ptr++] = sample.x;

            data[ptr++] = sample.y;

            data[ptr++] = sample.z;

        }

        return data;

    }

    private lerp(

        a: number,

        b: number,

        t: number

    ): number {

        return a + (b - a) * t;

    }

    debugInfo() {

        return {

            sampleCount:

                this.samples.length

        };

    }

}