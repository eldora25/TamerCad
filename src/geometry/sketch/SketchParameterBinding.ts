import { BRepParameter } from "../brep/parametric/BRepParameter";

export type BindingDirection =
    | "parameter-to-sketch"
    | "sketch-to-parameter"
    | "bidirectional";

export interface SketchParameterBindingOptions {

    parameter: BRepParameter;

    target: object;

    property: string;

    direction?: BindingDirection;

}

export class SketchParameterBinding {

    readonly parameter: BRepParameter;

    readonly target: object;

    readonly property: string;

    readonly direction: BindingDirection;

    enabled: boolean = true;

    constructor(options: SketchParameterBindingOptions) {

        this.parameter = options.parameter;
        this.target = options.target;
        this.property = options.property;
        this.direction =
            options.direction ?? "bidirectional";

    }

    syncParameterToSketch(): void {

        if (!this.enabled) return;

        (this.target as any)[this.property] =
            this.parameter.value;

    }

    syncSketchToParameter(): void {

        if (!this.enabled) return;

        this.parameter.setValue(
            (this.target as any)[this.property]
        );

        this.parameter.clearDirty();

    }

    synchronize(): void {

        switch (this.direction) {

            case "parameter-to-sketch":

                this.syncParameterToSketch();
                break;

            case "sketch-to-parameter":

                this.syncSketchToParameter();
                break;

            case "bidirectional":

                if (this.parameter.dirty) {

                    this.syncParameterToSketch();

                } else {

                    this.syncSketchToParameter();

                }

                break;

        }

    }

    validate(): boolean {

        return this.property in this.target;

    }

    enable(): void {

        this.enabled = true;

    }

    disable(): void {

        this.enabled = false;

    }

    info() {

        return {

            engine: "SketchParameterBinding",

            parameter: this.parameter.id,

            property: this.property,

            direction: this.direction,

            enabled: this.enabled

        };

    }

}