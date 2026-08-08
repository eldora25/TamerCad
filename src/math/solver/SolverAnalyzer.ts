import { LinearSystem } from "../linear/LinearSystem";
import { SparseLinearSystem } from "../sparse/SparseLinearSystem";

export interface SolverAnalysis {

    sparse: boolean;

    symmetric: boolean;

    spd: boolean;

    dimension: number;

    density: number;

}

export class SolverAnalyzer {

    static analyze(

        system:

        LinearSystem |

        SparseLinearSystem

    ): SolverAnalysis {

        return {

            sparse:

                this.isSparse(system),

            symmetric:

                this.isSymmetric(system),

            spd:

                this.isSPD(system),

            dimension:

                this.dimension(system),

            density:

                this.density(system)

        };

    }

    static isSparse(

        system:

        LinearSystem |

        SparseLinearSystem

    ): boolean {

        return

            system instanceof

            SparseLinearSystem;

    }

    static dimension(

        system:

        LinearSystem |

        SparseLinearSystem

    ): number {

        return system.dimension();

    }

    static density(

        system:

        LinearSystem |

        SparseLinearSystem

    ): number {

        if(

            system instanceof

            SparseLinearSystem

        ){

            return system.density();

        }

        return 1.0;

    }

    static isSymmetric(

        system:

        LinearSystem |

        SparseLinearSystem

    ): boolean {

        /*
            Placeholder

            Future

            Matrix symmetry test

        */

        return false;

    }

    static isSPD(

        system:

        LinearSystem |

        SparseLinearSystem

    ): boolean {

        /*
            Placeholder

            Future

            Cholesky attempt

            Eigenvalue estimate

        */

        return false;

    }

}