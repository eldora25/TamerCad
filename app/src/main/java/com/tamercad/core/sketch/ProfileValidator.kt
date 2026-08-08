package com.tamercad.core.sketch

import com.tamercad.core.geometry.IGeometry
import com.tamercad.core.geometry.Line
import com.tamercad.core.math.Point3
import kotlin.math.abs

/**
 * TAMERCAD CAD DEVELOPMENT — GLOBAL RULES
 * Eskiz profillerini doğrular. Kapalı döngüleri (Closed Loops) tespit eder.
 */
object ProfileValidator {

    /**
     * Verilen geometrilerin kapalı bir profil oluşturup oluşturmadığını kontrol eder.
     * Basitleştirilmiş algoritma: Uç noktaların eşleşmesini kontrol eder.
     */
    fun findClosedLoops(geometries: List<IGeometry>): List<List<IGeometry>> {
        val lines = geometries.filterIsInstance<Line>().toMutableList()
        if (lines.isEmpty()) return emptyList()

        val loops = mutableListOf<List<IGeometry>>()
        
        while (lines.isNotEmpty()) {
            val currentLoop = mutableListOf<Line>()
            var currentLine = lines.removeAt(0)
            currentLoop.add(currentLine)
            
            var startPoint = currentLine.startPoint
            var endPoint = currentLine.endPoint
            
            var loopClosed = false
            var addedInRound: Boolean
            
            do {
                addedInRound = false
                val nextLineIndex = lines.indexOfFirst { 
                    it.startPoint.equals(endPoint) || it.endPoint.equals(endPoint) 
                }
                
                if (nextLineIndex != -1) {
                    val nextLine = lines.removeAt(nextLineIndex)
                    if (nextLine.startPoint.equals(endPoint)) {
                        endPoint = nextLine.endPoint
                    } else {
                        // Swap start/end for consistency in the loop list
                        endPoint = nextLine.startPoint
                    }
                    currentLoop.add(nextLine)
                    addedInRound = true
                    
                    if (endPoint.equals(startPoint)) {
                        loopClosed = true
                        break
                    }
                }
            } while (addedInRound)
            
            if (loopClosed) {
                loops.add(currentLoop)
            }
        }
        
        return loops
    }
}
