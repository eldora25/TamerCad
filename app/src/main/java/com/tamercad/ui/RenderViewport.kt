package com.tamercad.core

/**
 * Viewport sınırlarını tutan veri sınıfı.
 */
data class ViewportRectangle(
    var x: Float,
    var y: Float,
    var width: Float,
    var height: Float
)

class RenderViewport(
    width: Float = 800f,
    height: Float = 600f
) {
    private var rectangle = ViewportRectangle(0f, 0f, width, height)
    
    var pixelRatio: Float = 1.0f
        set(value) {
            require(value > 0) { "Pixel ratio must be greater than zero." }
            field = value
        }

    var isEnabled: Boolean = true
        private set

    fun setPosition(x: Float, y: Float) {
        rectangle.x = x
        rectangle.y = y
    }

    fun setSize(width: Float, height: Float) {
        rectangle.width = width
        rectangle.height = height
    }

    fun resize(width: Float, height: Float) {
        setSize(width, height)
    }

    fun getWidth(): Float = rectangle.width

    fun getHeight(): Float = rectangle.height

    fun getAspectRatio(): Float {
        return if (rectangle.height == 0f) {
            1f
        } else {
            rectangle.width / rectangle.height
        }
    }

    fun getRectangle(): ViewportRectangle {
        return rectangle.copy()
    }

    fun getPhysicalWidth(): Float {
        return rectangle.width * pixelRatio
    }

    fun getPhysicalHeight(): Float {
        return rectangle.height * pixelRatio
    }

    fun enable() {
        isEnabled = true
    }

    fun disable() {
        isEnabled = false
    }

    /**
     * Jetpack Compose Canvas (DrawScope) veya Android Canvas'a 
     * viewport ayarlarını uygulamak için kullanılacak fonksiyon.
     */
    fun applyViewport(context: Any?) {
        if (!isEnabled) return

        // İleride OpenGL ES veya Vulkan'a geçildiğinde (Mimari Faz 2/3),
        // JNI üzerinden C++ tarafına veya Android GLES30.glViewport()
        // metoduna bu değerler aktarılacak.
        
        /* Örnek OpenGL ES kullanımı:
         * GLES30.glViewport(
         *     rectangle.x.toInt(),
         *     rectangle.y.toInt(),
         *     getPhysicalWidth().toInt(),
         *     getPhysicalHeight().toInt()
         * )
         */
    }

    fun clone(): RenderViewport {
        val viewport = RenderViewport(rectangle.width, rectangle.height)
        viewport.setPosition(rectangle.x, rectangle.y)
        viewport.pixelRatio = this.pixelRatio
        if (!this.isEnabled) {
            viewport.disable()
        }
        return viewport
    }
}
