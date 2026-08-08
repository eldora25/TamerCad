package com.tamercad.core.modeling

import com.tamercad.core.features.IFeature

/**
 * Parametrik Geçmiş (Parametric History-Based Modeling) Yöneticisi.
 */
class ParametricHistoryManager {
    private val featureHistory = mutableListOf<Pair<String, IFeature>>()

    fun recordFeature(stepName: String, feature: IFeature) {
        featureHistory.add(Pair(stepName, feature))
    }

    fun rollbackToStep(stepIndex: Int): List<IFeature> {
        if (stepIndex in 0 until featureHistory.size) {
            return featureHistory.subList(0, stepIndex + 1).map { it.second }
        }
        return featureHistory.map { it.second }
    }

    fun getHistorySteps(): List<String> {
        return featureHistory.map { it.first }
    }
}
