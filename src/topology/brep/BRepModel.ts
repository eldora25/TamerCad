import { Solid }
from "../core/Solid";


import { Face }
from "../core/Face";


import { Edge }
from "../core/Edge";


import { Vertex }
from "../core/Vertex";







export interface BRepModelInfo {


    name?:string;


    createdAt?:Date;


}







export class BRepModel {



    private solids:

    Solid[] = [];





    private activeSolid:

    Solid|null = null;





    public info:

    BRepModelInfo;







    constructor(

        info:BRepModelInfo = {}

    ){



        this.info = {


            createdAt:

            new Date(),


            ...info

        };

    }









    addSolid(

        solid:Solid

    ):

    void {



        if(

            !this.solids.includes(

                solid

            )

        ){



            this.solids.push(

                solid

            );



            this.activeSolid =

            solid;

        }

    }









    removeSolid(

        solid:Solid

    ):

    boolean {



        const index =

        this.solids.indexOf(

            solid

        );





        if(

            index === -1

        ){

            return false;

        }





        this.solids.splice(

            index,

            1

        );





        if(

            this.activeSolid === solid

        ){



            this.activeSolid =

            this.solids.length > 0

            ?

            this.solids[

                this.solids.length - 1

            ]

            :

            null;

        }





        return true;

    }









    findSolid(

        predicate:

        (

            solid:Solid

        )=>boolean

    ):

    Solid|undefined {



        return this.solids.find(

            predicate

        );

    }









    getSolids():

    Solid[] {



        return [

            ...this.solids

        ];

    }









    getActiveSolid():

    Solid|null {



        return this.activeSolid;

    }









    setActiveSolid(

        solid:Solid

    ):

    boolean {



        if(

            !this.solids.includes(

                solid

            )

        ){

            return false;

        }





        this.activeSolid =

        solid;



        return true;

    }









    getFaces():

    Face[] {



        const faces:

        Face[] = [];





        for(

            const solid of

            this.solids

        ){



            for(

                const face of

                solid.getFaces()

            ){



                if(

                    !faces.includes(

                        face

                    )

                ){



                    faces.push(

                        face

                    );

                }

            }

        }





        return faces;

    }









    getEdges():

    Edge[] {



        const edges:

        Edge[] = [];





        for(

            const solid of

            this.solids

        ){



            for(

                const edge of

                solid.getEdges()

            ){



                if(

                    !edges.some(

                        e =>

                        e.equals(

                            edge

                        )

                    )

                ){



                    edges.push(

                        edge

                    );

                }

            }

        }





        return edges;

    }









    getVertices():

    Vertex[] {



        const vertices:

        Vertex[] = [];





        for(

            const solid of

            this.solids

        ){



            for(

                const vertex of

                solid.getVertices()

            ){



                if(

                    !vertices.includes(

                        vertex

                    )

                ){



                    vertices.push(

                        vertex

                    );

                }

            }

        }





        return vertices;

    }









    clear():

    void {



        this.solids = [];



        this.activeSolid =

        null;

    }









    isEmpty():

    boolean {



        return (

            this.solids.length === 0

        );

    }









    solidCount():

    number {



        return this.solids.length;

    }









    clone():

    BRepModel {



        const model =

        new BRepModel(

            {

                ...this.info

            }

        );





        for(

            const solid of

            this.solids

        ){



            model.addSolid(

                solid.clone()

            );

        }





        if(

            this.activeSolid

        ){



            const index =

            this.solids.indexOf(

                this.activeSolid

            );





            if(

                index >= 0

            ){



                model.activeSolid =

                model.solids[index];

            }

        }





        return model;

    }









    validate():

    boolean {



        if(

            this.solids.length === 0

        ){

            return false;

        }





        return this.solids

        .every(

            solid =>

            solid.isValid()

        );

    }



}