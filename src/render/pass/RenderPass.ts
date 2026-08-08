import { RenderContext } from "../RenderContext";
import { RenderScene } from "../RenderScene";
import { RenderCamera } from "../RenderCamera";

export interface RenderPassOptions {

    enabled?: boolean;

    priority?: number;

    clearColor?: boolean;

    clearDepth?: boolean;

    clearStencil?: boolean;

    name?: string;

}

export abstract class RenderPass {

    public readonly name: string;

    public enabled = true;

    public priority = 0;

    public clearColor = false;

    public clearDepth = false;

    public clearStencil = false;

    protected initialized = false;

    constructor(
        options: RenderPassOptions = {}
    ) {

        this.name =
            options.name ??
            this.constructor.name;

        if (options.enabled !== undefined) {
            this.enabled = options.enabled;
        }

        if (options.priority !== undefined) {
            this.priority = options.priority;
        }

        if (options.clearColor !== undefined) {
            this.clearColor = options.clearColor;
        }

        if (options.clearDepth !== undefined) {
            this.clearDepth = options.clearDepth;
        }

        if (options.clearStencil !== undefined) {
            this.clearStencil = options.clearStencil;
        }

    }

    initialize(
        context: RenderContext
    ): void {

        if (this.initialized) {
            return;
        }

        this.onInitialize(context);

        this.initialized = true;

    }

    dispose(
        context: RenderContext
    ): void {

        if (!this.initialized) {
            return;
        }

        this.onDispose(context);

        this.initialized = false;

    }

    render(
        context: RenderContext,
        scene: RenderScene,
        camera: RenderCamera
    ): void {

        if (!this.enabled) {
            return;
        }

        this.begin(context);

        this.execute(
            context,
            scene,
            camera
        );

        this.end(context);

    }

    protected begin(
        context: RenderContext
    ): void {

        if (
            this.clearColor ||
            this.clearDepth ||
            this.clearStencil
        ) {

            context.clear?.({

                color: this.clearColor,

                depth: this.clearDepth,

                stencil: this.clearStencil

            });

        }

    }

    protected end(
        context: RenderContext
    ): void {
        // override if necessary
    }

    protected onInitialize(
        context: RenderContext
    ): void {
        // optional
    }

    protected onDispose(
        context: RenderContext
    ): void {
        // optional
    }

    protected abstract execute(
        context: RenderContext,
        scene: RenderScene,
        camera: RenderCamera
    ): void;

}