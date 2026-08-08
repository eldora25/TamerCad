import { Point3 } from "../geometry/primitives/Point3";

export enum ProjectionType {

    Perspective = "Perspective",

    Orthographic = "Orthographic"

}

export class RenderCamera {

    public projection: ProjectionType =
        ProjectionType.Perspective;

    public position: Point3 =
        new Point3(0, 0, 10);

    public target: Point3 =
        new Point3(0, 0, 0);

    public up: Point3 =
        new Point3(0, 1, 0);

    /**
     * Perspective parameters
     */
    public fov = 45;

    public near = 0.01;

    public far = 100000;

    /**
     * Orthographic size
     */
    public orthoHeight = 10;

    public aspect = 1.0;

    constructor() {}

    setPerspective(

        fov: number,

        aspect: number,

        near: number,

        far: number

    ): void {

        this.projection =
            ProjectionType.Perspective;

        this.fov = fov;

        this.aspect = aspect;

        this.near = near;

        this.far = far;

    }

    setOrthographic(

        height: number,

        aspect: number,

        near: number,

        far: number

    ): void {

        this.projection =
            ProjectionType.Orthographic;

        this.orthoHeight = height;

        this.aspect = aspect;

        this.near = near;

        this.far = far;

    }

    lookAt(

        eye: Point3,

        target: Point3,

        up: Point3 = new Point3(0, 1, 0)

    ): void {

        this.position = eye;

        this.target = target;

        this.up = up;

    }

    translate(

        dx: number,

        dy: number,

        dz: number

    ): void {

        this.position = new Point3(

            this.position.x + dx,

            this.position.y + dy,

            this.position.z + dz

        );

        this.target = new Point3(

            this.target.x + dx,

            this.target.y + dy,

            this.target.z + dz

        );

    }

    zoom(

        factor: number

    ): void {

        if (

            this.projection ===

            ProjectionType.Perspective

        ) {

            const dir = new Point3(

                this.target.x - this.position.x,

                this.target.y - this.position.y,

                this.target.z - this.position.z

            );

            this.position = new Point3(

                this.position.x + dir.x * factor,

                this.position.y + dir.y * factor,

                this.position.z + dir.z * factor

            );

        }

        else {

            this.orthoHeight *= factor;

        }

    }

    getViewMatrix(): number[] {

        /**
         * Placeholder.
         * Daha sonra Matrix4 sınıfı
         * ile üretilecek.
         */

        return [

            1,0,0,0,

            0,1,0,0,

            0,0,1,0,

            0,0,0,1

        ];

    }

    getProjectionMatrix(): number[] {

        /**
         * Placeholder.
         * Matrix4 eklendiğinde
         * gerçek hesap yapılacak.
         */

        return [

            1,0,0,0,

            0,1,0,0,

            0,0,1,0,

            0,0,0,1

        ];

    }

    clone(): RenderCamera {

        const camera =

            new RenderCamera();

        camera.projection =
            this.projection;

        camera.position =
            new Point3(

                this.position.x,

                this.position.y,

                this.position.z

            );

        camera.target =
            new Point3(

                this.target.x,

                this.target.y,

                this.target.z

            );

        camera.up =
            new Point3(

                this.up.x,

                this.up.y,

                this.up.z

            );

        camera.fov =
            this.fov;

        camera.aspect =
            this.aspect;

        camera.near =
            this.near;

        camera.far =
            this.far;

        camera.orthoHeight =
            this.orthoHeight;

        return camera;

    }

}