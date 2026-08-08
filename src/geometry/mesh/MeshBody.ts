import { Mesh } from "./Mesh";

export class MeshBody {

    /**
     * Unique body identifier
     */
    public readonly id: string;

    /**
     * Display name
     */
    public name: string;

    /**
     * Geometry
     */
    public readonly mesh: Mesh;

    /**
     * Visibility
     */
    public visible = true;

    /**
     * Lock state
     */
    public locked = false;

    /**
     * Selection state
     */
    public selected = false;

    /**
     * Transform matrix (4x4 column-major)
     */
    public transform: number[] = [

        1, 0, 0, 0,

        0, 1, 0, 0,

        0, 0, 1, 0,

        0, 0, 0, 1

    ];

    /**
     * Arbitrary metadata
     */
    public metadata: Record<string, any> = {};

    constructor(

        mesh: Mesh,

        name = "MeshBody"

    ) {

        this.mesh = mesh;

        this.name = name;

        this.id = MeshBody.generateId();

    }

    getVertexCount(): number {

        return this.mesh.vertexCount();

    }

    getTriangleCount(): number {

        return this.mesh.triangleCount();

    }

    getSurfaceArea(): number {

        return this.mesh.computeSurfaceArea();

    }

    getBoundingBox() {

        return this.mesh.getBoundingBox();

    }

    clone(): MeshBody {

        const body = new MeshBody(

            this.mesh.clone(),

            this.name

        );

        body.visible = this.visible;

        body.locked = this.locked;

        body.selected = this.selected;

        body.transform = [

            ...this.transform

        ];

        body.metadata = {

            ...this.metadata

        };

        return body;

    }

    toJSON() {

        return {

            id: this.id,

            name: this.name,

            visible: this.visible,

            locked: this.locked,

            selected: this.selected,

            transform: this.transform,

            metadata: this.metadata,

            mesh: this.mesh.toJSON()

        };

    }

    static fromJSON(

        data: any

    ): MeshBody {

        const body = new MeshBody(

            Mesh.fromJSON(

                data.mesh

            ),

            data.name

        );

        body.visible =

            data.visible;

        body.locked =

            data.locked;

        body.selected =

            data.selected;

        body.transform =

            [...data.transform];

        body.metadata =

            data.metadata ?? {};

        return body;

    }

    private static generateId(): string {

        return `mesh_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;

    }

}