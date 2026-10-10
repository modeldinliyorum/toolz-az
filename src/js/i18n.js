// Internationalisation for Toolz-AZ
//
// Two languages: English (the original) and Turkish. English strings are kept
// inline as the default, so removing this file entirely would still leave a
// working English site.
//
// Translations are applied by:
//
//   data-i18n="key"                  -> textContent
//   data-i18n-attr="placeholder:key"
//                                   -> the named attribute (aria-label, title,
//                                      placeholder)
//   data-i18n-html="key"             -> innerHTML (only for strings we control)
//
// The active language is resolved from, in order: an explicit user choice in
// localStorage, then the browser's languages, then English. `document.documentElement.lang`
// is kept in sync so screen readers switch voice along with the text.

const I18N_LANGS = {

en: { label: 'English', short: 'EN' },

tr: { label: 'Türkçe', short: 'TR' }

};

const I18N_STRINGS = {

// ---- navigation & shell ----
'nav.home': { en: 'Home', tr: 'Ana sayfa' },
'nav.about': { en: 'About', tr: 'Hakkında' },
'nav.toggle_theme': { en: 'Toggle theme', tr: 'Temayı değiştir' },
'nav.theme_dark': { en: 'DARK', tr: 'KOYU' },
'nav.theme_light': { en: 'LIGHT', tr: 'AÇIK' },
'nav.licence': { en: 'Developed under an MIT license.', tr: 'MIT lisansı ile geliştirildi.' },
'nav.toggle_lang': { en: 'Change language', tr: 'Dili değiştir' },
'brand.tagline': { en: 'Toolz-AZ', tr: 'Toolz-AZ' },

// ---- dashboard ----
'dash.title': { en: 'Dashboard', tr: 'Panel' },
'dash.subtitle': { en: 'Choose a tool to get started', tr: 'Başlamak için bir araç seçin' },

// ---- shared upload ----
'upload.drag': { en: 'Drag & drop an image here', tr: 'Buraya bir görsel sürükleyip bırakın' },
'upload.drag_photo': { en: 'Drag & drop a photo here', tr: 'Buraya bir fotoğraf sürükleyip bırakın' },
'upload.or': { en: 'or', tr: 'veya' },
'upload.choose_image': { en: 'Choose Image', tr: 'Görsel seç' },
'upload.choose_photo': { en: 'Choose Photo', tr: 'Fotoğraf seç' },
'upload.formats_std': { en: 'JPEG, PNG, WebP, GIF, BMP', tr: 'JPEG, PNG, WebP, GIF, BMP' },
'upload.formats_any': { en: 'Any image format', tr: 'Tüm görsel formatları' },
'upload.formats_conv': { en: 'JPG, PNG, WebP, BMP, GIF, AVIF', tr: 'JPG, PNG, WebP, BMP, GIF, AVIF' },
'upload.formats_meta': { en: 'JPEG, PNG, WebP', tr: 'JPEG, PNG, WebP' },
'btn.remove': { en: 'Remove', tr: 'Kaldır' },
'btn.download': { en: 'Download', tr: 'İndir' },
'btn.copy': { en: 'Copy', tr: 'Kopyala' },
'btn.clear': { en: 'Clear', tr: 'Temizle' },
'btn.generate': { en: 'Generate', tr: 'Oluştur' },
'btn.convert': { en: 'Convert', tr: 'Dönüştür' },
'btn.result': { en: 'Result', tr: 'Sonuç' },
'btn.copied': { en: 'Copied!', tr: 'Kopyalandı!' },
'btn.failed': { en: 'Failed', tr: 'Başarısız' },

// ---- status badges ----
'status.ready': { en: 'Ready', tr: 'Hazır' },
'status.coming_soon': { en: 'Coming Soon', tr: 'Yakında' },
'status.in_development': { en: 'In Development', tr: 'Geliştiriliyor' },
'meta.tag_camera_make': { en: 'camera make', tr: 'kamera markası' },
'meta.tag_camera_model': { en: 'camera model', tr: 'kamera modeli' },
'meta.tag_orientation': { en: 'orientation', tr: 'oryantasyon' },
'meta.tag_software': { en: 'software', tr: 'yazılım' },
'meta.tag_file_modified': { en: 'file modified', tr: 'dosya değiştirilme' },
'meta.tag_exposure_time': { en: 'exposure time', tr: 'poz süresi' },
'meta.tag_aperture': { en: 'aperture', tr: 'diyafram' },
'meta.tag_iso_speed': { en: 'ISO speed', tr: 'ISO hızı' },
'meta.tag_date_taken': { en: 'date taken', tr: 'çekim tarihi' },
'meta.tag_date_digitised': { en: 'date digitised', tr: 'dijitalleştirme tarihi' },
'meta.tag_focal_length': { en: 'focal length', tr: 'odak uzaklığı' },
'meta.tag_pixel_dimensions': { en: 'pixel dimensions', tr: 'piksel ölçüleri' },
'meta.tag_camera_owner_name': { en: 'camera owner name', tr: 'kamera sahibi adı' },
'meta.tag_camera_serial_number': { en: 'camera serial number', tr: 'kamera seri numarası' },
'meta.tag_lens_make': { en: 'lens make', tr: 'objektif markası' },
'meta.tag_lens_model': { en: 'lens model', tr: 'objektif modeli' },
'meta.will_be_removed': { en: 'Will be removed', tr: 'Kaldırılacak' },
'meta.nothing_to_remove': { en: 'Nothing to remove', tr: 'Kaldırılacak bir şey yok' },
'status.beta': { en: 'Beta', tr: 'Beta' },
'status.will_be_removed': { en: 'Will be removed', tr: 'Kaldırılacak' },
'status.nothing_to_remove': { en: 'Nothing to remove', tr: 'Kaldırılacak bir şey yok' },
'status.clean': { en: 'clean', tr: 'temiz' },
'status.not_present': { en: 'not present', tr: 'bulunamadı' },
'status.beta_aria': { en: 'beta', tr: 'beta' },

// ---- shared stat labels ----
'stat.original_size': { en: 'Original size', tr: 'Orijinal boyut' },
'stat.output_size': { en: 'Output size', tr: 'Çıktı boyutu' },
'stat.size_change': { en: 'Size Change', tr: 'Boyut değişimi' },
'stat.dimensions': { en: 'Dimensions', tr: 'Boyutlar' },
'stat.format': { en: 'Format', tr: 'Format' },
'stat.cleaned_size': { en: 'Cleaned size', tr: 'Temizlenmiş boyut' },
'stat.image_data': { en: 'Image data', tr: 'Görsel verisi' },
'stat.untouched_lossless': { en: 'Untouched (lossless)', tr: 'Dokunulmadı (kayıpsız)' },
'stat.reencoded_rotation': { en: 'Re-encoded to apply rotation', tr: 'Döndürme uygulanmak için yeniden kodlandı' },

// ---- tool 1: compressor ----
'compressor.title': { en: 'Image Compressor', tr: 'Görsel Sıkıştırıcı' },
'compressor.subtitle': { en: 'Compress and resize images client-side', tr: 'Görselleri tarayıcıda sıkıştırın ve boyutlandırın' },
'compressor.desc': { en: 'Compress and resize images while maintaining quality.', tr: 'Kaliteyi koruyarak görselleri sıkıştırın ve boyutlandırın.' },
'compressor.resize': { en: 'Resize', tr: 'Boyutlandır' },
'compressor.width': { en: 'Width', tr: 'Genişlik' },
'compressor.height': { en: 'Height', tr: 'Yükseklik' },
'compressor.px': { en: 'px', tr: 'px' },
'compressor.lock_aspect': { en: 'Lock aspect ratio', tr: 'En boy oranını kilitle' },
'compressor.reset': { en: 'Reset to original', tr: 'Orijinale sıfırla' },
'compressor.output': { en: 'Output', tr: 'Çıktı' },
'compressor.format': { en: 'Format', tr: 'Format' },
'compressor.quality': { en: 'Quality:', tr: 'Kalite:' },
'compressor.quality_note': { en: 'Quality slider applies to JPEG and WebP. PNG uses lossless compression.', tr: 'Kalite kaydırıcısı JPEG ve WebP için geçerlidir. PNG sıkıştırması kayıpsızdır.' },
'alt.preview': { en: 'Preview of the uploaded image', tr: 'Yüklenen görselin önizlemesi' },

'compressor.output_preview': { en: 'Output Preview', tr: 'Çıktı Önizlemesi' },
'compressor.estimated': { en: 'Estimated:', tr: 'Tahmini:' },
'compressor.generating': { en: 'Generating...', tr: 'Oluşturuluyor...' },
'compressor.estimating': { en: 'Estimating...', tr: 'Hesaplanıyor...' },
'compressor.compress_generate': { en: 'Compress & Generate', tr: 'Sıkıştır ve Oluştur' },
'compressor.resize_generate': { en: 'Resize & Generate', tr: 'Boyutlandır ve Oluştur' },
'compressor.convert_generate': { en: 'Convert & Generate', tr: 'Dönüştür ve Oluştur' },
'compressor.resize_convert': { en: 'Resize & Convert', tr: 'Boyutlandır ve Dönüştür' },
'compressor.generate_output': { en: 'Generate Output', tr: 'Çıktı Oluştur' },
'compressor.error_generate': { en: 'Error generating image. Try a different format or check your browser support.', tr: 'Görsel oluşturulurken hata oluştu. Farklı bir format deneyin veya tarayıcı desteğini kontrol edin.' },

// ---- tool 2: resizer ----
'resizer.title': { en: 'Image Resizer', tr: 'Görsel Boyutlandırıcı' },
'resizer.subtitle': { en: 'Resize images to specific dimensions', tr: 'Görselleri belirli ölçülere göre boyutlandırın' },
'resizer.desc': { en: 'Resize images to specific dimensions.', tr: 'Görselleri belirli ölçülere göre boyutlandırın.' },
'resizer.dimensions': { en: 'Dimensions', tr: 'Ölçüler' },
'resizer.width': { en: 'Width', tr: 'Genişlik' },
'resizer.height': { en: 'Height', tr: 'Yükseklik' },
'resizer.px': { en: 'px', tr: 'px' },
'resizer.scale': { en: 'Scale:', tr: 'Ölçek:' },
'resizer.lock_aspect': { en: 'Lock aspect ratio', tr: 'En boy oranını kilitle' },
'resizer.reset': { en: 'Reset to original', tr: 'Orijinale sıfırla' },
'resizer.output_preview': { en: 'Output Preview', tr: 'Çıktı Önizlemesi' },
'resizer.generate': { en: 'Generate', tr: 'Oluştur' },
'resizer.generating': { en: 'Generating...', tr: 'Oluşturuluyor...' },
'resizer.error_generate': { en: 'Error generating resized image.', tr: 'Boyutlandırılmış görsel oluşturulurken hata oluştu.' },
'resizer.error_failed': { en: 'Failed to generate resized image.', tr: 'Boyutlandırılmış görsel oluşturulamadı.' },
'resizer.error_first': { en: 'Generate the image first.', tr: 'Önce görseli oluşturun.' },

// ---- tool 3: background removal ----
'bgrem.title': { en: 'Background Removal', tr: 'Arka Plan Kaldırma' },
'bgrem.subtitle': { en: 'Remove image backgrounds automatically', tr: 'Görsel arka planlarını otomatik kaldırın' },
'bgrem.desc': { en: 'Remove backgrounds from images automatically.', tr: 'Görsellerden arka planları otomatik olarak kaldırın.' },
'bgrem.clean_btn': { en: 'Remove Background', tr: 'Arka Planı Kaldır' },
'bgrem.download_png': { en: 'Download PNG', tr: 'PNG İndir' },
'bgrem.model': { en: 'Model', tr: 'Model' },
'bgrem.model_fast': { en: 'Fast — 44 MB, recommended', tr: 'Hızlı — 44 MB, önerilen' },
'bgrem.model_balanced': { en: 'Balanced — 88 MB', tr: 'Dengeli — 88 MB' },
'bgrem.model_quality': { en: 'Best quality — 176 MB', tr: 'En iyi kalite — 176 MB' },
'bgrem.model_note': { en: 'The first run downloads the model; later runs reuse the browser cache.', tr: 'İlk çalıştırmada model indirilir; sonraki çalıştırmalar tarayıcı önbelleğini kullanır.' },
'bgrem.working': { en: 'Removing background... This may take 10-30 seconds on first run.', tr: 'Arka plan kaldırılıyor... İlk çalıştırmada 10-30 saniye sürebilir.' },
'bgrem.loading_model': { en: 'Loading model...', tr: 'Model yükleniyor...' },
'bgrem.loading_lib': { en: 'Loading background removal model...', tr: 'Arka plan kaldırma modeli yükleniyor...' },
'bgrem.processing': { en: 'Processing image...', tr: 'Görsel işleniyor...' },
'bgrem.downloading_model': { en: 'Downloading model assets...', tr: 'Model dosyaları indiriliyor...' },
'bgrem.downloading_model_of': { en: 'Downloading model (', tr: 'Model indiriliyor (' },
'bgrem.error_failed': { en: 'Background removal failed.', tr: 'Arka plan kaldırma başarısız oldu.' },
'bgrem.error_network': { tr: 'Modeli yüklemek için internet bağlantınızı kontrol edip tekrar deneyin.', en: 'Please check your internet connection to load the model and try again.' },

// ---- tool 4: palette ----
'palette.title': { en: 'Color Palette Extractor', tr: 'Renk Paleti Çıkarıcı' },
'palette.subtitle': { en: 'Extract dominant colors from images', tr: 'Görsellerden baskın renkleri çıkarın' },
'palette.desc': { en: 'Extract dominant colors from any image.', tr: 'Her görselden baskın renkleri çıkarın.' },
'palette.mode_dominant': { en: 'Dominant Colors', tr: 'Baskın Renkler' },
'palette.mode_all': { en: 'All Colors', tr: 'Tüm Renkler' },
'palette.count_label': { en: 'colors', tr: 'renk' },
'palette.sort_common': { en: 'Most common', tr: 'En yaygın' },
'palette.sort_rare': { en: 'Least common', tr: 'En az yaygın' },
'palette.sort_hex': { en: 'HEX A-Z', tr: 'HEX A-Z' },
'palette.extracted': { en: 'Extracted Palette', tr: 'Çıkarılan Palet' },
'palette.copy_palette': { en: 'Copy Palette', tr: 'Paleti Kopyala' },
'palette.copy_hex': { en: 'Copy HEX', tr: 'HEX Kopyala' },
'palette.copy_rgb': { en: 'Copy RGB', tr: 'RGB Kopyala' },
'palette.no_colors': { en: 'No colors extracted', tr: 'Renk çıkarılamadı' },
'palette.showing_dominant': { en: 'Showing', tr: 'Gösterilen' },
'palette.dominant_color': { en: 'dominant color(s)', tr: 'baskın renk' },
'palette.unique_color': { en: 'unique color(s)', tr: 'benzersiz renk' },
'palette.analysed_at': { en: 'analysed at', tr: 'analiz edildi' },
'palette.for_performance': { en: 'for performance', tr: 'performans için' },
'search_hex': { en: 'Search HEX...', tr: 'HEX ara...' },
'palette.count_five': { en: '5 colors', tr: '5 renk' },
'palette.count_eight': { en: '8 colors', tr: '8 renk' },
'palette.count_ten': { en: '10 colors', tr: '10 renk' },
'palette.count_twelve': { en: '12 colors', tr: '12 renk' },
'palette.count_sixteen': { en: '16 colors', tr: '16 renk' },
'palette.copy_error': { en: 'Failed to copy palette. Please try again.', tr: 'Palet kopyalanamadı. Lütfen tekrar deneyin.' },

// ---- tool 5: QR ----
'qr.title': { en: 'QR Code Generator', tr: 'QR Kod Oluşturucu' },
'qr.subtitle': { en: 'Generate QR codes from text or URLs', tr: 'Metin veya bağlantılardan QR kod oluşturun' },
'qr.desc': { en: 'Generate QR codes from text or URLs.', tr: 'Metin veya bağlantılardan QR kod oluşturun.' },
'qr.input_label': { en: 'Enter text or URL', tr: 'Metin veya bağlantı girin' },
'qr.input_placeholder': { en: 'https://example.com or any text...', tr: 'https://example.com veya herhangi bir metin...' },
'qr.error_empty': { en: 'Please enter some text or a URL', tr: 'Lütfen bir metin veya bağlantı girin' },
'qr.size': { en: 'QR Size', tr: 'QR Boyutu' },
'qr.margin': { en: 'QR Margin', tr: 'QR Kenar Boşluğu' },
'qr.margin_small': { en: 'Small', tr: 'Küçük' },
'qr.margin_medium': { en: 'Medium', tr: 'Orta' },
'qr.margin_large': { en: 'Large', tr: 'Büyük' },
'qr.color': { en: 'QR Color', tr: 'QR Rengi' },
'qr.bg_color': { en: 'Background Color', tr: 'Arka Plan Rengi' },
'qr.color_hex': { en: 'QR code color (HEX)', tr: 'QR kodu rengi (HEX)' },
'qr.bg_hex': { en: 'QR background color (HEX)', tr: 'QR arka plan rengi (HEX)' },
'qr.warning_contrast': { en: 'These colors may make the QR code difficult to scan.', tr: 'Bu renkler QR kodunun okunmasını zorlaştırabilir.' },
'qr.generate': { en: 'Generate QR Code', tr: 'QR Kod Oluştur' },
'qr.generating': { en: 'Generating...', tr: 'Oluşturuluyor...' },
'qr.error_failed': { en: 'Failed to generate QR code. Please try again.', tr: 'QR kod oluşturulamadı. Lütfen tekrar deneyin.' },
'qr.download_format': { en: 'Download Format', tr: 'İndirme Formatı' },
'qr.lib_error': { en: 'The QR code library could not be loaded. Please check your internet connection and reload the page.', tr: 'QR kod kitaplığı yüklenemedi. İnternet bağlantınızı kontrol edip sayfayı yenileyin.' },

// ---- tool 6: image converter ----
'conv.title': { en: 'Image Converter', tr: 'Görsel Dönüştürücü' },
'conv.subtitle': { en: 'Convert images between JPG, PNG, WebP, BMP, GIF and AVIF', tr: 'Görselleri JPG, PNG, WebP, BMP, GIF ve AVIF arasında dönüştürün' },
'conv.desc': { en: 'Convert images between JPG, PNG, WebP, BMP, GIF and AVIF.', tr: 'Görselleri JPG, PNG, WebP, BMP, GIF ve AVIF arasında dönüştürün.' },
'conv.output': { en: 'Output', tr: 'Çıktı' },
'conv.format': { en: 'Format', tr: 'Format' },
'conv.gif_note': { en: 'Animated GIFs are converted as a single frame (the first frame is used).', tr: 'Animasyonlu GIFler tek kareye dönüştürülür (ilk kare kullanılır).' },
'conv.quality_note': { en: 'Quality applies to JPG, WebP and AVIF. PNG, GIF and BMP are lossless.', tr: 'Kalite JPG, WebP ve AVIF için geçerlidir. PNG, GIF ve BMP kayıpsızdır.' },
'conv.quality': { en: 'Quality:', tr: 'Kalite:' },
'conv.converting': { en: 'Converting image...', tr: 'Görsel dönüştürülüyor...' },
'conv.output_preview': { en: 'Output Preview', tr: 'Çıktı Önizlemesi' },
'conv.convert': { en: 'Convert', tr: 'Dönüştür' },
'conv.error_unsupported': { en: 'Unsupported file type. Please drop a supported image (JPG, PNG, WebP, BMP, GIF, AVIF).', tr: 'Desteklenmeyen dosya türü. Lütfen desteklenen bir görsel bırakın (JPG, PNG, WebP, BMP, GIF, AVIF).' },
'conv.error_read': { en: 'Could not read this image. The file may be corrupt or unsupported.', tr: 'Bu görsel okunamadı. Dosya bozuk veya desteklenmiyor olabilir.' },

// ---- tool 7: metadata cleaner ----
'meta.title': { en: 'Metadata Cleaner', tr: 'Meta Veri Temizleyici' },
'meta.subtitle': { en: 'Remove EXIF, GPS and hidden data from a photo', tr: 'Fotoğraftan EXIF, GPS ve gizli verileri kaldırın' },
'meta.desc': { en: 'Remove EXIF, GPS and hidden data from a photo.', tr: 'Fotoğraftan EXIF, GPS ve gizli verileri kaldırın.' },
'meta.clean_btn': { en: 'Clean Metadata', tr: 'Meta Veriyi Temizle' },
'meta.cleaning': { en: 'Cleaning...', tr: 'Temizleniyor...' },
'meta.cleaned_photo': { en: 'Cleaned photo', tr: 'Temizlenmiş fotoğraf' },
'meta.metadata_found': { en: 'Metadata found', tr: 'Meta veri bulundu' },
'meta.no_metadata': { en: 'No metadata found', tr: 'Meta veri bulunamadı' },
'meta.already_clean': { en: 'This file is already clean. Scanned its container for', tr: 'Bu dosya zaten temiz. Şunlar tarandı:' },
'meta.nothing_found': { tr: 'Hiçbir şey bulunamadı, bu yüzden indirilecek dosya orijinalin birebir kopyasıdır.', en: 'Nothing was found, so the download is a byte-for-byte copy of the original.' },
'meta.detail_exif': { en: 'Camera and timestamp data', tr: 'Kamera ve zaman damgası verileri' },
'meta.detail_app': { en: 'Application data', tr: 'Uygulama verisi' },
'meta.detail_text': { en: 'Embedded text and comments', tr: 'Gömülü metinler ve yorumlar' },
'meta.detail_time': { en: 'Last modified timestamp', tr: 'Son değiştirme zaman damgası' },
'meta.detail_anim': { en: 'Animation control data', tr: 'Animasyon kontrol verileri' },
'meta.kind_exif': { en: 'EXIF', tr: 'EXIF' },
'meta.kind_text': { en: 'TEXT', tr: 'METİN' },
'meta.kind_time': { en: 'TIME', tr: 'ZAMAN' },
'meta.kind_anim': { en: 'ANIM', tr: 'ANİM' },
'meta.kind_app': { en: 'APP', tr: 'APP' },
'meta.kind_icc': { en: 'ICC', tr: 'ICC' },
'meta.kind_xmp': { en: 'XMP', tr: 'XMP' },
'ui.no_significant_change': { en: 'No significant size change', tr: 'Belirgin bir boyut değişikliği yok' },
'b64.error_nothing_to_convert': { en: 'Nothing to convert.', tr: 'Dönüştürülecek bir şey yok.' },
'meta.all_containers': { en: 'all known metadata containers.', tr: 'bilinen tüm meta veri kapsayıcıları.' },
'meta.rotation_note': { en: 'This photo used an EXIF rotation (orientation', tr: 'Bu fotoğraf bir EXIF döndürmesi kullandı (oryantasyon' },
'meta.rotation_baked': { en: '). The rotation was baked into the pixels so the picture still looks the same once the tag is removed, which means it had to be re-encoded.', tr: '). Etiket kaldırıldığında görsel aynı görünmeye devam etsin diye döndürme pikselere işlendi; bu da yeniden kodlamayı gerektirdi.' },
'meta.saves_note': { en: 'Cleaning removes', tr: 'Temizleme şunları kaldırır:' },
'meta.hidden_data': { en: 'of hidden data. The picture itself is not re-encoded, so there is no quality loss.', tr: 'gizli veri. Görselin kendisi yeniden kodlanmaz, dolayısıyla kalite kaybı olmaz.' },
'meta.no_loss': { en: 'The picture itself is not re-encoded, so there is no quality loss.', tr: 'Görselin kendisi yeniden kodlanmaz, dolayısıyla kalite kaybı olmaz.' },
'meta.error_format': { en: 'This format cannot be cleaned in the browser. Please use a JPEG, PNG or WebP file.', tr: 'Bu format tarayıcıda temizlenemez. Lütfen JPEG, PNG veya WebP kullanın.' },
'meta.error_type': { en: 'Unsupported file type. Please choose a JPEG, PNG or WebP image.', tr: 'Desteklenmeyen dosya türü. Lütfen bir JPEG, PNG veya WebP görseli seçin.' },
'meta.error_read': { en: 'Could not read this image. The file may be corrupt or unsupported.', tr: 'Bu görsel okunamadı. Dosya bozuk veya desteklenmiyor olabilir.' },
'meta.error_display': { en: 'The cleaned image could not be displayed. The file may be damaged.', tr: 'Temizlenmiş görsel gösterilemedi. Dosya hasarlı olabilir.' },
'meta.error_reencode': { en: 'Could not re-encode this photo.', tr: 'Bu fotoğraf yeniden kodlanamadı.' },
'meta.detail_exif_camera': { en: 'Camera and timestamp data', tr: 'Kamera ve zaman damgası verileri' },
'meta.detail_exif_gps': { en: 'Camera, GPS and timestamp data', tr: 'Kamera, GPS ve zaman damgası verileri' },
'meta.detail_xmp': { en: 'Adobe editing history', tr: 'Adobe düzenleme geçmişi' },
'meta.detail_icc': { en: 'Embedded colour profile', tr: 'Gömülü renk profili' },
'meta.detail_exif_data': { en: 'EXIF data', tr: 'EXIF verisi' },
'meta.detail_contains': { en: 'Contains', tr: 'İçerik:' },
'meta.detail_gps': { en: 'GPS location', tr: 'GPS konumu' },
'meta.detail_and_more': { en: 'more fields', tr: 'alan daha' },
'meta.declared_mismatch': { en: 'Note: the data URI declared', tr: 'Not: veri URI şunu bildirdi' },
'meta.but_actually': { en: 'but the data is actually', tr: 'ancak veri aslında' },
'meta.detected_used': { en: '. The detected type was used.', tr: '. Algılanan tür kullanıldı.' },

// ---- tool 8: base64 ----
'b64.title': { en: 'Base64 / Image Converter', tr: 'Base64 / Görsel Dönüştürücü' },
'b64.subtitle': { en: 'Convert images to Base64 and back again', tr: 'Görselleri Base64’e ve geri dönüştürün' },
'b64.desc': { en: 'Convert images to Base64, or Base64 back to an image.', tr: 'Görselleri Base64’e veya Base64’ü görsele dönüştürün.' },
'b64.tab_to_b64': { en: 'Image → Base64', tr: 'Görsel → Base64' },
'b64.tab_to_image': { en: 'Base64 → Image', tr: 'Base64 → Görsel' },
'b64.output': { en: 'Base64 output', tr: 'Base64 çıktısı' },
'b64.copy_data_uri': { en: 'Copy as data URI', tr: 'Data URI olarak kopyala' },
'b64.download_txt': { en: 'Download .txt', tr: '.txt indir' },
'b64.wrap': { en: 'Wrap at 76 characters', tr: '76 karakterde satırla' },
'b64.chars': { en: 'chars', tr: 'karakter' },
'b64.meta_line': { en: 'characters, including', tr: 'karakter, bunların içinde' },
'b64.line_breaks': { en: 'line breaks when wrapped.', tr: 'satır sonu var.' },
'b64.base64_length': { en: 'Base64 length', tr: 'Base64 uzunluğu' },
'b64.overhead': { en: 'Overhead', tr: 'Ek boyut' },
'b64.data_uri_length': { en: 'Data URI length', tr: 'Data URI uzunluğu' },
'b64.input_label': { en: 'Paste a Base64 string or a data URI', tr: 'Bir Base64 metni veya data URI yapıştırın' },
'b64.input_placeholder': { en: 'data:image/png;base64,iVBORw0KGgo...\n\nor a raw Base64 payload on its own', tr: 'data:image/png;base64,iVBORw0KGgo...\n\nveya yalnızca ham Base64 verisi' },
'b64.input_hint': { en: 'Whitespace and line breaks are ignored. A data URI prefix is detected and removed automatically.', tr: 'Boşluklar ve satır sonları yok sayılır. Data URI ön eki otomatik algılanıp kaldırılır.' },
'b64.convert_to_image': { en: 'Convert to Image', tr: 'Görsele Dönüştür' },
'b64.decoded_image': { en: 'Decoded image', tr: 'Çözümlenen görsel' },
'b64.detected_type': { en: 'Detected type', tr: 'Algılanan tür' },
'b64.decoded_size': { en: 'Decoded size', tr: 'Çözülen boyut' },
'b64.input_length': { en: 'Input length', tr: 'Girdi uzunluğu' },
'b64.error_empty': { en: 'Paste a Base64 string or choose an image first.', tr: 'Önce bir Base64 metni yapıştırın veya bir görsel seçin.' },
'b64.error_url': { en: 'That looks like a URL, not a Base64 string. Open the image, then copy its Base64 data.', tr: 'Bu bir Base64 metni değil, URL gibi görünüyor. Görseli açıp Base64 verisini kopyalayın.' },
'b64.error_not_base64_uri': { en: 'That data URI is not Base64 encoded (it uses percent-encoding).', tr: 'Bu data URI Base64 kodlanmamış (yüzde kodlaması kullanıyor).' },
'b64.error_bad_uri': { en: 'That data URI could not be parsed.', tr: 'Bu data URI ayrıştırılamadı.' },
'b64.error_no_data': { en: 'The input contained no Base64 data.', tr: 'Girdi herhangi bir Base64 veri içermiyordu.' },
'b64.error_bad_char': { en: 'The input contains a character that cannot appear in Base64:', tr: 'Girdi Base64 içinde yer alamayacak bir karakter içeriyor:' },
'b64.error_inconsistent': { en: 'The input is not valid Base64: its length is inconsistent.', tr: 'Girdi geçerli Base64 değil: uzunluğu tutarsız.' },
'b64.error_too_large': { en: 'That input is too large to convert safely in the browser.', tr: 'Bu girdi tarayıcıda güvenle dönüştürülemeyecek kadar büyük.' },
'b64.error_decode_failed': { en: 'That string could not be decoded as Base64.', tr: 'Bu metin Base64 olarak çözümlenemedi.' },
'b64.error_zero_bytes': { en: 'The input decoded to zero bytes, so there is no image to show.', tr: 'Girdi sıfır bayta çözüldü, gösterilecek görsel yok.' },
'b64.error_not_image': { en: 'That Base64 is valid, but it is not an image. Supported:', tr: 'Bu Base64 geçerli ancak bir görsel değil. Desteklenenler:' },
'b64.error_cannot_display': { en: 'The data decoded to', tr: 'Veri şu türe çözüldü:' },
'b64.error_browser_display': { en: 'but this browser cannot display that format.', tr: 'ancak bu tarayıcı bu formatı gösteremiyor.' },
'b64.nothing_to_copy': { en: 'There is nothing to copy yet.', tr: 'Henüz kopyalanacak bir şey yok.' },
'b64.nothing_to_download': { en: 'There is nothing to download yet.', tr: 'Henüz indirilecek bir şey yok.' },
'b64.convert_first': { en: 'Convert a Base64 string first.', tr: 'Önce bir Base64 metnini dönüştürün.' },
'b64.copy_failed': { en: 'Copy failed', tr: 'Kopyalanamadı' },
'b64.error_read_file': { en: 'Could not read that file.', tr: 'Bu dosya okunamadı.' },
'b64.error_unsupported': { en: 'Unsupported file type. Please choose an image.', tr: 'Desteklenmeyen dosya türü. Lütfen bir görsel seçin.' },
'b64.declared_mismatch': { en: 'Note: the data URI declared', tr: 'Not: veri URI şunu bildirdi' },
'b64.but_actually': { en: 'but the data is actually', tr: 'ancak veri aslında' },
'b64.detected_used': { en: '. The detected type was used.', tr: '. Algılanan tür kullanıldı.' },
'compressor.quality_note_png': { en: 'PNG uses lossless compression. Quality settings do not apply.', tr: 'PNG sıkıştırması kayıpsızdır. Kalite ayarları uygulanmaz.' },
'compressor.estimated_label': { en: 'Estimating...', tr: 'Hesaplanıyor...' },
'compressor.preview_generated': { en: 'Preview generated', tr: 'Önizleme oluşturuldu' },
'compressor.generate_output_label': { en: 'Generate Output', tr: 'Çıktı Oluştur' },
'palette.no_colors_msg': { en: 'No colors extracted', tr: 'Renk çıkarılamadı' },
'palette.showing_dominant_msg': { en: 'Showing {n} dominant color(s)', tr: '{n} baskın renk gösteriliyor' },
'palette.showing_unique_msg': { en: 'Showing {n} of {total} unique color(s)', tr: '{total} benzersiz rengin {n} tanesi gösteriliyor' },
'meta.error_read_file': { en: 'Could not read this file.', tr: 'Bu dosya okunamadı.' },
'conv.error_failed': { en: 'Conversion failed:', tr: 'Dönüştürme başarısız:' },
'conv.error_unknown': { en: 'Unknown error.', tr: 'Bilinmeyen hata.' },
'batch.title': { en: 'Batch', tr: 'Toplu İşlem' },

'batch.add_more': { en: 'Add more', tr: 'Daha fazla ekle' },
'batch.subtitle': { en: 'These settings are applied to every image.', tr: 'Bu ayarlar her görsele uygulanır.' },
'batch.run_again': { en: 'Run again', tr: 'Tekrar İşle' },
'batch.run': { en: 'Process all', tr: 'Tümünü İşle' },
'batch.download_all': { en: 'Download all (ZIP)', tr: 'Tümünü İndir (ZIP)' },
'batch.packing': { en: 'Packing ZIP...', tr: 'ZIP paketleniyor...' },
'batch.progress': { en: 'Processing', tr: 'İşleniyor' },
'batch.done': { en: 'done', tr: 'tamamlandı' },
'qr.error_no_code': { en: 'No QR code to download. Generate one first.', tr: 'İndirilecek QR kodu yok. Önce bir kod oluşturun.' },

'meta.error_clean_first': { en: 'Clean the photo first.', tr: 'Önce fotoğrafı temizleyin.' },

'status.coming_soon_msg': { en: '{title} is coming soon! Check back later.', tr: '{title} yakında geliyor! Daha sonra tekrar kontrol edin.' },

'batch.cancel': { en: 'Cancel', tr: 'Iptal' },

'batch.summary_cancelled': { en: '{n} skipped', tr: '{n} atlandı' },

'batch.zip_name': { en: 'toolz-az-images-{n}.zip', tr: 'toolz-az-gorseller-{n}.zip' },
'batch.summary_done': { en: '{n} processed', tr: '{n} işlendi' },
'batch.summary_failed': { en: '{n} failed', tr: '{n} başarısız' },
'batch.error_generic': { en: 'This image could not be processed.', tr: 'Bu görsel işlenemedi.' },
'batch.limit_reached': { en: 'Only the first {n} images are kept in one batch.', tr: 'Tek bir toplu işlemde yalnızca ilk {n} görsel tutulur.' },
'batch.queued': { en: 'queued', tr: 'beklemede' },
'batch.files_one': { en: '{n} image', tr: '{n} görsel' },
'batch.files_other': { en: '{n} images', tr: '{n} görsel' },
'b64.formats_list': { en: 'JPEG, PNG, GIF, BMP, WebP, AVIF, HEIC, ICO and SVG', tr: 'JPEG, PNG, GIF, BMP, WebP, AVIF, HEIC, ICO ve SVG' },
'b64.error_read_image': { en: 'Could not read this image. The file may be corrupt or unsupported.', tr: 'Bu görsel okunamadı. Dosya bozuk veya desteklenmiyor olabilir.' },

// ---- about page ----
'about.eyebrow': { en: 'Toolz-AZ', tr: 'Toolz-AZ' },
'about.headline': { en: 'Everyday image tools, running entirely in your browser', tr: 'Tamamen tarayıcınızda çalışan günlük görsel araçları' },
'about.lede_prefix': { en: '\u00a0utilities for compressing, resizing, converting and inspecting images. Nothing is uploaded, nothing is stored, and nothing is tracked.', tr: '\u00a0görsel sıkıştırma, boyutlandırma, dönüştürme ve inceleme aracı. Hiçbir şey yüklenmez, saklanmaz veya izlenmez.' },
'about.count': { en: 'All', tr: 'Tümü' },
'about.count_1': { en: 'One', tr: 'Bir' },
'about.count_2': { en: 'Two', tr: 'İki' },
'about.count_3': { en: 'Three', tr: 'Üç' },
'about.count_4': { en: 'Four', tr: 'Dört' },
'about.count_5': { en: 'Five', tr: 'Beş' },
'about.count_6': { en: 'Six', tr: 'Altı' },
'about.count_7': { en: 'Seven', tr: 'Yedi' },
'about.count_8': { en: 'Eight', tr: 'Sekiz' },
'about.count_9': { en: 'Nine', tr: 'Dokuz' },
'about.count_10': { en: 'Ten', tr: 'On' },
'about.count_other': { en: 'Many', tr: 'Çok sayıda' },
'about.tools_title': { en: 'The tools', tr: 'Araçlar' },
'about.tools_sub': { en: 'Open one from the dashboard. Each is a single-purpose page.', tr: 'Panelden birini açın. Her biri tek amaçlı bir sayfadır.' },
'about.why_title': { en: 'Why it works this way', tr: 'Neden böyle çalışıyor' },
'about.p_files': { en: 'Your files stay yours', tr: 'Dosyalarınız sizin kalır' },
'about.p_files_d': { en: 'Images are read locally and drawn onto a canvas. There is no server to send them to.', tr: 'Görseller yerel olarak okunur ve bir tuval üzerine çizilir. Onları gönderecek bir sunucu yoktur.' },
'about.p_install': { en: 'Nothing to install', tr: 'Kurulum yok' },
'about.p_install_d': { en: 'No account, no backend, no build step. Open the page and start working.', tr: 'Hesap yok, arka uç yok, derleme adımı yok. Sayfayı açın ve çalışmaya başlayın.' },
'about.p_theme': { en: 'Light and dark', tr: 'Açık ve koyu' },
'about.p_theme_d': { en: 'Follows your system setting and remembers your choice.', tr: 'Sistem ayarınızı izler ve seçiminizi hatırlar.' },
'about.no_tools': { en: 'No tools available', tr: 'Araç bulunamadı' },
'about.open_tool': { en: 'Open', tr: 'Aç' },

// ---- footer / misc ----
'footer.licence': { en: 'Toolz-AZ is free to use. Released under the MIT License.', tr: 'Toolz-AZ serbestçe kullanılabilir. MIT Lisansı ile yayımlanmıştır.' },
'footer.copyright': { en: '© 2026 Toolz-AZ. All rights reserved.', tr: '© 2026 Toolz-AZ. Tüm hakları saklıdır.' },
'noscript.strong': { en: 'JavaScript is required.', tr: 'JavaScript gereklidir.' },
'noscript.text': { en: 'Toolz-AZ processes images entirely in your browser, which needs JavaScript enabled.', tr: 'Toolz-AZ görselleri tamamen tarayıcınızda işler; bunun için JavaScript etkin olmalıdır.' },

// ---- shared errors ----
'error.file_type': { en: 'Unsupported file type. Please choose an image file.', tr: 'Desteklenmeyen dosya türü. Lütfen bir görsel dosyası seçin.' },
'error.corrupt': { en: 'Could not read this image. The file may be corrupt or unsupported.', tr: 'Bu görsel okunamadı. Dosya bozuk veya desteklenmiyor olabilir.' },

// ---- misc units ----
'ui.estimating': { en: 'Estimating...', tr: 'Hesaplanıyor...' },
'ui.no_change': { en: 'No change', tr: 'Değişiklik yok' },
'ui.reduced_by': { en: 'Reduced by', tr: 'Şun kadar azaldı:' },
'ui.grew_by': { en: 'Grew by', tr: 'Şun kadar arttı:' },
'ui.open': { en: 'Open', tr: 'Aç' }

};

