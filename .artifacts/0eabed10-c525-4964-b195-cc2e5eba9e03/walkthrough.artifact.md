# TamerCAD: Kenar Seçimi ve Fillet/Chamfer Manipülatörleri Walkthrough

TamerCad'in interaktif modelleme yetenekleri artık Kenarlar (Edges) seviyesine indi. Bu güncelleme ile katı modellerin kenarlarını hassas bir şekilde seçebilir ve üzerindeki akıllı tutamaçlar (manipulators) vasıtasıyla dinamik düzenlemeler yapabilirsiniz.

## 🚀 Öne Çıkan Yenilikler

### 1. Hassas Kenar Yakalama (Edge Picking)
- **Milimetrik Seçim**: [CADViewModel.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/ui/CADViewModel.kt) içindeki seçim motoru güncellendi. Artık bir kenara **25 piksel** yaklaştığınızda sistem bunu algılar ve o kenarı (Line) vurgular.
- **Hiyerarşik Öncelik**: Kenar seçimi, yüzey seçimine göre daha yüksek önceliğe sahiptir, böylece ince kenarları seçmek çok daha kolay hale gelmiştir.

### 2. Kenar Tutamaçları (Manipulators)
- **Sarı Tutamaç**: Bir kenar seçildiğinde, kenarın tam ortasında belirgin bir **Sarı Daire** ve bir yön oku belirir.
- **Dinamik Geri Bildirim**: Bu sarı tutamacı kalemle tutup çektiğinizde, o kenara ait parametreler (örn. Fillet yarıçapı) gerçek zamanlı olarak güncellenir.

### 3. Fillet ve Chamfer Özellikleri (Features)
- **Yeni Feature Tipleri**: [FilletFeature.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/core/features/FilletFeature.kt) ve [ChamferFeature.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/core/features/ChamferFeature.kt) sınıfları eklendi. Bu sınıflar seçilen kenar ID'lerini takip ederek geometrinin nasıl değiştirileceğini yönetir.

### 4. Direct Modeling Genişletmesi
- Yüzey çekiştirme (Extrude depth) mantığı artık kenarlar için de geçerli. Kenar tutamacını hareket ettirmek, model hiyerarşisindeki parametreleri anlık olarak manipüle etmenize olanak tanır.

## 🛠️ Teknik İyileştirmeler
- **Metadata Takibi**: Kenarlar artık hangi "Feature" tarafından oluşturulduklarını bilirler (`parentFeatureId`). Bu sayede bir kenarı seçtiğinizde onu oluşturan asıl işleme (örn. Extrude) doğrudan müdahale edilebilir.
- **Gelişmiş Hit-Test**: [Manipulator3D.kt](file:///C:/Projelerim/TamerCad-main/app/src/main/java/com/tamercad/ui/viewport/Manipulator3D.kt) içinde kenar ortası yakalama ve mesafe hesaplama algoritmaları optimize edildi.

## Nasıl Test Edilir?
1. **Kenar Seçimi**: Bir küp veya silindirin kenarına kalemle yaklaşın. Kenarın mavi renkle vurgulandığını görün.
2. **Manipülasyon**: Kenar seçiliyken ortasında çıkan **Sarı Tutamacı** tutup sağa-sola veya yukarı-aşağı sürükleyin.
3. **Bağlamsal Araçlar**: Kenar seçiliyken ekranın altındaki barda otomatik olarak **Fillet** ve **Chamfer** ikonlarının belirdiğini teyit edin.

> [!TIP]
> Kenar seçimi sırasında kaleminizi (Stylus) kullanmak, parmağa göre çok daha yüksek bir seçim hassasiyeti sağlayacaktır.
