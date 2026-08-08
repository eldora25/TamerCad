package com.tamercad.core.constraints

import com.tamercad.core.geometry.Line
import com.tamercad.core.math.Point3
import kotlin.math.*

/**
 * Geometric Constraint Solver (GCS) - Geometrik Kısıtlama Çözücü Motor.
 * ADR-0016: Constraint Solver Architecture
 */
class GCSManager {
    
    private val constraints = mutableListOf<IConstraint>()

    fun addConstraint(constraint: IConstraint) {
        constraints.add(constraint)
        resolve()
    }

    fun removeConstraint(constraint: IConstraint) {
        constraints.remove(constraint)
        resolve()
    }

    fun getConstraints(): List<IConstraint> = constraints.toList()

    fun getConstraintsForEntity(entityId: String): List<IConstraint> {
        return constraints.filter { 
            it.toJson().toString().contains(entityId) // Basitleştirilmiş ID taraması
        }
    }

    /**
     * Tüm aktif kısıtlamaları çözer (Resolve).
     * İteratif yöntem: Karmaşık zincirleri çözmek için birden fazla tur döner.
     */
    fun resolve(): Boolean {
        var iterations = 0
        val maxIterations = 10
        var allResolved = false
        
        while (iterations < maxIterations) {
            var currentRoundResolved = true
            for (constraint in constraints) {
                if (!constraint.resolve()) {
                    currentRoundResolved = false
                }
            }
            if (currentRoundResolved) {
                allResolved = true
                break
            }
            iterations++
        }
        return allResolved
    }

    fun clear() {
        constraints.clear()
    }
}
