package com.tamercad.core.input

/**
 * ADR-0011: Input Manager
 * Olayların toplanıp, ileride Gesture Engine'e aktarılacağı merkezi sistem.
 */
class InputManager {

    private val eventQueue = mutableListOf<InputEvent>()

    fun dispatchEvent(event: InputEvent) {
        // İleride Gesture Engine (Dokunma, Sürükleme, Yakınlaştırma vb.) 
        // buradaki event'leri analiz edip CAD Kernel'e aktaracak.
        eventQueue.add(event)
        
        // Bellek optimizasyonu: Kuyruk çok şişmesin diye son 100 olayı tutuyoruz
        if (eventQueue.size > 100) {
            eventQueue.removeAt(0)
        }
    }

    fun getEvents(): List<InputEvent> = eventQueue.toList()
    
    fun clear() {
        eventQueue.clear()
    }
}
