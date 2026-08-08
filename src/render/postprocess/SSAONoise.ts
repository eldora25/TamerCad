export interface SSAONoiseSample {

    x: number;

    y: number;

    z: number;

}

export class SSAONoise {

    private readonly size = 4;

    private samples: SSAONoiseSample[] = [];

    constructor() {

        this.generate();

    }

    private generate(): void {

        this.samples.length = 0;

        const count = this.size * this.size;

        for (let i = 0; i < count; i++) {

            this.samples.push({

                x: Math.random() * 2.0 - 1.0,

                y: Math.random() * 2.0 - 1.0,

                z: 0.0

            });

        }

    }

    getSize(): number {

        return this.size;

    }

    getSamples():

    readonly SSAONoiseSample[] {

        return this.samples;

    }

    getFlatArray():

    Float32Array {

        const array =

            new Float32Array(

                this.samples.length * 3

            );

        let ptr = 0;

        for (const sample of this.samples) {

            array[ptr++] = sample.x;

            array[ptr++] = sample.y;

            array[ptr++] = sample.z;

        }

        return array;

    }

    regenerate(): void {

        this.generate();

    }

    debugInfo() {

        return {

            size: this.size,

            sampleCount:

                this.samples.length

        };

    }

}