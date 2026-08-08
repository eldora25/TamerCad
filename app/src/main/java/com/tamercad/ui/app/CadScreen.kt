package com.tamercad.ui.app

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.theme.TamerCadTheme

/**
 * TamerCAD Ana Çalışma Ekranı (Orkestratör).
 * PHASE 1: Temel iskelet ve layout organizasyonu.
 */
@Composable
fun CadScreen() {
    TamerCadTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TamerCadColors.Background)
                .statusBarsPadding()
                .navigationBarsPadding()
        ) {
            // 1. ANA VIEWPORT (Z-Index 0)
            // Gelecekte CADViewport component'i buraya gelecek
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(TamerCadColors.Grid.copy(alpha = 0.1f)), // Placeholder visual
                contentAlignment = Alignment.Center
            ) {
                // Viewport Placeholder
            }

            // 2. ÜST BAR (TopBar)
            Box(modifier = Modifier.align(Alignment.TopCenter)) {
                // CADTopBar buraya gelecek
            }

            // 3. SOL ARAÇ ÇUBUĞU (SideToolbar)
            Box(modifier = Modifier.align(Alignment.CenterStart)) {
                // CADSideToolbar buraya gelecek
            }

            // 4. SAĞ ÜST NAVİGASYON (ViewCube)
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(top = 80.dp, end = 24.dp)
            ) {
                // ViewCube buraya gelecek
            }

            // 5. ALT BAĞLAM ÇUBUĞU (ContextToolbar)
            Box(modifier = Modifier.align(Alignment.BottomCenter)) {
                // CADContextToolbar buraya gelecek
            }

            // 6. EKSEN GÖSTERGESİ (Axis Indicator)
            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(start = 100.dp, bottom = 120.dp)
            ) {
                // AxisIndicator buraya gelecek
            }
        }
    }
}
