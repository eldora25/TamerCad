#include <jni.h>
#include <vector>
#include <cmath>
#include <android/log.h>
#include <string>

#define LOG_TAG "TamerCAD_BRep_Kernel"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)

struct Vec3 {
    double x, y, z;
    Vec3 operator+(const Vec3& v) const { return {x + v.x, y + v.y, z + v.z}; }
    Vec3 operator-(const Vec3& v) const { return {x - v.x, y - v.y, z - v.z}; }
    Vec3 operator*(double s) const { return {x * s, y * s, z * s}; }
    double dot(const Vec3& v) const { return x * v.x + y * v.y + z * v.z; }
    Vec3 cross(const Vec3& v) const {
        return {y * v.z - z * v.y, z * v.x - x * v.z, x * v.y - y * v.x};
    }
    double length() const { return std::sqrt(x * x + y * y + z * z); }
    Vec3 normalize() const {
        double len = length();
        return len > 0 ? (*this) * (1.0 / len) : *this;
    }
};

/**
 * Siemens Parasolid™ Benzeri Endüstriyel B-Rep Topolojik Veri Yapıları
 */
struct Vertex {
    Vec3 pos;
};

struct Edge {
    int v1, v2;
};

struct Face {
    std::vector<int> edge_indices;
    Vec3 normal;

    void computeNormal(const std::vector<Vertex>& all_verts, const std::vector<Edge>& all_edges) {
        if (edge_indices.size() < 2) return;
        // Basitçe ilk iki kenardan normal bul (Düzlemsel yüzey varsayımı)
        Edge e1 = all_edges[edge_indices[0]];
        Edge e2 = all_edges[edge_indices[1]];
        Vec3 v1 = all_verts[e1.v2].pos - all_verts[e1.v1].pos;
        Vec3 v2 = all_verts[e2.v2].pos - all_verts[e2.v1].pos;
        normal = v1.cross(v2).normalize();
    }
};

extern "C"
JNIEXPORT jfloatArray JNICALL
Java_com_tamercad_core_kernel_NativeKernel_executePushPullNative(JNIEnv *env, jobject thiz, jfloatArray vertices, jint face_index, jfloat distance) {
    LOGI("C++ Kernel: Precision Push-Pull on face %d", face_index);
    jsize length = env->GetArrayLength(vertices);
    jfloat *verts = env->GetFloatArrayElements(vertices, nullptr);

    // Gerçek implementasyonda face_index'e bağlı vertex'ler bulunur.
    // Burada simülasyon: Yüzey normali varsayılan olarak Z+ (0,0,1)
    for (int i = 0; i < length; i += 3) {
        // Eğer bu vertex seçili yüzeye aitse hareket ettir (Şimdilik hepsi)
        verts[i+2] += (float)distance;
    }

    jfloatArray result = env->NewFloatArray(length);
    env->SetFloatArrayRegion(result, 0, length, verts);
    env->ReleaseFloatArrayElements(vertices, verts, JNI_ABORT);
    return result;
}

extern "C"
JNIEXPORT jfloatArray JNICALL
Java_com_tamercad_core_kernel_NativeKernel_executeMirrorNative(JNIEnv *env, jobject thiz, jfloatArray vertices, jfloat axisX, jfloat axisY, jfloat axisZ) {
    jsize length = env->GetArrayLength(vertices);
    jfloat *verts = env->GetFloatArrayElements(vertices, nullptr);
    for (int i = 0; i < length; i += 3) {
        if (axisX > 0) verts[i] = -verts[i];
        if (axisY > 0) verts[i+1] = -verts[i+1];
        if (axisZ > 0) verts[i+2] = -verts[i+2];
    }
    jfloatArray result = env->NewFloatArray(length);
    env->SetFloatArrayRegion(result, 0, length, verts);
    env->ReleaseFloatArrayElements(vertices, verts, JNI_ABORT);
    return result;
}

extern "C"
JNIEXPORT jfloatArray JNICALL
Java_com_tamercad_core_kernel_NativeKernel_executePatternNative(JNIEnv *env, jobject thiz, jfloatArray vertices, jint count, jfloat spaceX, jfloat spaceY, jfloat spaceZ) {
    jsize length = env->GetArrayLength(vertices);
    jfloat *verts = env->GetFloatArrayElements(vertices, nullptr);
    std::vector<jfloat> out;
    for(int n=0; n<count; ++n) {
        for(int i=0; i<length; i+=3) {
            out.push_back(verts[i] + (float)n*spaceX);
            out.push_back(verts[i+1] + (float)n*spaceY);
            out.push_back(verts[i+2] + (float)n*spaceZ);
        }
    }
    jfloatArray result = env->NewFloatArray(out.size());
    env->SetFloatArrayRegion(result, 0, out.size(), out.data());
    env->ReleaseFloatArrayElements(vertices, verts, JNI_ABORT);
    return result;
}
