package com.tamercad.ui

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.lifecycle.viewmodel.compose.viewModel
import com.tamercad.BuildConfig
import com.tamercad.ui.components.*
import com.tamercad.ui.theme.TamerCadTheme
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.topbar.CADTopBar
import com.tamercad.ui.toolbar.CADSideToolbar
import com.tamercad.ui.toolbar.ToolbarCategory
import com.tamercad.ui.viewport.CADViewport
import com.tamercad.ui.contextual.CADContextToolbar
import com.tamercad.ui.contextual.SelectionType

/**
 * TamerCAD Ana Uygulama Orkestratörü.
 * Grand Architecture vizyonuna göre modüler katmanları yönetir.
 */
@Composable
fun MainCADScreen(viewModel: CADViewModel = viewModel()) {
    val context = LocalContext.current

    TamerCadTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TamerCadColors.BgColor)
                .statusBarsPadding()
                .navigationBarsPadding()
        ) {
            // 1. ANA VIEWPORT (Z-Index 0, Tam Ekran)
            CADViewport(
                viewModel = viewModel,
                modifier = Modifier.fillMaxSize()
            )

            // 2. ÜST BAR (Geri, Undo/Redo, Kaydet, Ayarlar)
            CADTopBar(
                projectName = "TamerCad_v0.1.${BuildConfig.VERSION_CODE} Tamer YAMAK©",
                onUndo = { viewModel.onUndo() },
                onRedo = { viewModel.onRedo() },
                onSave = { Toast.makeText(context, "Proje Kaydedildi", Toast.LENGTH_SHORT).show() },
                onSettings = { /* TODO: Settings Dialog */ },
                onHelp = { viewModel.showInfoDialog = true },
                onBack = { /* TODO: Project Selection */ }
            )

            // 3. SOL KATEGORİ TOOLBAR
            Box(modifier = Modifier.align(Alignment.CenterStart)) {
                CADSideToolbar(
                    activeCategory = viewModel.activeCategory,
                    onCategoryClick = { cat -> 
                        viewModel.activeCategory = if (viewModel.activeCategory == cat) ToolbarCategory.NONE else cat
                    }
                )
            }

            // 4. ALT BAĞLAM BAR (Contextual Toolbar)
            Box(modifier = Modifier.align(Alignment.BottomCenter)) {
                CADContextToolbar(
                    selectionType = viewModel.selectionType,
                    onCommandClick = { cmd -> 
                        Toast.makeText(context, "Komut tetiklendi: $cmd", Toast.LENGTH_SHORT).show()
                        // TODO: Command pattern üzerinden kernel'a iletilecek
                    }
                )
            }

            // 5. YÜZEN BROWSER
            ObjectTree(
                assembly = viewModel.mainAssembly,
                onVisibilityToggle = { comp -> comp.isVisible = !comp.isVisible; viewModel.triggerUpdate() },
                onRenameRequest = { comp -> viewModel.renameInput = comp.name; viewModel.showRenameDialog = comp },
                onSelect = { comp -> comp.isSelected = !comp.isSelected; viewModel.triggerUpdate() },
                offset = viewModel.browserOffset,
                onOffsetChange = { viewModel.browserOffset = it },
                updateTrigger = viewModel.updateTrigger,
                isVisible = viewModel.activeCategory == ToolbarCategory.INSPECT
            )

            // 6. DİNAMİK SEÇİM MENÜSÜ (Nesnenin hemen yanında)
            if (viewModel.selectionPoint != null) {
                SelectionMenu(
                    selectionPoint = viewModel.selectionPoint!!,
                    onFillet = { /* TODO */ },
                    onChamfer = { /* TODO */ },
                    onDelete = { viewModel.selectionPoint = null }
                )
            }

            // 7. DİALOGLAR
            DialogLayer(viewModel)
        }
    }
}

@Composable
fun DialogLayer(viewModel: CADViewModel) {
    if (viewModel.showRenameDialog != null) {
        AlertDialog(
            onDismissRequest = { viewModel.showRenameDialog = null },
            title = { Text("Yeniden Adlandır") },
            text = { OutlinedTextField(value = viewModel.renameInput, onValueChange = { viewModel.renameInput = it }) },
            confirmButton = { Button(onClick = { viewModel.renameComponent() }) { Text("Tamam") } },
            dismissButton = { TextButton(onClick = { viewModel.showRenameDialog = null }) { Text("İptal") } }
        )
    }

    if (viewModel.showDimDialog && viewModel.selectedGeometry != null) {
        AlertDialog(
            onDismissRequest = { viewModel.showDimDialog = false },
            title = { Text("Ölçü Girin (mm)", fontWeight = FontWeight.Bold) },
            text = { OutlinedTextField(value = viewModel.dimInput, onValueChange = { viewModel.dimInput = it }, singleLine = true) },
            confirmButton = {
                Button(onClick = { viewModel.applyDimension(viewModel.dimInput.toDoubleOrNull() ?: 0.0) }) { Text("Tamam") }
            },
            dismissButton = { TextButton(onClick = { viewModel.showDimDialog = false }) { Text("İptal") } }
        )
    }
}
