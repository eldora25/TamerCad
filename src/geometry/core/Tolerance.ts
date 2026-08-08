export class Tolerance {


    private constructor(){}



    /**
     * Geometrik mesafe toleransı
     */
    static distance:number = 1e-6;



    /**
     * Açısal tolerans (radyan)
     */
    static angle:number = 1e-8;



    /**
     * Çok küçük değerleri sıfır kabul etme
     */
    static zero:number = 1e-12;




    static equals(

        a:number,

        b:number,

        tolerance:number =
        Tolerance.distance

    ):boolean {


        return Math.abs(a-b)

        <=

        tolerance;

    }




    static isZero(

        value:number

    ):boolean {


        return Math.abs(value)

        <=

        Tolerance.zero;

    }




    static greater(

        a:number,

        b:number,

        tolerance:number =
        Tolerance.distance

    ):boolean {


        return a > b + tolerance;

    }




    static less(

        a:number,

        b:number,

        tolerance:number =
        Tolerance.distance

    ):boolean {


        return a < b - tolerance;

    }




    static clampZero(

        value:number

    ):number {


        return this.isZero(value)

        ?

        0

        :

        value;

    }




    static setPrecision(

        precision:number

    ):void {


        Tolerance.distance =
        precision;


    }




    static setAnglePrecision(

        precision:number

    ):void {


        Tolerance.angle =
        precision;


    }




    static info(){

        return {

            distance:

            Tolerance.distance,


            angle:

            Tolerance.angle,


            zero:

            Tolerance.zero

        };

    }


}