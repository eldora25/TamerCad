package com.tamercad.ui.viewport

import androidx.compose.ui.unit.dp

/**
 * TAMERCAD — VIEWPORT OVERLAY LAYOUT POLICY
 * Authoritative source for UI safe regions and component placement.
 * Ensures non-overlapping layouts on professional tablets.
 */
object ViewportPolicy {

    // --- BASE LAYOUT ---
    val TopBarHeight = 40.dp
    val SideToolbarStart = 8.dp
    val SideToolbarWidth = 64.dp
    val SideToolbarTopOffset = 64.dp 

    // --- COMPONENT DIMENSIONS ---
    val NavigationCubeWidth = 100.dp
    val NavigationCubeHeight = 150.dp 
    val BrowserWidth = 260.dp
    
    // --- SAFE MARGINS ---
    val EdgeMargin = 16.dp
    val CompactMargin = 8.dp

    // --- PLACEMENT RULES ---
    
    // TOP_LEFT region for Document Header
    val HeaderTop = CompactMargin
    val HeaderStart = CompactMargin
    
    // TOP_RIGHT STACK (ViewCube -> Nav -> Global)
    val ViewCubeTop = CompactMargin
    val ViewCubeEnd = CompactMargin
    
    val NavigationStackTop = ViewCubeTop + 110.dp // Below Cube (100dp) + Spacing
    val NavigationStackEnd = CompactMargin
    
    val GlobalToolbarTop = NavigationStackTop + 50.dp // Below Nav Buttons (~40dp) + Spacing
    val GlobalToolbarEnd = CompactMargin

    // LEFT region for Submenus (Center-aligned vertically)
    val SelectionFilterStart = SideToolbarStart + SideToolbarWidth + CompactMargin
    val SelectionFilterWidth = 56.dp
    
    val CategoryPanelStart = SelectionFilterStart + SelectionFilterWidth + CompactMargin
    val CategoryPanelWidth = 200.dp

    // RIGHT region for Object Tree (Browser)
    val BrowserEnd = CompactMargin
    val BrowserTop = GlobalToolbarTop + 50.dp // Below Global Toolbar
    val BrowserBottom = 100.dp // Safety gap from bottom

    // PROPERTY PANELS (Extrude, etc.)
    val PropertyPanelTop = ViewCubeTop + 240.dp // Ensure it doesn't overlap stack
    val PropertyPanelEnd = CompactMargin

    // BOTTOM_CENTER for ContextToolbar
    val ContextToolbarBottom = 24.dp

    // LOWER_LEFT for Diagnostics (Developer only)
    val DiagnosticsStart = SideToolbarStart + SideToolbarWidth + CompactMargin
    val DiagnosticsBottom = 32.dp // Just above system area or context bar level
}
