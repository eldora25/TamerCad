#include <jni.h>
#include <vector>
#include <cmath>
#include <android/log.h>

#define LOG_TAG "TamerCAD_CPP_Kernel"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)

struct Vec3 {
    float x, y, z;
};

extern "C"
JNIEXPORT jfloatArray JNICALL
Java_com_tamercad_core_kernel_NativeKernel_executeFilletNative(JNIEnv *env, jobject thiz, jfloatArray vertices, jfloat radius) {
    LOGI("C++ Kernel: Executing B-Rep Fillet Operation");
    jsize length = env->GetArrayLength(vertices);
    jfloat *verts = env->GetFloatArrayElements(vertices, nullptr);
    std::vector<jfloat> new_verts;
    
    for (int i = 0; i < length; i += 3) {
        float x = verts[i];
        float y = verts[i + 1];
        float z = verts[i + 2];
        float offset_factor = 1.0f - (radius * 0.01f);
        new_verts.push_back(x * offset_factor);
        new_verts.push_back(y * offset_factor);
        new_verts.push_back(z * offset_factor);
    }
    env->ReleaseFloatArrayElements(vertices, verts, JNI_ABORT);
    jfloatArray result = env->NewFloatArray(new_verts.size());
    env->SetFloatArrayRegion(result, 0, new_verts.size(), new_verts.data());
    return result;
}

extern "C"
JNIEXPORT jfloatArray JNICALL
Java_com_tamercad_core_kernel_NativeKernel_executeBooleanUnionNative(JNIEnv *env, jobject thiz, jfloatArray body1, jfloatArray body2) {
    LOGI("C++ Kernel: Executing Boolean UNION Operation");
    jsize len1 = env->GetArrayLength(body1);
    jsize len2 = env->GetArrayLength(body2);
    jfloat *v1 = env->GetFloatArrayElements(body1, nullptr);
    jfloat *v2 = env->GetFloatArrayElements(body2, nullptr);

    std::vector<jfloat> union_verts;
    for(int i = 0; i < len1; ++i) union_verts.push_back(v1[i]);
    for(int i = 0; i < len2; ++i) union_verts.push_back(v2[i]);

    env->ReleaseFloatArrayElements(body1, v1, JNI_ABORT);
    env->ReleaseFloatArrayElements(body2, v2, JNI_ABORT);
    jfloatArray result = env->NewFloatArray(union_verts.size());
    env->SetFloatArrayRegion(result, 0, union_verts.size(), union_verts.data());
    return result;
}

extern "C"
JNIEXPORT jfloatArray JNICALL
Java_com_tamercad_core_kernel_NativeKernel_executeBooleanSubtractNative(JNIEnv *env, jobject thiz, jfloatArray body1, jfloatArray body2) {
    LOGI("C++ Kernel: Executing Boolean SUBTRACT Operation");
    jsize len1 = env->GetArrayLength(body1);
    jfloat *v1 = env->GetFloatArrayElements(body1, nullptr);
    
    std::vector<jfloat> sub_verts;
    for(int i = 0; i < len1; i += 3) {
        sub_verts.push_back(v1[i]);
        sub_verts.push_back(v1[i+1]);
        sub_verts.push_back(v1[i+2]);
    }

    env->ReleaseFloatArrayElements(body1, v1, JNI_ABORT);
    jfloatArray result = env->NewFloatArray(sub_verts.size());
    env->SetFloatArrayRegion(result, 0, sub_verts.size(), sub_verts.data());
    return result;
}

// YENİ EKLENEN: Aynalama (Mirror) Motoru
extern "C"
JNIEXPORT jfloatArray JNICALL
Java_com_tamercad_core_kernel_NativeKernel_executeMirrorNative(JNIEnv *env, jobject thiz, jfloatArray vertices, jfloat axisX, jfloat axisY, jfloat axisZ) {
    LOGI("C++ Kernel: Executing 3D Mirror Operation");
    jsize length = env->GetArrayLength(vertices);
    jfloat *verts = env->GetFloatArrayElements(vertices, nullptr);
    std::vector<jfloat> new_verts;
    
    for (int i = 0; i < length; i += 3) {
        float x = verts[i];
        float y = verts[i + 1];
        float z = verts[i + 2];
        
        // Basit Düzlem Aynalama (Örn: X ekseninde aynala)
        if (axisX > 0) x = -x;
        if (axisY > 0) y = -y;
        if (axisZ > 0) z = -z;
        
        new_verts.push_back(x);
        new_verts.push_back(y);
        new_verts.push_back(z);
    }
    
    env->ReleaseFloatArrayElements(vertices, verts, JNI_ABORT);
    jfloatArray result = env->NewFloatArray(new_verts.size());
    env->SetFloatArrayRegion(result, 0, new_verts.size(), new_verts.data());
    return result;
}

// YENİ EKLENEN: Doğrusal Çoğaltma (Linear Pattern) Motoru
extern "C"
JNIEXPORT jfloatArray JNICALL
Java_com_tamercad_core_kernel_NativeKernel_executePatternNative(JNIEnv *env, jobject thiz, jfloatArray vertices, jint count, jfloat spaceX, jfloat spaceY, jfloat spaceZ) {
    LOGI("C++ Kernel: Executing 3D Linear Pattern Operation");
    jsize length = env->GetArrayLength(vertices);
    jfloat *verts = env->GetFloatArrayElements(vertices, nullptr);
    std::vector<jfloat> new_verts;
    
    // Orijinal modeli ve kopyalarını oluştur
    for (int c = 0; c < count; ++c) {
        float offsetX = spaceX * c;
        float offsetY = spaceY * c;
        float offsetZ = spaceZ * c;
        
        for (int i = 0; i < length; i += 3) {
            new_verts.push_back(verts[i] + offsetX);
            new_verts.push_back(verts[i + 1] + offsetY);
            new_verts.push_back(verts[i + 2] + offsetZ);
        }
    }
    
    env->ReleaseFloatArrayElements(vertices, verts, JNI_ABORT);
    jfloatArray result = env->NewFloatArray(new_verts.size());
    env->SetFloatArrayRegion(result, 0, new_verts.size(), new_verts.data());
    return result;
}
