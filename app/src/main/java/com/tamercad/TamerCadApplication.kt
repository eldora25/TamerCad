package com.tamercad

import android.app.Application

class TamerCadApplication : Application() {
    companion object {
        lateinit var instance: TamerCadApplication
            private set
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
    }
}
