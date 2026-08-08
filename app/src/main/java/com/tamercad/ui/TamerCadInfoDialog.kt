package com.tamercad.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.tamercad.BuildConfig

@Composable
fun TamerCadInfoDialog(onDismiss: () -> Unit) {
    val buildVersion = try { BuildConfig.VERSION_CODE } catch (e: Exception) { 1 }

    // Kapanmama hatası, donanımsal geri tuşunu ve dışa tıklamayı destekleyen Dialog ile çözüldü
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false, dismissOnClickOutside = true, dismissOnBackPress = true)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xCC000000)),
            contentAlignment = Alignment.Center
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth(0.92f)
                    .fillMaxHeight(0.9f),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF18181C)),
                elevation = CardDefaults.cardElevation(defaultElevation = 24.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(20.dp)
                ) {
                    // Başlık Alanı
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "TamerCAD Pro v01.$buildVersion - Master Kılavuz",
                                color = Color(0xFF00BFFF),
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp
                            )
                            Text(
                                text = "Endüstriyel Hibrit 3D CAD Platformu © Tamer YAMAK",
                                color = Color.LightGray,
                                fontSize = 11.sp
                            )
                        }
                        Button(
                            onClick = onDismiss,
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFB22222)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Kapat", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Divider(color = Color(0xFF33333D), thickness = 1.dp)
                    Spacer(modifier = Modifier.height(10.dp))

                    // Kaydırılabilir Zengin Bilgi İçeriği
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f)
                            .verticalScroll(rememberScrollState())
                            .padding(end = 8.dp), // Kaydırma çubuğu payı
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        InfoSection(
                            title = "1. Mevcut Yapıda Gerçekten Yapılabilenler (Aktif Özellikler)",
                            accentColor = Color(0xFF00BFFF),
                            content = "• YZ Destekli Tahminli Çizim (Smart Pen & Predictive Sketching): Menü değiştirmeden (modsuz) kalemle çizdiğiniz serbest hatlar RDP algoritması ile anında düz çizgi, daire, dikdörtgen veya yaya dönüştürülür.\n" +
                                    "• Doğrudan Push-Pull (Extrude): Kapalı sketch alanlarının içerisinden yukarı/aşağı sürükleme ile tek hamlede 3D katı modele geçiş yapılır.\n" +
                                    "• C++ Native JNI Kernel & CSG: Boolean (Union/Subtract) ve Fillet (Kavis) hesaplamaları yüksek performanslı C++ çekirdeğinde işlenir.\n" +
                                    "• Canlı Kısıtlamalar (Snap & Constraints): Çizim esnasında yatay [H], dikey [V], paralel [//], dik [T], teğet [O] ve uç nokta/çakışık [*] kısıtlamaları otomatik kilitlenir.\n" +
                                    "• Sürükle-Bırak Malzeme Atama (Drag & Drop): Malzeme paletinden seçilen materyaller ışın izleme (Hit-Test) ile 3D gövdelere doğrudan bırakılarak atanır.\n" +
                                    "• Etkileşimli Sketch Düzenleme: Çizgilere dokunarak mavi renkli canlı ölçü kutularından klavyeden milimetrik değer girilebilir, uçlardan esnetilebilir ve Trim (Budama) aracıyla fazlalıklar silinebilir.\n" +
                                    "• 3D NavCube & STL Export: İnteraktif izometrik küp ile kamera açıları yönetilir ve modeller 3D baskı için STL formatında dışa aktarılır."
                        )

                        InfoSection(
                            title = "2. Mimari Kısıtlamalar ve Sınırlamalar",
                            accentColor = Color(0xFFFFD700),
                            content = "• Donanım Hızlandırma: Yoğun CSG matris kesişimlerinde işlemci yükü C++ tarafına devredilse de, çok büyük montajlarda ekran yenileme hızı cihaz GPU performansına bağlıdır.\n" +
                                    "• Çevrimdışı Depolama: Bulut senkronizasyonu aktif edilmediği sürece projeler yerel cihaz hafızasında (.tamercad / STL) saklanır.\n" +
                                    "• Çoklu Dokunma Önceliği: Stylus kalem algılandığında çizim modu aktif olur; parmak temasında ise kamera navigasyonuna (Orbit/Pan) geçiş yapılır."
                        )

                        InfoSection(
                            title = "3. Henüz Yapılamayan / Geliştirme Aşamasındaki Özellikler",
                            accentColor = Color(0xFFFF69B4),
                            content = "• Parametrik Tarihçe Ağacı (Feature Tree): Geçmiş operasyonların ağaç üzerinden geriye dönük parametrik olarak güncellenmesi ileri aşama sürümler için planlanmaktadır.\n" +
                                    "• Gelişmiş NURBS Yüzey Modelleme: Karmaşık serbest biçimli (Freeform) endüstriyel yüzey loft ve sweep motorlarının tam entegrasyonu devam etmektedir.\n" +
                                    "• Gerçek Zamanlı Bulut Çoklu Oturum: Firebase üzerinden aynı anda birden fazla mühendisin aynı projeyi eşzamanlı düzenlemesi henüz aktif değildir."
                        )

                        InfoSection(
                            title = "4. Adım Adım Firebase Bulut ve Veritabanı Kurulum Rehberi",
                            accentColor = Color(0xFF98FB98),
                            content = "Projelerinizi cihazlar arasında bulut üzerinden senkronize etmek için kendi Firebase projenizi kolayca bağlayabilirsiniz:\n\n" +
                                    "1. Adım: console.firebase.google.com adresine gidin ve yeni bir Proje oluşturun.\n" +
                                    "2. Adım: Proje ayarlarından bir 'Android Uygulaması' ekleyin ve paket adınızı (örn: com.tamercad) girin.\n" +
                                    "3. Adım: 'google-services.json' dosyasını indirip uygulamanın 'app/' dizinine yerleştirin.\n" +
                                    "4. Adım: Realtime Database / Firestore servisini aktif edin ve güvenlik kurallarını (Security Rules) ayarlayın.\n" +
                                    "5. Adım: CloudSyncManager sınıfı üzerinden Firebase URL ve API anahtarınızı tanımlayarak bulut senkronizasyonunu aktif edin."
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun InfoSection(title: String, accentColor: Color, content: String) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
            text = title,
            color = accentColor,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp
        )
        Text(
            text = content,
            color = Color(0xFFDDDDDD),
            fontSize = 12.sp,
            lineHeight = 17.sp
        )
    }
}
