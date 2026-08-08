export class Vector3 {

    public x: number;
    public y: number;
    public z: number;


    constructor(
        x = 0,
        y = 0,
        z = 0
    ) {
        this.x = x;
        this.y = y;
        this.z = z;
    }


    add(v: Vector3): Vector3 {

        return new Vector3(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        );
    }


    subtract(v: Vector3): Vector3 {

        return new Vector3(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        );
    }


    multiply(scale:number): Vector3 {

        return new Vector3(
            this.x * scale,
            this.y * scale,
            this.z * scale
        );
    }


    dot(v:Vector3):number {

        return (
            this.x * v.x +
            this.y * v.y +
            this.z * v.z
        );
    }


    cross(v:Vector3):Vector3 {

        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }


    length():number {

        return Math.sqrt(
            this.x*this.x +
            this.y*this.y +
            this.z*this.z
        );
    }


    normalize():Vector3 {

        const len = this.length();

        if(len === 0)
            return new Vector3();


        return new Vector3(
            this.x / len,
            this.y / len,
            this.z / len
        );
    }
}