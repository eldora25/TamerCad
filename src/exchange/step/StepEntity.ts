export interface StepEntity {

    id: number;

    type: string;

}






export class CartesianPoint

implements StepEntity {

    readonly type =

    "CARTESIAN_POINT";



    constructor(

        public id:number,

        public name:string,

        public x:number,

        public y:number,

        public z:number

    ){}

}






export class Direction

implements StepEntity {

    readonly type =

    "DIRECTION";



    constructor(

        public id:number,

        public name:string,

        public x:number,

        public y:number,

        public z:number

    ){}

}






export class Vector

implements StepEntity {

    readonly type =

    "VECTOR";



    constructor(

        public id:number,

        public name:string,

        public direction:number,

        public magnitude:number

    ){}

}






export class Axis2Placement3D

implements StepEntity {

    readonly type =

    "AXIS2_PLACEMENT_3D";



    constructor(

        public id:number,

        public name:string,

        public location:number,

        public axis:number,

        public refDirection:number

    ){}

}






export class Line

implements StepEntity {

    readonly type =

    "LINE";



    constructor(

        public id:number,

        public name:string,

        public point:number,

        public vector:number

    ){}

}






export class Circle

implements StepEntity {

    readonly type =

    "CIRCLE";



    constructor(

        public id:number,

        public name:string,

        public placement:number,

        public radius:number

    ){}

}






export class Plane

implements StepEntity {

    readonly type =

    "PLANE";



    constructor(

        public id:number,

        public name:string,

        public placement:number

    ){}

}






export class VertexPoint

implements StepEntity {

    readonly type =

    "VERTEX_POINT";



    constructor(

        public id:number,

        public name:string,

        public point:number

    ){}

}






export class EdgeCurve

implements StepEntity {

    readonly type =

    "EDGE_CURVE";



    constructor(

        public id:number,

        public edgeStart:number,

        public edgeEnd:number,

        public curve:number,

        public sameSense:boolean

    ){}

}






export class OrientedEdge

implements StepEntity {

    readonly type =

    "ORIENTED_EDGE";



    constructor(

        public id:number,

        public edgeElement:number,

        public orientation:boolean

    ){}

}






export class EdgeLoop

implements StepEntity {

    readonly type =

    "EDGE_LOOP";



    constructor(

        public id:number,

        public edges:number[]

    ){}

}






export class FaceBound

implements StepEntity {

    readonly type =

    "FACE_BOUND";



    constructor(

        public id:number,

        public loop:number,

        public orientation:boolean

    ){}

}






export class AdvancedFace

implements StepEntity {

    readonly type =

    "ADVANCED_FACE";



    constructor(

        public id:number,

        public bounds:number[],

        public surface:number,

        public sameSense:boolean

    ){}

}






export class ClosedShell

implements StepEntity {

    readonly type =

    "CLOSED_SHELL";



    constructor(

        public id:number,

        public faces:number[]

    ){}

}






export class ManifoldSolidBrep

implements StepEntity {

    readonly type =

    "MANIFOLD_SOLID_BREP";



    constructor(

        public id:number,

        public name:string,

        public shell:number

    ){}

}