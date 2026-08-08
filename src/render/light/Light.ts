import { MaterialColor } from "../material/Material";


export enum LightType {

    Ambient = "Ambient",

    Directional = "Directional",

    Point = "Point",

    Spot = "Spot"

}



export interface LightColor {


    color:

        MaterialColor;


    intensity:

        number;

}



export class Light {


    public readonly id: string;


    public enabled = true;


    public color:

        MaterialColor = {


            r:1,

            g:1,

            b:1,

            a:1

        };


    public intensity = 1.0;



    constructor(

        public readonly type:

            LightType,


        name = "Light"

    ) {


        this.id =

            Light.generateId();


    }



    setColor(

        color:

            MaterialColor

    ):void {


        this.color = {


            ...color

        };

    }



    setIntensity(

        value:number

    ):void {


        this.intensity =

            Math.max(

                0,

                value

            );

    }



    enable():void {


        this.enabled = true;

    }



    disable():void {


        this.enabled = false;

    }



    isEnabled():

    boolean {


        return this.enabled;

    }



    getLightData(){

        return {


            id:

                this.id,


            type:

                this.type,


            color:

                this.color,


            intensity:

                this.intensity,


            enabled:

                this.enabled

        };

    }



    clone():

    Light {


        const light =

            new Light(

                this.type

            );


        light.color = {


            ...this.color

        };


        light.intensity =

            this.intensity;


        light.enabled =

            this.enabled;


        return light;

    }



    toJSON(){


        return {


            id:

                this.id,


            type:

                this.type,


            color:

                this.color,


            intensity:

                this.intensity,


            enabled:

                this.enabled

        };

    }



    static fromJSON(

        data:any

    ):Light {


        const light =

            new Light(

                data.type

            );


        light.color =

            data.color;


        light.intensity =

            data.intensity;


        light.enabled =

            data.enabled;


        return light;

    }



    private static generateId():

    string {


        return (

            "light_" +

            Date.now() +

            "_" +

            Math.floor(

                Math.random()*100000

            )

        );

    }

}