// ---------------------------------------------------------------------------

let i18nLang = 'en';

function i18nSupported(code) {

return Object.prototype.hasOwnProperty.call(I18N_LANGS, code) ? code : null;

}

// Pick a language: explicit choice, then the browser's preferences, then English.
function i18nDetect() {

try {

const stored = localStorage.getItem('lang');

if (stored && I18N_LANGS[stored]) return stored;

} catch (e) {

// Storage can be unavailable (private mode); fall through to detection.

}

const candidates = (navigator.languages && navigator.languages.length)

? navigator.languages
: [navigator.language];

for (const tag of candidates) {

if (!tag) continue;

// 'tr-TR' -> 'tr'; also accept the bare primary subtag.
const base = String(tag).toLowerCase().split('-')[0];

if (I18N_LANGS[base]) return base;

}

return 'en';

}

// Subscribers run after every language change. Runtime-composed text (batch
// progress and summaries, for instance) carries no data-i18n attribute, so
// i18nApply() cannot rewrite it; these callbacks let the owner do it itself.
const i18nChangeHandlers = [];

function i18nOnChange(fn) {

if (typeof fn === 'function') i18nChangeHandlers.push(fn);

}

function i18nSetLanguage(code, persist) {

const next = i18nSupported(code) || 'en';

i18nLang = next;

document.documentElement.lang = next;

if (persist) {

try {

localStorage.setItem('lang', next);

} catch (e) {

// Not fatal: the language still applies for this page view.

}

}

i18nApply();

// Re-render anything built from the tool list, because tool titles and
// descriptions are translated.
try {

if (typeof localizeTools === 'function') localizeTools();

if (typeof renderTools === 'function') renderTools();

if (typeof refreshAboutTools === 'function') refreshAboutTools();

} catch (e) {

// A render failure must not leave the page half-translated.

}

i18nSyncSwitchers();

i18nChangeHandlers.forEach((fn) => {

try {

fn(next);

} catch (e) {

// One subscriber failing must not abort the rest.

}

});

return next;

}

