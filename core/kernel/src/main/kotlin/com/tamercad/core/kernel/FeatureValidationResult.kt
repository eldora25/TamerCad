package com.tamercad.core.kernel


/**
 * Result of feature validation.
 */
sealed class FeatureValidationResult {


    /**
     * Feature is valid.
     */
    data object Valid :
        FeatureValidationResult()



    /**
     * Feature has an error.
     */
    data class Invalid(

        val message: String

    ) :
        FeatureValidationResult()



    /**
     * Feature requires regeneration.
     */
    data object NeedsUpdate :
        FeatureValidationResult()

}