export enum RenderGraphResourceType {

    Texture = "Texture",

    Buffer = "Buffer",

    Attachment = "Attachment",

    Depth = "Depth"

}

export enum RenderGraphResourceState {

    Undefined = "Undefined",

    Read = "Read",

    Write = "Write",

    ReadWrite = "ReadWrite"

}

export interface RenderGraphResourceDescriptor {

    width?: number;

    height?: number;

    layers?: number;

    mipLevels?: number;

    format?: string;

    samples?: number;

}

export class RenderGraphResource {

    public readonly name: string;

    public readonly type: RenderGraphResourceType;

    public readonly descriptor: RenderGraphResourceDescriptor;

    public state: RenderGraphResourceState =

        RenderGraphResourceState.Undefined;

    private producer: string | null = null;

    private consumers: string[] = [];

    constructor(

        name: string,

        type: RenderGraphResourceType,

        descriptor: RenderGraphResourceDescriptor = {}

    ) {

        this.name = name;

        this.type = type;

        this.descriptor = descriptor;

    }

    public setProducer(

        passName: string

    ): void {

        this.producer = passName;

    }

    public getProducer():

    string | null {

        return this.producer;

    }

    public addConsumer(

        passName: string

    ): void {

        if (

            !this.consumers.includes(passName)

        ) {

            this.consumers.push(passName);

        }

    }

    public getConsumers():

    readonly string[] {

        return this.consumers;

    }

    public clearUsage(): void {

        this.producer = null;

        this.consumers.length = 0;

        this.state =

            RenderGraphResourceState.Undefined;

    }

    public debugInfo() {

        return {

            name: this.name,

            type: this.type,

            state: this.state,

            producer: this.producer,

            consumers: [...this.consumers],

            descriptor: this.descriptor

        };

    }

}