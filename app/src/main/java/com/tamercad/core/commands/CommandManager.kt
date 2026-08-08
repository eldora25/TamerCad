package com.tamercad.core.commands

/**
 * ADR-0013: Command System Architecture
 * Geri Alma (Undo) ve İleri Alma (Redo) geçmişini (history) yöneten sistem.
 */
class CommandManager {
    
    // Geçmişi tutan yığınlar (Stacks)
    private val undoStack = mutableListOf<CadCommand>()
    private val redoStack = mutableListOf<CadCommand>()

    /**
     * Yeni bir komut çalıştırır ve geçmişe ekler.
     */
    fun execute(command: CadCommand) {
        command.execute()
        undoStack.add(command)
        // Yeni bir işlem yapıldığında, eski "ileri al" geçmişi silinmelidir
        redoStack.clear()
    }

    /**
     * Son yapılan işlemi geri alır.
     */
    fun undo() {
        if (undoStack.isNotEmpty()) {
            val command = undoStack.removeLast()
            command.undo()
            redoStack.add(command)
        }
    }

    /**
     * Geri alınmış bir işlemi tekrar ileri alır.
     */
    fun redo() {
        if (redoStack.isNotEmpty()) {
            val command = redoStack.removeLast()
            command.execute()
            undoStack.add(command)
        }
    }

    /**
     * Geri alınabilecek işlem var mı kontrolü (UI butonlarını pasifleştirmek için eklenebilir)
     */
    fun canUndo(): Boolean = undoStack.isNotEmpty()

    /**
     * İleri alınabilecek işlem var mı kontrolü (UI butonlarını pasifleştirmek için eklenebilir)
     */
    fun canRedo(): Boolean = redoStack.isNotEmpty()
    
    /**
     * Proje değiştiğinde veya temizlendiğinde geçmişi sıfırlar.
     */
    fun clear() {
        undoStack.clear()
        redoStack.clear()
    }
}
