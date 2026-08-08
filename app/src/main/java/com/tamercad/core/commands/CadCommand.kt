package com.tamercad.core.commands

/**
 * ADR-0013: Command System Architecture
 * Sistemdeki tüm geri alınabilir işlemlerin (Undo/Redo) uygulaması gereken temel arayüz.
 */
interface CadCommand {
    
    /**
     * Komutu çalıştırır veya İleri Al (Redo) işlemi sırasında tekrar uygular.
     */
    fun execute()
    
    /**
     * Komutun yaptığı işlemi Geri Alır (Undo).
     */
    fun undo()
    
    /**
     * UI veya loglama için komutun adını döndürür.
     */
    fun name(): String
}
