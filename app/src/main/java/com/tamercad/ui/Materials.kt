package com.tamercad.ui

import androidx.compose.ui.graphics.Color

data class RenderMaterial(val name: String, val color: Color)

val availableMaterials = listOf(
    RenderMaterial("Aluminum", Color(0xFFE0E0E0)),
    RenderMaterial("Steel", Color(0xFF71797E)),
    RenderMaterial("Wood", Color(0xFF8B5A2B)),
    RenderMaterial("Plastic", Color(0xFF4A90E2)),
    RenderMaterial("Gold", Color(0xFFFFD700)),
    RenderMaterial("Matte Black", Color(0xFF222222))
)