// Translate a single key. Falls back to English, then to the key itself so a
// missing translation is visible rather than blank.
function t(key, fallback) {

const entry = I18N_STRINGS[key];

if (!entry) return fallback !== undefined ? fallback : key;

return entry[i18nLang] || entry.en || fallback || key;

}

// Interpolate {name} placeholders.
function tf(key, vars) {

let out = t(key);

if (vars) {

for (const name of Object.keys(vars)) {

out = out.split('{' + name + '}').join(String(vars[name]));

}

}

return out;

}

function i18nApply(root) {

const scope = root || document;

// textContent
scope.querySelectorAll('[data-i18n]').forEach((el) => {

const value = t(el.getAttribute('data-i18n'), el.textContent);

el.textContent = value;

});

// attributes: data-i18n-attr="placeholder:key,title:key"
scope.querySelectorAll('[data-i18n-attr]').forEach((el) => {

el.getAttribute('data-i18n-attr').split(',').forEach((pair) => {

const [attr, key] = pair.split(':').map((s) => s && s.trim());

if (attr && key) el.setAttribute(attr, t(key, el.getAttribute(attr)));

});

});

// innerHTML, for the few strings that carry markup we control.
scope.querySelectorAll('[data-i18n-html]').forEach((el) => {

el.innerHTML = t(el.getAttribute('data-i18n-html'), el.innerHTML);

});

}

