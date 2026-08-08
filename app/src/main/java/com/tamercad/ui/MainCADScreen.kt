package com.tamercad.ui

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
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
import com.tamercad.ui.sketch.PlaneSelector
import com.tamercad.ui.modeling.ExtrudePanel
import com.tamercad.ui.app.SettingsScreen
import com.tamercad.ui.viewport.CADViewport
import com.tamercad.ui.contextual.CADContextToolbar
import com.tamercad.ui.contextual.SelectionType

@Composable
fun MainCADScreen(viewModel: CADViewModel = viewModel()) {
    val context = LocalContext.current

    TamerCadTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TamerCadColors.Background)
        ) {
            // 1. KATMAN: 3D VIEWPORT
            CADViewport(
                viewModel = viewModel,
                modifier = Modifier.fillMaxSize()
            )

            // 2. KATMAN: UI KONTROLLERİ
            Box(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .zIndex(10f)
                    .statusBarsPadding()
            ) {
                CADTopBar(
                    designName = viewModel.mainAssembly.name,
                    buildNo = BuildConfig.VERSION_CODE.toString(),
                    saveStatus = viewModel.saveStatus,
                    onUndo = { viewModel.onUndo() },
                    onRedo = { viewModel.onRedo() },
                    onSave = { 
                        viewModel.saveStatus = "Saving..."
                        Toast.makeText(context, "Proje Kaydedildi", Toast.LENGTH_SHORT).show()
                        viewModel.saveStatus = "Saved"
                    },
                    onSettings = { viewModel.showSettings = true },
                    onHelp = { viewModel.showInfoDialog = true },
                    onAR = { 
                        Toast.makeText(context, "AR Mode Starting (1:1 Scale)...", Toast.LENGTH_LONG).show()
                        com.tamercad.core.rendering.ArCoreBridge(context).startArView(viewModel.mainAssembly)
                    },
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
                    isSketchMode = viewModel.isSketchMode,
                    onCategoryClick = { cat -> 
                        viewModel.activeCategory = if (viewModel.activeCategory == cat) ToolbarCategory.NONE else cat
                    },
                    onExitSketch = { commit -> viewModel.exitSketchMode(commit) }
                )
            }

            // SELECTION FILTER
            Box(
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .padding(start = 72.dp)
                    .zIndex(10f)
            ) {
                SelectionFilterPanel(manager = viewModel.selectionManager)
            }

            // KATEGORİ PANELİ
            CategoryPanel(
                category = viewModel.activeCategory,
                viewModel = viewModel,
                onToolClick = { tool ->
                    if (tool.enabled) {
                        viewModel.runCommand(tool.id, context)
                    }
                }
            )

            // ALT BAĞLAM BAR
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .zIndex(10f)
                    .navigationBarsPadding()
            ) {
                CADContextToolbar(
                    viewModel = viewModel,
                    onCommandClick = { cmd -> 
                        if (cmd == "sketch") {
                            viewModel.startSketchFlow()
                        } else {
                            viewModel.runCommand(cmd, context)
                        }
                    }
                )
            }

            // 3. KATMAN: YÜZEN PANELLER
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

            // EXTRUDE OVERLAY
            if (viewModel.currentMode == CadMode.EXTRUDE) {
                Box(modifier = Modifier.align(Alignment.TopEnd).padding(top = 100.dp, end = 24.dp)) {
                    ExtrudePanel(
                        distance = viewModel.dynamicExtrudeHeight.toDouble(),
                        onDistanceChange = { v -> viewModel.dynamicExtrudeHeight = v.toFloatOrNull() ?: 0f },
                        onAccept = { viewModel.onSketchDragEnd(context) },
                        onCancel = { viewModel.currentMode = CadMode.SMART_SKETCH; viewModel.dynamicExtrudeHeight = 0f }
                    )
                }
            }

            // PLANE SELECTOR OVERLAY
            if (viewModel.showPlaneSelector) {
                PlaneSelector(
                    onPlaneSelected = { plane -> viewModel.enterSketchMode(plane) },
                    onCancel = { viewModel.showPlaneSelector = false }
                )
            }

            // SETTINGS OVERLAY
            if (viewModel.showSettings) {
                SettingsScreen(
                    state = viewModel.settings,
                    onClose = { viewModel.showSettings = false }
                )
            }
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
