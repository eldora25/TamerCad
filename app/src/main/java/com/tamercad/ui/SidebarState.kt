package com.tamercad.ui

import androidx.compose.runtime.*
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*

/**
 * Sol Sidebar ve Sketch menüsünün dinamik durum yönetimi.
 */
class SidebarState {
    // Ana menü kategorileri
    var activeCategory by mutableStateOf(SidebarCategory.NONE)

    // Sketch modundaki birincil (görünen) araçlar
    var primaryLineTool by mutableStateOf(CadMode.SMART_SKETCH)
    var primarySplineTool by mutableStateOf(CadMode.SKETCH_SPLINE_FIT)
    var primaryRectTool by mutableStateOf(CadMode.SKETCH_RECT_DIAG)

    // Uzun basma ile açılan yan menü durumu
    var expandedGroup by mutableStateOf<String?>(null)

    fun switchCategory(category: SidebarCategory) {
        activeCategory = if (activeCategory == category) SidebarCategory.NONE else category
    }

    fun swapTool(group: String, newMode: CadMode) {
        when (group) {
            "Line" -> primaryLineTool = newMode
            "Spline" -> primarySplineTool = newMode
            "Rectangle" -> primaryRectTool = newMode
        }
        expandedGroup = null // Seçimden sonra kapat
    }
}

enum class SidebarCategory {
    NONE, SKETCH, INSERT, CONSTRUCT, TRANSFORM, TOOLS, MATERIAL, ITEMS
}

/**
 * CadMode için uygun ikonları döndüren yardımcı fonksiyon.
 */
fun getIconForMode(mode: CadMode): ImageVector {
    return when (mode) {
        CadMode.SMART_SKETCH -> Icons.Default.Create // Kalem/Otomatik
        CadMode.SKETCH_LINE_MANUAL -> Icons.Default.Edit // Çizgi
        CadMode.SKETCH_ARC -> Icons.Default.Refresh // Yay (Döngüsel)
        CadMode.SKETCH_SPLINE_FIT -> Icons.Default.Share // Eğri (Noktalar arası)
        CadMode.SKETCH_SPLINE_CTRL -> Icons.Default.Add // Kontrol noktası
        CadMode.SKETCH_RECT_DIAG -> Icons.Default.Menu // Dikdörtgen
        CadMode.SKETCH_RECT_CENTER -> Icons.Default.Place // Merkezden dikdörtgen
        CadMode.SKETCH_RECT_3PT -> Icons.Default.Build // 3 Nokta dikdörtgen
        CadMode.TRIM -> Icons.Default.Delete // Makas (Sil)
        CadMode.DELETE -> Icons.Default.Clear // Tamamen sil
        CadMode.MOVE_ROTATE -> Icons.Default.PlayArrow // Taşıma
        CadMode.MIRROR -> Icons.Default.Star // Aynalama
        CadMode.PATTERN_LINEAR -> Icons.Default.MoreVert // Çoğaltma
        CadMode.EXTRUDE -> Icons.Default.KeyboardArrowUp // Yükseltme
        else -> Icons.Default.Settings
    }
}
