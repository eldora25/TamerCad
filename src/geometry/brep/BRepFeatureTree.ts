import {
    BRepFeature,
    FeatureState
}
from "./BRepFeature";



export interface FeatureTreeNode {


    feature:BRepFeature;


    index:number;


    suppressed:boolean;


    children:FeatureTreeNode[];

}





export interface RegenerationResult {


    success:boolean;


    regenerated:number;


    failed:string[];

}





export class BRepFeatureTree {



    root:BRepFeature|null;


    nodes:FeatureTreeNode[];




    constructor(){


        this.root =
            null;


        this.nodes =
            [];

    }





    /**
     * Root feature oluşturma
     */
    setRoot(

        feature:BRepFeature

    ){


        this.root =
            feature;



        this.add(feature);

    }





    /**
     * Feature ekleme
     */
    add(

        feature:BRepFeature

    ):FeatureTreeNode {



        const node:FeatureTreeNode = {


            feature,


            index:

                this.nodes.length,


            suppressed:false,


            children:[]

        };



        this.nodes.push(node);



        return node;

    }





    /**
     * Parent-child bağlantısı
     */
    link(

        parent:BRepFeature,

        child:BRepFeature

    ){



        child.addParent(

            parent

        );

    }





    /**
     * Timeline sırası
     */
    timeline(){


        return this.nodes.map(

            node =>

            node.feature

        );

    }





    /**
     * Feature bulma
     */
    find(

        id:string

    ):BRepFeature|null {



        const node =

            this.nodes.find(

                n =>

                n.feature.id === id

            );



        return node
            ?
            node.feature
            :
            null;

    }





    /**
     * Suppress feature
     */
    suppress(

        id:string

    ){


        const node =

            this.nodes.find(

                n =>

                n.feature.id === id

            );



        if(node){

            node.suppressed =
                true;


            node.feature.state =
                FeatureState.OUTDATED;

        }

    }





    /**
     * Unsuppress
     */
    unsuppress(

        id:string

    ){


        const node =

            this.nodes.find(

                n =>

                n.feature.id === id

            );



        if(node){

            node.suppressed =
                false;

        }

    }





    /**
     * Rollback
     *
     * Belirli feature sonrası dur
     */
    rollback(

        index:number

    ){



        for(

            let i=index+1;

            i<this.nodes.length;

            i++

        ){


            this.nodes[i]
                .feature.state =

                FeatureState.OUTDATED;


        }

    }





    /**
     * Regeneration sırası
     */
    regenerate():RegenerationResult {



        let regenerated = 0;


        const failed:string[] = [];



        for(

            const node of this.nodes

        ){



            if(

                node.suppressed

            ){

                continue;

            }



            const result =

                node.feature.execute();



            if(result.success){


                regenerated++;

            }

            else{


                failed.push(

                    node.feature.id

                );

            }


        }



        return {


            success:

                failed.length===0,


            regenerated,


            failed

        };

    }





    /**
     * Dependency sıralaması
     */
    dependencyOrder(){


        return [

            ...this.nodes

        ].sort(

            (a,b)=>

            a.index-b.index

        );

    }





    /**
     * Tree görüntüsü
     */
    structure(){


        return this.nodes.map(

            node =>

            ({


                id:

                node.feature.id,


                name:

                node.feature.name,


                type:

                node.feature.type,


                suppressed:

                node.suppressed


            })

        );

    }





    /**
     * Feature sayısı
     */
    count(){


        return this.nodes.length;

    }





    /**
     * Clone
     */
    clone(){


        const tree =
            new BRepFeatureTree();



        for(

            const node of this.nodes

        ){


            tree.add(

                node.feature.clone()

            );

        }



        return tree;

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:

                "BRepFeatureTree",


            status:

                "READY"

        };

    }


}