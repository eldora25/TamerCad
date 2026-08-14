package com.tamercad.ui.viewport

import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.tamercad.ui.CADViewModel
import com.tamercad.ui.components.CADCanvas
import com.tamercad.ui.components.NavigationCube
import com.tamercad.ui.viewport.ViewportPolicy
import kotlin.math.*

/**
 * TamerCAD Ana Viewport Katmanı.
 * 3D çizim alanı, NavCube ve Axis Indicator'ı barındırır.
 */
@Composable
fun CADViewport(
    viewModel: CADViewModel,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier.fillMaxSize()) {
        // 1. ANA ÇİZİM VE HESAPLAMA ALANI (En arka katman)
        CADCanvas(viewModel = viewModel)

        // 3. AXIS INDICATOR (Sol Alt Köşe)
        Box(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(start = 100.dp, bottom = 120.dp) // SideToolbar ve ContextToolbar'ı hesaba kat
        ) {
            // TODO: AxisIndicator bileşeni eklenecek
        }
    }
}
