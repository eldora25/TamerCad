package com.tamercad.ui.interaction

/**
 * TamerCAD Etkileşim Durum Makinesi.
 * Kullanıcı girdilerinin (Parmak/Kalem) nasıl işleneceğini belirler.
 */
enum class InteractionState {
    IDLE,               // Boşta
    SELECTING,          // Seçim yapılıyor
    SKETCHING,          // Çizim yapılıyor
    DRAGGING,           // Nesne sürükleniyor (Free drag)
    MANIPULATING,       // Manipülatör (Gizmo) ile işlem yapılıyor
    MEASURING,          // Ölçüm yapılıyor
    CAMERA_NAVIGATION,  // Kamera döndürme/zoom/pan
    COMMAND_ACTIVE      // Özel bir komut (Extrude vb.) aktif ve kullanıcıdan girdi bekliyor
}
