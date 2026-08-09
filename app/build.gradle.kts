/*
 * ============================================================
 * Project : TamerCAD
 * Module  : Android Application
 * File    : app/build.gradle.kts
 * Version : 0.1.0-alpha
 *
 * Copyright (c) 2026 Pardus26
 * ============================================================
 */

import java.util.Properties
import java.io.FileInputStream
import java.io.FileOutputStream

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    id("org.jetbrains.kotlin.plugin.compose")
}

val versionPropsFile = rootProject.file("version.properties")
val versionProps = Properties().apply {
    if (versionPropsFile.exists()) {
        load(versionPropsFile.inputStream())
    } else {
        setProperty("build.number", "0")
    }
}

val buildNumber = versionProps.getProperty("build.number").toInt()

android {

    namespace = "com.tamercad"

    compileSdk = 35

    defaultConfig {

        applicationId = "com.tamercad"

        minSdk = 29

        targetSdk = 35

        versionCode = buildNumber

        versionName = "0.1.$buildNumber"

        testInstrumentationRunner =
            "androidx.test.runner.AndroidJUnitRunner"

        vectorDrawables {
            useSupportLibrary = true
        }

        // YENİ EKLENEN: C++ (Native) Derleme Bayrakları
        externalNativeBuild {
            cmake {
                cppFlags += ""
            }
        }
    }

    buildFeatures {

        compose = true

        buildConfig = true
    }

    // YENİ EKLENEN: C++ (CMake) Dosya Yolu Bağlantısı
    externalNativeBuild {
        cmake {
            path = file("src/main/cpp/CMakeLists.txt")
            version = "3.22.1"
        }
    }

    buildTypes {

        debug {

            applicationIdSuffix = ".debug"

            versionNameSuffix = "-debug"

            isDebuggable = true
        }

        release {

            isMinifyEnabled = true

            isShrinkResources = true

            proguardFiles(

                getDefaultProguardFile(
                    "proguard-android-optimize.txt"
                ),

                "proguard-rules.pro"
            )
        }
    }

    compileOptions {

        sourceCompatibility = JavaVersion.VERSION_21

        targetCompatibility = JavaVersion.VERSION_21
    }

    kotlinOptions {
        jvmTarget = "21"
        freeCompilerArgs += listOf("-Xjvm-default=all")
    }

    kotlin {
        jvmToolchain(21)
    }

    packaging {

        resources {

            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }

    // APK İsimlendirme Mantığı
    applicationVariants.all {
        val variant = this
        variant.outputs.all {
            val output = this as com.android.build.gradle.internal.api.ApkVariantOutputImpl
            val baseName = "TamerCad_v0.1"
            val buildNo = buildNumber
            output.outputFileName = "${baseName}.${buildNo}.apk"
        }
    }
}

tasks.register("incrementVersion") {
    group = "versioning"
    description = "Increments the build number in version.properties"
    val versionFile = layout.projectDirectory.file("../version.properties")
    
    doLast {
        val versionPropsFile = versionFile.asFile
        val versionProps = Properties()
        if (versionPropsFile.exists()) {
            versionPropsFile.inputStream().use { stream ->
                versionProps.load(stream)
            }
        }
        val currentBuildNumber = versionProps.getProperty("build.number", "0").toInt()
        val newBuildNumber = currentBuildNumber + 1
        versionProps.setProperty("build.number", newBuildNumber.toString())
        versionPropsFile.outputStream().use { stream ->
            versionProps.store(stream, null)
        }
        println("Build number incremented to: $newBuildNumber")
    }
}

// Sadece assemble (derleme) işlemleri bittiğinde numarayı artıralım
tasks.matching { it.name == "assembleDebug" || it.name == "assembleRelease" }.configureEach {
    finalizedBy("incrementVersion")
}

dependencies {

    implementation(platform(libs.androidx.compose.bom))

    androidTestImplementation(
        platform(libs.androidx.compose.bom)
    )

    implementation(libs.androidx.core.ktx)

    implementation(libs.androidx.activity.compose)

    implementation(libs.androidx.lifecycle.runtime)
    implementation(libs.androidx.lifecycle.viewmodel.compose)

    implementation(libs.androidx.navigation.compose)

    implementation(libs.kotlinx.coroutines)

    implementation(libs.androidx.material3)
    implementation("androidx.compose.material:material-icons-extended")

    // DevOps Test Otomasyonu İçin Eklenen Kütüphaneler
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}
