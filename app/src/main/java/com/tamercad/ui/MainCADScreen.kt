package com.tamercad.ui

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlin.math.abs
import androidx.compose.ui.platform.LocalDensity
import com.tamercad.BuildConfig
import com.tamercad.ui.components.*
import com.tamercad.ui.theme.TamerCadTheme
import com.tamercad.ui.theme.TamerCadColors
import com.tamercad.ui.topbar.DocumentHeader
import com.tamercad.ui.topbar.UndoRedoBar
import com.tamercad.ui.topbar.GlobalToolbar
import com.tamercad.ui.toolbar.CADSideToolbar
import com.tamercad.ui.toolbar.ToolbarCategory
import com.tamercad.ui.toolbar.CategoryPanel
import com.tamercad.ui.selection.SelectionFilterPanel
import com.tamercad.ui.sketch.PlaneSelector
import com.tamercad.ui.modeling.ExtrudePanel
import com.tamercad.ui.app.SettingsScreen
import com.tamercad.ui.viewport.CADViewport
import com.tamercad.ui.viewport.ViewportPolicy
import com.tamercad.ui.contextual.CADContextToolbar
import com.tamercad.ui.contextual.SelectionType

@Composable
fun MainCADScreen(viewModel: CADViewModel = viewModel()) {
    val context = LocalContext.current
    val density = LocalDensity.current

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

            // 2. KATMAN: UI KONTROLLERİ (POLICY-BASED PLACEMENT)
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
            ) {
                // TOP LEFT: Document Header
                DocumentHeader(
                    designName = viewModel.mainAssembly.name,
                    buildNo = BuildConfig.VERSION_CODE.toString(),
                    saveStatus = viewModel.saveStatus,
                    onBack = { /* Project Selection */ },
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(top = ViewportPolicy.HeaderTop, start = ViewportPolicy.HeaderStart)
                )

                // TOP CENTER: Undo / Redo
                UndoRedoBar(
                    onUndo = { viewModel.onUndo() },
                    onRedo = { viewModel.onRedo() },
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = ViewportPolicy.CompactMargin)
                )

                // TOP RIGHT STACK: ViewCube, Navigation, Global Tools
                Column(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(top = ViewportPolicy.ViewCubeTop, end = ViewportPolicy.ViewCubeEnd),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(ViewportPolicy.CompactMargin)
                ) {
                    NavigationCube(
                        cameraPitch = viewModel.cameraPitch,
                        cameraYaw = viewModel.cameraYaw,
                        onViewChange = { p, y -> 
                            when {
                                p == 0f && y == 0f -> viewModel.setFrontView()
                                p == 0f && abs(y - Math.PI.toFloat()) < 0.1f -> viewModel.setBackView()
                                abs(p - Math.PI.toFloat()/2f) < 0.1f -> viewModel.setTopView()
                                abs(p + Math.PI.toFloat()/2f) < 0.1f -> viewModel.setBottomView()
                                y < 0 && abs(y + Math.PI.toFloat()/2f) < 0.1f -> viewModel.setLeftView()
                                y > 0 && abs(y - Math.PI.toFloat()/2f) < 0.1f -> viewModel.setRightView()
                                else -> {
                                    viewModel.cameraPitch = p
                                    viewModel.cameraYaw = y
                                    viewModel.triggerUpdate()
                                }
                            }
                        },
                        onDrag = { dx, dy ->
                            viewModel.cameraYaw += dx * 0.01f
                            viewModel.cameraPitch -= dy * 0.01f
                            viewModel.triggerUpdate()
                        },
                        onHomeClick = { viewModel.goHome() },
                        onFitAllClick = { viewModel.fitAll() },
                        isPerspective = viewModel.isPerspective,
                        onTogglePerspective = { viewModel.isPerspective = !viewModel.isPerspective; viewModel.triggerUpdate() }
                    )

                    GlobalToolbar(
                        onSave = { 
                            viewModel.saveStatus = "Saving..."
                            Toast.makeText(context, "Proje Kaydedildi", Toast.LENGTH_SHORT).show()
                            viewModel.saveStatus = "Saved"
                            viewModel.saveUiState()
                        },
                        onAR = { 
                            Toast.makeText(context, "AR Mode Starting (1:1 Scale)...", Toast.LENGTH_LONG).show()
                            com.tamercad.core.rendering.ArCoreBridge(context).startArView(viewModel.mainAssembly)
                        },
                        onSettings = { viewModel.showSettings = true },
                        onHelp = { viewModel.showInfoDialog = true }
                    )
                }
            }

            // SOL SIDEBAR: Tool Rail
            CADSideToolbar(
                activeCategory = viewModel.activeCategory,
                isSketchMode = viewModel.isSketchMode,
                onCategoryClick = { cat -> 
                    val prevCat = viewModel.activeCategory
                    viewModel.activeCategory = if (viewModel.activeCategory == cat) ToolbarCategory.NONE else cat
                    
                    // Explicit trigger for Object Tree
                    if (cat == ToolbarCategory.INSPECT) {
                        if (prevCat == ToolbarCategory.INSPECT) {
                            viewModel.toggleObjectTree()
                        } else {
                            viewModel.openObjectTree()
                        }
                    } else if (!viewModel.objectTreePinned && viewModel.activeCategory != ToolbarCategory.NONE && viewModel.activeCategory != ToolbarCategory.INSPECT) {
                        // UNPINNED Policy: Close when switching to another functional tool
                        viewModel.isObjectTreeVisible = false
                    }
                },
                onExitSketch = { commit -> viewModel.exitSketchMode(commit) },
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .zIndex(10f)
            )

            // SELECTION FILTER
            Box(
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .padding(start = ViewportPolicy.SelectionFilterStart)
                    .zIndex(10f)
            ) {
                SelectionFilterPanel(manager = viewModel.selectionManager)
            }

            // KATEGORİ PANELİ
            Box(
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .padding(start = ViewportPolicy.CategoryPanelStart)
                    .zIndex(10f)
            ) {
                CategoryPanel(
                    category = viewModel.activeCategory,
                    viewModel = viewModel,
                    onToolClick = { tool ->
                        if (tool.enabled) {
                            viewModel.runCommand(tool.id, context)
                        }
                    }
                )
            }

            // ALT BAĞLAM BAR
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = ViewportPolicy.ContextToolbarBottom)
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

            if (viewModel.isObjectTreeVisible) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .zIndex(500f)
                ) {
                    ObjectTree(
                        document = viewModel.document,
                        activeSketchId = viewModel.activeSketchId,
                        selectedSketchId = viewModel.selectionManager.selectedSketchId,
                        selectedEntityId = viewModel.selectionManager.selectedEntityId,
                        isPinned = viewModel.objectTreePinned,
                        onVisibilityToggle = { comp -> comp.isVisible = !comp.isVisible; viewModel.triggerUpdate() },
                        onRenameRequest = { comp -> viewModel.renameInput = comp.name; viewModel.showRenameDialog = comp },
                        onSelect = { comp -> comp.isSelected = !comp.isSelected; viewModel.triggerUpdate() },
                        onSketchSelect = { id -> viewModel.activeSketchId = id; viewModel.triggerUpdate() },
                        onPinToggle = { viewModel.toggleObjectTreePin() },
                        onClose = { viewModel.isObjectTreeVisible = false; viewModel.saveUiState() },
                        offset = with(density) {
                            Offset(viewModel.objectTreeOffsetDp.x.dp.toPx(), viewModel.objectTreeOffsetDp.y.dp.toPx())
                        },
                        onOffsetChange = { offsetPx -> 
                            with(density) {
                                viewModel.setObjectTreePositionDp(Offset(offsetPx.x.toDp().value, offsetPx.y.toDp().value))
                            }
                        },
                        onDragEnd = { viewModel.saveObjectTreeDragEnd() },
                        updateTrigger = viewModel.updateTrigger,
                        isVisible = true,
                        viewModel = viewModel
                    )
                }
            }

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
                Box(modifier = Modifier.align(Alignment.TopEnd).padding(top = ViewportPolicy.PropertyPanelTop, end = ViewportPolicy.PropertyPanelEnd)) {
                    ExtrudePanel(
                        distance = viewModel.dynamicExtrudeHeight.toDouble(),
                        onDistanceChange = { v -> viewModel.dynamicExtrudeHeight = v.toFloatOrNull() ?: 0f },
                        operation = viewModel.extrudeOperation,
                        onOperationChange = { viewModel.extrudeOperation = it },
                        isSymmetric = viewModel.isExtrudeSymmetric,
                        onSymmetricToggle = { viewModel.isExtrudeSymmetric = !viewModel.isExtrudeSymmetric },
                        isReversed = viewModel.isExtrudeReversed,
                        onReverseToggle = { viewModel.isExtrudeReversed = !viewModel.isExtrudeReversed },
                        onAccept = { viewModel.runCommand("confirm_extrude", context) },
                        onCancel = { viewModel.currentMode = CadMode.NAVIGATE; viewModel.dynamicExtrudeHeight = 0f }
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
