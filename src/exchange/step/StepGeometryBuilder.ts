import { BRepModel }
from "../../topology/brep/BRepModel";

import {
    CartesianPoint,
    Direction,
    Vector,
    Line,
    Circle,
    Plane,
    VertexPoint,
    EdgeCurve,
    AdvancedFace,
    ClosedShell,
    ManifoldSolidBrep,
    StepEntity
}
from "./StepEntity";

import { Point3 }
from "../../geometry/primitives/Point3";



export class StepGeometryBuilder {

    private points =

    new Map<number, Point3>();



    constructor(

        private readonly model:

        BRepModel =

        new BRepModel()

    ) {}



    build(

        entities:

        StepEntity[]

    ):

    BRepModel {

        for (

            const entity of entities

        ) {

            this.dispatch(

                entity

            );

        }

        return this.model;

    }



    private dispatch(

        entity:

        StepEntity

    ): void {

        switch (

            entity.type

        ) {

            case "CARTESIAN_POINT":

                this.buildPoint(

                    entity as CartesianPoint

                );

                break;



            case "DIRECTION":

                this.buildDirection(

                    entity as Direction

                );

                break;



            case "VECTOR":

                this.buildVector(

                    entity as Vector

                );

                break;



            case "LINE":

                this.buildLine(

                    entity as Line

                );

                break;



            case "CIRCLE":

                this.buildCircle(

                    entity as Circle

                );

                break;



            case "PLANE":

                this.buildPlane(

                    entity as Plane

                );

                break;



            case "VERTEX_POINT":

                this.buildVertex(

                    entity as VertexPoint

                );

                break;



            case "EDGE_CURVE":

                this.buildEdge(

                    entity as EdgeCurve

                );

                break;



            case "ADVANCED_FACE":

                this.buildFace(

                    entity as AdvancedFace

                );

                break;



            case "CLOSED_SHELL":

                this.buildShell(

                    entity as ClosedShell

                );

                break;



            case "MANIFOLD_SOLID_BREP":

                this.buildSolid(

                    entity as ManifoldSolidBrep

                );

                break;

        }

    }



    private buildPoint(

        entity:

        CartesianPoint

    ): void {

        this.points.set(

            entity.id,

            new Point3(

                entity.x,

                entity.y,

                entity.z

            )

        );

    }



    private buildDirection(

        entity:

        Direction

    ): void {

        // TODO

    }



    private buildVector(

        entity:

        Vector

    ): void {

        // TODO

    }



    private buildLine(

        entity:

        Line

    ): void {

        // TODO

    }



    private buildCircle(

        entity:

        Circle

    ): void {

        // TODO

    }



    private buildPlane(

        entity:

        Plane

    ): void {

        // TODO

    }