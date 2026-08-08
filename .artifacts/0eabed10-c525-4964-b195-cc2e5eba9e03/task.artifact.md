# TamerCAD İyileştirmeleri - Görev Listesi (TAMAMLANDI)

- [x] **Undo/Redo ve İkon Düzeltmesi**
    - [x] `material-icons-extended` kütüphanesi projeye eklendi.
    - [x] `IconRegistry.kt` içindeki Undo/Redo okları `AutoMirrored` standartlarına çekildi ve görsel olarak ayrıştırıldı.
    - [x] `CADTopBar.kt` içindeki butonlar `IconButton` yapısına geçirilerek daha hassas ve çalışan tıklama alanlarına kavuşturuldu.
- [x] **Browser (Nesne Ağacı) Canlı Liste Sorunu**
    - [x] `Assembly3D.kt` içindeki `components` listesi `mutableStateListOf` yapısına geçirildi.
    - [x] `SketchFeature.kt` içindeki `geometries` listesi `mutableStateListOf` yapısına geçirildi.
    - [x] Nesneler artık oluşturuldukları (Extrude vb.) anda Browser'da listeleniyor.
- [x] **Browser Sürükleme ve Katman Sorunu**
    - [x] `ObjectTree.kt` içine `zIndex(100f)` eklenerek en üstte olması garanti edildi.
    - [x] Sürükleme mantığı rafine edildi.
- [x] **Bağlamsal Araç Çubuğu (Contextual Toolbar) Derinleştirmesi**
    - [x] `VERTEX`, `EDGE`, `FACE`, `BODY`, `SKETCH`, `MULTIPLE` ve `FEATURE` seçimleri için özel komut setleri eklendi.
    - [x] Alt bar artık Shapr3D standartlarında zengin bir araç setine sahip.
