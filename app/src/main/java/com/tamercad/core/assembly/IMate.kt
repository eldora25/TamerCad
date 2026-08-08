package com.tamercad.core.assembly

import com.tamercad.core.serialization.ISerializable

/**
 * ADR-0016: Assembly System Architecture
 * İki bileşen (Component3D) arasındaki hizalama ve montaj kısıtlamalarının (Mate) temel arayüzü.
 */
interface IMate : ISerializable {
    val id: String
    val type: String
    val componentA: Component3D
    val componentB: Component3D

    /**
     * İki bileşen arasındaki ilişkiyi çözer ve 3D uzaydaki konumlarını (Matrix4) birbirine göre ayarlar.
     */
    fun solve(): Boolean
}
