
import {

    BRepFeature,

    BRepFeatureType

}

from "./BRepFeature";





export interface RebuildContext {


    feature:BRepFeature;


    dependencies:BRepFeature[];


    parameters:any;


}





export interface RebuildResult {


    success:boolean;


    featureId:string;


    geometry:any;


    errors:string[];


}





export interface GeneratedGeometry {


    type:string;


    data:any;


}





export class BRepFeatureRebuild {



    cache:Map<string,GeneratedGeometry>;


    rebuildHistory:RebuildResult[];


    tolerance:number;





    constructor(){



        this.cache=

            new Map();



        this.rebuildHistory=[];



        this.tolerance=

            0.001;


    }





    /**
     * Feature değerlendirme
     */
    evaluateFeature(

        feature:BRepFeature

    ){



        return {


            id:

                feature.id,


            type:

                feature.type,


            parameters:

                feature.parameters


        };


    }





    /**
     * Sketch rebuild
     */
    rebuildSketch(

        context:RebuildContext

    ):GeneratedGeometry {



        return {


            type:

                "SKETCH_GEOMETRY",


            data:{


                entities:

                    context.feature.parameters


            }


        };


    }





    /**
     * Extrude rebuild
     */
    rebuildExtrude(

        context:RebuildContext

    ):GeneratedGeometry {



        const length=

            context.feature.parameters.find(

                p=>

                p.name==="length"

            );



        return {


            type:

                "SOLID",


            data:{


                operation:

                    "EXTRUDE",


                length:

                    length?.value


            }


        };


    }





    /**
     * Hole rebuild
     */
    rebuildHole(

        context:RebuildContext

    ):GeneratedGeometry {



        return {


            type:

                "SOLID",


            data:{


                operation:

                    "HOLE",


                parameters:

                    context.parameters


            }


        };


    }





    /**
     * Fillet rebuild
     */
    rebuildFillet(

        context:RebuildContext

    ):GeneratedGeometry {



        return {


            type:

                "SOLID",


            data:{


                operation:

                    "FILLET",


                radius:

                    context.parameters.radius


            }


        };


    }





    /**
     * Chamfer rebuild
     */
    rebuildChamfer(

        context:RebuildContext

    ):GeneratedGeometry {



        return {


            type:

                "SOLID",


            data:{


                operation:

                    "CHAMFER",


                distance:

                    context.parameters.distance


            }


        };


    }





    /**
     * Pattern rebuild
     */
    rebuildPattern(

        context:RebuildContext

    ):GeneratedGeometry {



        return {


            type:

                "SOLID",


            data:{


                operation:

                    "PATTERN",


                count:

                    context.parameters.count


            }


        };


    }





    /**
     * Operasyon seçici
     */
    executeFeature(

        context:RebuildContext

    ){



        switch(

            context.feature.type

        ){



            case "SKETCH":

                return this.rebuildSketch(

                    context

                );



            case "EXTRUDE":

                return this.rebuildExtrude(

                    context

                );



            case "HOLE":

                return this.rebuildHole(

                    context

                );



            case "FILLET":

                return this.rebuildFillet(

                    context

                );



            case "CHAMFER":

                return this.rebuildChamfer(

                    context

                );



            case "PATTERN":

                return this.rebuildPattern(

                    context

                );



            default:


                throw new Error(

                    "Unsupported feature"

                );


        }


    }





    /**
     * Dependency çözümü
     */
    resolveDependencies(

        feature:BRepFeature,

        allFeatures:BRepFeature[]

    ){



        return allFeatures.filter(

            f=>

            feature.dependencies.includes(

                f.id

            )

        );


    }





    /**
     * Tek feature rebuild
     */
    rebuild(

        feature:BRepFeature,

        allFeatures:BRepFeature[]

    ):RebuildResult {



        try{


            const dependencies=

                this.resolveDependencies(

                    feature,

                    allFeatures

                );



            const context={


                feature,


                dependencies,


                parameters:

                    Object.fromEntries(

                        feature.parameters.map(

                            p=>[

                                p.name,

                                p.value

                            ]

                        )

                    )


            };



            const geometry=

                this.executeFeature(

                    context

                );



            this.cache.set(

                feature.id,

                geometry

            );



            const result={


                success:true,


                featureId:

                    feature.id,


                geometry,


                errors:[]


            };



            this.rebuildHistory.push(

                result

            );



            return result;



        }

        catch(error){



            return {


                success:false,


                featureId:

                    feature.id,


                geometry:null,


                errors:[

                    String(error)

                ]


            };


        }


    }





    /**
     * Tüm feature tree rebuild
     */
    rebuildAll(

        features:BRepFeature[]

    ){



        return features.map(

            feature=>

            this.rebuild(

                feature,

                features

            )

        );


    }





    /**
     * Cache temizleme
     */
    invalidate(

        featureId:string

    ){



        this.cache.delete(

            featureId

        );


    }





    /**
     * Reset
     */
    reset(){


        this.cache.clear();


        this.rebuildHistory=[];


    }





    /**
     * Serialize
     */
    serialize(){



        return {


            cachedFeatures:

                this.cache.size,


            rebuilds:

                this.rebuildHistory.length


        };


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureRebuild",


            cache:

                this.cache.size,


            history:

                this.rebuildHistory.length


        };


    }


}