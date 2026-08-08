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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import androidx.lifecycle.viewmodel.compose.viewModel
import com.tamercad.BuildConfig
import com.tamercad.ui.components.*
import com.tamercad.ui.theme.TamerCadTheme
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.topbar.CADTopBar
import com.tamercad.ui.toolbar.CADSideToolbar
import com.tamercad.ui.toolbar.ToolbarCategory
import com.tamercad.ui.toolbar.CategoryPanel
import com.tamercad.ui.selection.SelectionFilterPanel
import com.tamercad.ui.viewport.CADViewport
import com.tamercad.ui.contextual.CADContextToolbar
import com.tamercad.ui.contextual.SelectionType

/**
 * TamerCAD Ana Uygulama Orkestratörü (Grand Architecture).
 * Tüm modüllerin hiyerarşik yerleşimini ve state akışını yönetir.
 */
@Composable
fun MainCADScreen(viewModel: CADViewModel = viewModel()) {
    val context = LocalContext.current

    TamerCadTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TamerCadColors.Background)
        ) {
            // ----------------------------------------------------------------
            // 1. KATMAN (Z-Index 0): 3D VIEWPORT
            // Tüm ekranı kaplar, diğer bileşenler bunun üzerinde yüzer.
            // ----------------------------------------------------------------
            CADViewport(
                viewModel = viewModel,
                modifier = Modifier.fillMaxSize()
            )

            // ----------------------------------------------------------------
            // 2. KATMAN (Z-Index 1): UI KONTROLLERİ
            // ----------------------------------------------------------------
            
            // ÜST BAR: Proje adı, Undo/Redo, Save, Settings
            Box(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .zIndex(10f)
                    .statusBarsPadding()
            ) {
                CADTopBar(
                    projectName = "TamerCad_v0.1.${BuildConfig.VERSION_CODE} Tamer YAMAK©",
                    saveStatus = viewModel.saveStatus,
                    onUndo = { viewModel.onUndo() },
                    onRedo = { viewModel.onRedo() },
                    onSave = { 
                        viewModel.saveStatus = "Saving..."
                        Toast.makeText(context, "Proje Kaydedildi", Toast.LENGTH_SHORT).show()
                        viewModel.saveStatus = "Saved"
                    },
                    onSettings = { /* Settings Dialog */ },
                    onHelp = { viewModel.showInfoDialog = true },
                    onBack = { /* Project Selection */ }
                )
            }

            // SOL SIDEBAR: Tool Rail
            Box(
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .zIndex(10f)
            ) {
                CADSideToolbar(
                    activeCategory = viewModel.activeCategory,
                    onCategoryClick = { cat -> 
                        viewModel.activeCategory = if (viewModel.activeCategory == cat) ToolbarCategory.NONE else cat
                    }
                )
            }

            // SELECTION FILTER: Rail'in hemen yanında
            Box(
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .padding(start = 72.dp) // Rail genişliği kadar ofset
                    .zIndex(10f)
            ) {
                SelectionFilterPanel(manager = viewModel.selectionManager)
            }

            // KATEGORİ PANELİ: Rail üzerinden seçilen araçlar
            CategoryPanel(
                category = viewModel.activeCategory,
                viewModel = viewModel,
                onToolClick = { tool ->
                    if (tool.enabled) {
                        Toast.makeText(context, "Tool: ${tool.label}", Toast.LENGTH_SHORT).show()
                    }
                }
            )

            // ALT BAĞLAM BAR (Contextual Toolbar): Seçime göre değişen araçlar
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .zIndex(10f)
                    .navigationBarsPadding()
            ) {
                CADContextToolbar(
                    viewModel = viewModel,
                    onCommandClick = { cmd -> 
                        Toast.makeText(context, "Komut: $cmd", Toast.LENGTH_SHORT).show()
                        // TODO: Feature Manager / Kernel interaction
                    }
                )
            }

            // ----------------------------------------------------------------
            // 3. KATMAN (Z-Index 100): YÜZEN PANELLER VE DİALOGLAR
            // ----------------------------------------------------------------

            // YÜZEN BROWSER (Nesne Ağacı)
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

            // DİNAMİK SEÇİM MENÜSÜ (Nesnenin hemen yanında beliren mini araçlar)
            if (viewModel.selectionPoint != null) {
                Box(modifier = Modifier.zIndex(150f)) {
                    SelectionMenu(
                        selectionPoint = viewModel.selectionPoint!!,
                        onFillet = { /* TODO */ },
                        onChamfer = { /* TODO */ },
                        onDelete = { viewModel.selectionPoint = null }
                    )
                }
            }

            // DİALOG KATMANI
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

    if (viewModel.showDimDialog && viewModel.selectionManager.firstOrNull() != null) {
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
