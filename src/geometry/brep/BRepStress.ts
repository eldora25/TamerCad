import {
    BRepSolid
}
from "./BRepSolid";


import {
    MaterialDefinition
}
from "./BRepMaterial";





export interface Vector3 {


    x:number;


    y:number;


    z:number;


}





export interface StressTensor {


    xx:number;


    yy:number;


    zz:number;


    xy:number;


    yz:number;


    zx:number;


}





export interface StrainTensor {


    xx:number;


    yy:number;


    zz:number;


    xy:number;


    yz:number;


    zx:number;


}





export interface LoadCase {


    id:string;


    name:string;


    force:Vector3;


    pressure:number;


    moment:Vector3;


}





export interface StressResult {


    success:boolean;


    maxStress:number;


    vonMises:number;


    safetyFactor:number;


}





export class BRepStress {



    solid:BRepSolid|null;


    material:MaterialDefinition|null;


    loads:LoadCase[];


    stress:StressTensor;


    strain:StrainTensor;



    constructor(){


        this.solid=null;


        this.material=null;


        this.loads=[];


        this.stress={


            xx:0,


            yy:0,


            zz:0,


            xy:0,


            yz:0,


            zx:0


        };



        this.strain={


            xx:0,


            yy:0,


            zz:0,


            xy:0,


            yz:0,


            zx:0


        };


    }





    /**
     * Model yükleme
     */
    load(

        solid:BRepSolid,

        material:MaterialDefinition

    ){


        this.solid=

            solid;


        this.material=

            material;


    }





    /**
     * Load case ekleme
     */
    addLoad(

        load:LoadCase

    ){


        this.loads.push(

            load

        );


    }





    /**
     * Stress çözümü
     */
    solve():StressResult {



        this.calculateStress();


        this.calculateStrain();



        const vm=

            this.vonMises();



        const factor=

            this.safetyFactor(

                vm

            );



        return {


            success:true,


            maxStress:

                this.maximumStress(),


            vonMises:

                vm,


            safetyFactor:

                factor


        };


    }





    /**
     * Gerilme hesabı
     */
    calculateStress(){



        if(

            !this.material

        )

            return;



        let force=0;



        for(

            const load of this.loads

        ){


            force +=

                Math.sqrt(

                    load.force.x *

                    load.force.x

                    +

                    load.force.y *

                    load.force.y

                    +

                    load.force.z *

                    load.force.z

                );


        }



        const area =

            1;



        const sigma=

            force /

            area;



        this.stress.xx=

            sigma;



    }





    /**
     * Elastik strain hesabı
     */
    calculateStrain(){



        if(

            !this.material

        )

            return;



        const E=

            this.material.elastic.youngModulus;



        this.strain.xx=

            this.stress.xx /

            E;


    }





    /**
     * Von Mises stress
     */
    vonMises(){



        const s=

            this.stress;



        return Math.sqrt(

            0.5 *

            (

                Math.pow(

                    s.xx-s.yy,

                    2

                )

                +

                Math.pow(

                    s.yy-s.zz,

                    2

                )

                +

                Math.pow(

                    s.zz-s.xx,

                    2

                )

                +

                6 *

                (

                    Math.pow(

                        s.xy,

                        2

                    )

                    +

                    Math.pow(

                        s.yz,

                        2

                    )

                    +

                    Math.pow(

                        s.zx,

                        2

                    )

                )

            )

        );


    }





    /**
     * Maximum stress
     */
    maximumStress(){


        return Math.max(

            Math.abs(

                this.stress.xx

            ),


            Math.abs(

                this.stress.yy

            ),


            Math.abs(

                this.stress.zz

            )

        );


    }





    /**
     * Safety factor
     */
    safetyFactor(

        stress:number

    ){



        if(

            !this.material

        )

            return 0;



        return (

            this.material.plastic.yieldStrength

        )

        /

        stress;


    }





    /**
     * Failure kontrolü
     */
    checkFailure(){



        const vm=

            this.vonMises();



        if(

            !this.material

        )

            return false;



        return (

            vm >

            this.material.plastic.yieldStrength

        );


    }





    /**
     * FEM mesh hazırlığı
     */
    prepareFEM(){



        return {


            nodes:0,


            elements:0,


            ready:true


        };


    }





    /**
     * Reset
     */
    reset(){



        this.loads=[];


        this.stress={


            xx:0,

            yy:0,

            zz:0,

            xy:0,

            yz:0,

            zx:0

        };


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepStress",


            loads:

                this.loads.length,


            status:

                "READY"


        };


    }


}