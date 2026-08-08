import { Vector3 } from "../vector/Vector3";
import { Matrix4 } from "../matrix/Matrix4";


export class Transform {


    public position: Vector3;

    public rotation: Vector3;

    public scale: Vector3;



    constructor() {

        this.position = new Vector3(
            0,
            0,
            0
        );


        this.rotation = new Vector3(
            0,
            0,
            0
        );


        this.scale = new Vector3(
            1,
            1,
            1
        );
    }



    setPosition(
        position: Vector3
    ): Transform {

        this.position = position;

        return this;
    }



    setRotation(
        rotation: Vector3
    ): Transform {

        this.rotation = rotation;

        return this;
    }



    setScale(
        scale: Vector3
    ): Transform {

        this.scale = scale;

        return this;
    }



    translate(
        offset: Vector3
    ): Transform {


        this.position =
            this.position.add(offset);


        return this;
    }



    rotate(
        rotation: Vector3
    ):Transform {


        this.rotation =
            this.rotation.add(rotation);


        return this;
    }



    resize(
        scale: Vector3
    ):Transform {


        this.scale =
            this.scale.multiply(
                scale.x
            );


        this.scale.y *= scale.y;
        this.scale.z *= scale.z;


        return this;
    }



    getMatrix(): Matrix4 {


        const translation =
            Matrix4.translation(
                this.position.x,
                this.position.y,
                this.position.z
            );


        const scaling =
            Matrix4.scale(
                this.scale.x,
                this.scale.y,
                this.scale.z
            );



        /*
            Rotation matrix
            Euler XYZ
        */


        const rx =
            this.rotation.x;


        const ry =
            this.rotation.y;


        const rz =
            this.rotation.z;



        const cx =
            Math.cos(rx);

        const sx =
            Math.sin(rx);


        const cy =
            Math.cos(ry);

        const sy =
            Math.sin(ry);


        const cz =
            Math.cos(rz);

        const sz =
            Math.sin(rz);



        const rotation =
            new Matrix4([

                cy*cz,
                -cy*sz,
                sy,
                0,


                sx*sy*cz+cx*sz,
                -sx*sy*sz+cx*cz,
                -sx*cy,
                0,


                -cx*sy*cz+sx*sz,
                cx*sy*sz+sx*cz,
                cx*cy,
                0,


                0,
                0,
                0,
                1

            ]);



        return translation
            .multiply(rotation)
            .multiply(scaling);

    }



    clone():Transform {


        const t =
            new Transform();


        t.position =
            new Vector3(
                this.position.x,
                this.position.y,
                this.position.z
            );


        t.rotation =
            new Vector3(
                this.rotation.x,
                this.rotation.y,
                this.rotation.z
            );


        t.scale =
            new Vector3(
                this.scale.x,
                this.scale.y,
                this.scale.z
            );


        return t;
    }


}