import { Point3 } from "../primitives/Point3";

export class MeshVertex {

    /**
     * Vertex unique identifier
     */
    public readonly id: number;

    /**
     * Position
     */
    public position: Point3;

    /**
     * Optional normal index
     */
    public normalIndex: number | null = null;

    /**
     * Optional texture coordinate index
     */
    public uvIndex: number | null = null;

    /**
     * Optional vertex color
     */
    public color?: {

        r: number;

        g: number;

        b: number;

        a: number;

    };

    constructor(

        id: number,

        position: Point3

    ) {

        this.id = id;

        this.position = position;

    }

    clone(): MeshVertex {

        const v = new MeshVertex(

            this.id,

            new Point3(

                this.position.x,

                this.position.y,

                this.position.z

            )

        );

        v.normalIndex = this.normalIndex;

        v.uvIndex = this.uvIndex;

        if (this.color) {

            v.color = {

                ...this.color

            };

        }

        return v;

    }

    equals(

        other: MeshVertex,

        tolerance = 1e-9

    ): boolean {

        return (

            Math.abs(

                this.position.x - other.position.x

            ) <= tolerance &&

            Math.abs(

                this.position.y - other.position.y

            ) <= tolerance &&

            Math.abs(

                this.position.z - other.position.z

            ) <= tolerance

        );

    }

    distanceTo(

        other: MeshVertex

    ): number {

        const dx =

            this.position.x - other.position.x;

        const dy =

            this.position.y - other.position.y;

        const dz =

            this.position.z - other.position.z;

        return Math.sqrt(

            dx * dx +

            dy * dy +

            dz * dz

        );

    }

    toJSON() {

        return {

            id: this.id,

            x: this.position.x,

            y: this.position.y,

            z: this.position.z,

            normalIndex: this.normalIndex,

            uvIndex: this.uvIndex,

            color: this.color

        };

    }

    static fromJSON(

        data: any

    ): MeshVertex {

        const vertex =

            new MeshVertex(

                data.id,

                new Point3(

                    data.x,

                    data.y,

                    data.z

                )

            );

        vertex.normalIndex =

            data.normalIndex ?? null;

        vertex.uvIndex =

            data.uvIndex ?? null;

        vertex.color =

            data.color;

        return vertex;

    }

}