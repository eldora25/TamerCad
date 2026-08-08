# TamerCAD: Undo/Redo Fix, Browser Observability and Contextual Depth

Bu plan, Undo/Redo sisteminin görsel ve işlevsel sorunlarını gidermeyi, Browser (Nesne Ağacı) panelinin yeni eklenen nesneleri anında listelemesini sağlamayı ve bağlamsal araç çubuğunu (Contextual Toolbar) derinleştirmeyi hedefler.

## Kullanıcı İncelemesi Gerekli

> [!IMPORTANT]
> **İkon Kütüphanesi:** Daha profesyonel ikonlara (Undo/Redo okları vb.) erişebilmek için `material-icons-extended` kütüphanesi projeye eklenecektir.
> **Liste Gözlemleme:** Nesne listesi `SnapshotStateList` (Compose uyumlu) yapısına geçirilecek, böylece bir parça eklendiğinde Browser otomatik güncellenecektir.

## Önerilen Değişiklikler

### 1. Undo/Redo ve İkon İyileştirmeleri
- **[MODIFY] libs.versions.toml & build.gradle.kts**: `material-icons-extended` bağımlılığı eklenecek.
- **[MODIFY] ui/theme/IconRegistry.kt**:
    - `Undo` ve `Redo` için gerçek yönlü oklar atanacak.
    - Diğer placeholder ikonlar daha uygun olanlarla değiştirilecek.
- **[MODIFY] ui/topbar/CADTopBar.kt**: Görsel karışıklığı gidermek için ikonların doğru hiyerarşide olduğundan emin olunacak.

### 2. Browser (Nesne Ağacı) Gözlemlenebilirliği
- **[MODIFY] core/assembly/Assembly3D.kt**: `components` listesi `mutableStateListOf<Component3D>()` olarak değiştirilecek. Bu sayede Compose, listedeki her değişikliği (ekleme/çıkarma) anında Browser'a yansıtacak.
- **[MODIFY] CADViewModel.kt**: Mevcut çizimlerin (Sketches) de Browser'da görünebilmesi için hiyerarşik yapı güçlendirilecek.

### 3. Bağlamsal Araç Çubuğu (Contextual Toolbar) Derinleştirmesi
- **[MODIFY] ui/contextual/CADContextToolbar.kt**:
    - `VERTEX` seçildiğinde: Move, Measure, Delete.
    - `BODY` seçildiğinde: Move, Rotate, Mirror, Pattern, Boolean, Hide, Delete.
    - `SKETCH` seçildiğinde: Edit, Hide, Show, Rename, Delete.
    - `MULTIPLE` seçim desteği ve ortak komutların listelenmesi.

### 4. Hata Giderimi (Bug Fixes)
- `CADViewModel.kt` içindeki `triggerUpdate()` çağrılarının tüm komut yürütme noktalarında (execute/undo/redo) doğru yerlerde olduğundan emin olunacak.

## Yol Haritası

1.  **Dependency & Icons:** İkon kütüphanesinin eklenmesi ve kayıt defterinin güncellenmesi.
2.  **State Observation:** `Assembly3D` listesinin Compose uyumlu hale getirilmesi.
3.  **Contextual Logic:** Seçim tipine göre zenginleştirilmiş araç setinin kodlanması.
4.  **Verification:** Browser'ın anlık güncellendiğinin ve Undo/Redo'nun doğru çalıştığının doğrulanması.

## Doğrulama Planı

- **Undo/Redo Testi:** Farklı ikonlara sahip butonların ilgili komutları başarıyla geri/ileri alması.
- **Browser Canlı Liste:** Bir `Extrude` işlemi yapıldığında Browser'da anında "Gövde X" nesnesinin belirmesi.
- **Zengin Menü:** Bir kenar (Edge) seçildiğinde sadece Fillet/Chamfer değil, Measure gibi ek araçların da gelmesi.
