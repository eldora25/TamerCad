export interface MaterialPhysical {


    density:number;


    hardness:number;


    strength:number;


}





export interface ElasticProperties {


    youngModulus:number;


    poissonRatio:number;


    shearModulus:number;


}





export interface PlasticProperties {


    yieldStrength:number;


    ultimateStrength:number;


    elongation:number;


}





export interface ThermalProperties {


    conductivity:number;


    expansion:number;


    heatCapacity:number;


}





export interface SurfaceProperties {


    friction:number;


    roughness:number;


    coating:string;


}





export interface ManufacturingProperties {


    machinability:number;


    welding:boolean;


    casting:boolean;


}





export interface MaterialDefinition {


    id:string;


    name:string;


    category:string;


    physical:MaterialPhysical;


    elastic:ElasticProperties;


    plastic:PlasticProperties;


    thermal:ThermalProperties;


    surface:SurfaceProperties;


    manufacturing:ManufacturingProperties;


}





export class BRepMaterial {



    materials:MaterialDefinition[];





    constructor(){


        this.materials=[];


    }





    /**
     * Material oluşturma
     */
    create(

        material:MaterialDefinition

    ){


        this.materials.push(

            material

        );


        return material;


    }





    /**
     * Material bulma
     */
    get(

        id:string

    ){


        return this.materials.find(

            m=>m.id===id

        );


    }





    /**
     * Yoğunluktan kütle hesabı
     */
    calculateMass(

        volume:number,

        material:MaterialDefinition

    ){



        return volume *

            material.physical.density;


    }





    /**
     * Elastik deformasyon hesabı
     */
    elasticDeformation(

        force:number,

        length:number,

        area:number,

        material:MaterialDefinition

    ){



        const stress=

            force / area;



        const strain=

            stress /

            material.elastic.youngModulus;



        return {


            stress,


            strain,


            displacement:

                strain * length


        };


    }





    /**
     * Plastik deformasyon kontrolü
     */
    plasticCheck(

        stress:number,

        material:MaterialDefinition

    ){



        return {


            plastic:

                stress >

                material.plastic.yieldStrength,


            safety:

                stress <

                material.plastic.ultimateStrength


        };


    }





    /**
     * Termal genişleme
     */
    thermalExpansion(

        length:number,

        deltaTemperature:number,

        material:MaterialDefinition

    ){



        return length *

            material.thermal.expansion *

            deltaTemperature;


    }





    /**
     * Sürtünme hesabı
     */
    frictionForce(

        normal:number,

        material:MaterialDefinition

    ){



        return normal *

            material.surface.friction;


    }





    /**
     * Malzeme kopyalama
     */
    clone(

        material:MaterialDefinition

    ){



        return JSON.parse(

            JSON.stringify(

                material

            )

        );


    }





    /**
     * Veritabanı bilgisi
     */
    database(){

        return [

            ...this.materials

        ];

    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepMaterial",


            materials:

                this.materials.length,


            status:

                "READY"


        };


    }


}