// Keep the language button label and pressed state accurate.
function i18nSyncSwitchers() {

const info = I18N_LANGS[i18nLang] || I18N_LANGS.en;

document.querySelectorAll('[data-lang-switch]').forEach((btn) => {

// Show the language you would switch TO, which is what the action means.
const other = i18nLang === 'en' ? 'tr' : 'en';

const otherInfo = I18N_LANGS[other];

const code = btn.querySelector('.lang-code') || btn;

code.textContent = otherInfo.short;

btn.setAttribute('aria-label', t('nav.toggle_lang') + ' — ' + otherInfo.label);

btn.setAttribute('title', otherInfo.label);

btn.setAttribute('data-next-lang', other);

btn.setAttribute('lang', other);

});

// The theme button's label is generated text, not a data-i18n target.
const theme = document.documentElement.getAttribute('data-theme');

if (theme) {

const tgl = document.getElementById('themeToggle');

const tlabel = tgl && tgl.querySelector('.nav-control-label');

if (tlabel) tlabel.textContent = theme === 'dark' ? t('nav.theme_dark') : t('nav.theme_light');

}

document.querySelectorAll('[data-lang-current]').forEach((el) => {

el.textContent = info.short;

el.setAttribute('lang', i18nLang);

});

}

function i18nInit() {

const start = i18nDetect();

// Do not persist on first load: a detected language should not become a
// sticky user choice unless they actually pick one.
i18nSetLanguage(start, false);

}

function i18nSetupSwitchers() {

document.querySelectorAll('[data-lang-switch]').forEach((btn) => {

btn.addEventListener('click', () => {

const next = btn.getAttribute('data-next-lang');

if (next) i18nSetLanguage(next, true);

});

});

i18nSyncSwitchers();

}

if (typeof window !== 'undefined') {

window.i18nInit = i18nInit;
window.i18nSetupSwitchers = i18nSetupSwitchers;
window.i18nApply = i18nApply;
window.i18nSetLanguage = i18nSetLanguage;
window.i18nOnChange = i18nOnChange;
window.t = t;
window.tf = tf;
window.I18N_LANGS = I18N_LANGS;

}
