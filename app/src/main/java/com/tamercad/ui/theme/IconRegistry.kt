package com.tamercad.ui.theme

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.*
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*

/**
 * TamerCAD Merkezi İkon Kayıt Sistemi.
 */
object IconRegistry {
    // Top Bar
    val Home = Icons.Default.Home
    val Save = Icons.Default.Save
    val Undo = Icons.AutoMirrored.Filled.Undo
    val Redo = Icons.AutoMirrored.Filled.Redo
    val Settings = Icons.Default.Settings
    val Help = Icons.Default.QuestionMark

    // Side Toolbar Categories
    val Select = Icons.Default.AdsClick
    val Sketch = Icons.Default.AutoFixHigh
    val Create = Icons.Default.AddBox
    val Modify = Icons.Default.Architecture
    val Construct = Icons.Default.Layers
    val Measure = Icons.Default.Straighten
    val Inspect = Icons.AutoMirrored.Filled.ManageSearch

    // Sketch Tools
    val Line = Icons.AutoMirrored.Filled.ShowChart
    val Arc = Icons.Default.IncompleteCircle
    val Circle = Icons.Default.RadioButtonUnchecked
    val Rectangle = Icons.Default.Rectangle
    val Spline = Icons.Default.Gesture
    val Polygon = Icons.Default.Polyline
    val Trim = Icons.Default.ContentCut
    val Delete = Icons.Default.DeleteOutline

    // Modeling Tools
    val Extrude = Icons.Default.Upload
    val Revolve = Icons.Default.Cached
    val Fillet = Icons.Default.RoundedCorner
    val Chamfer = Icons.Default.Architecture
    val Mirror = Icons.Default.Flip
    val Pattern = Icons.Default.GridView

    val Union = Icons.Default.Add
    val Subtract = Icons.Default.Remove
    val Intersect = Icons.Default.FilterCenterFocus
    
    // Visibility
    val Visible = Icons.Default.Visibility
    val Hidden = Icons.Default.VisibilityOff
    val AR = Icons.Default.ViewInAr
}
