(function(jsGrid) {

    if (!jsGrid) {
        if (window.console) {
            console.error("[jsxgrid] tr.js was loaded before the jsxgrid engine (jsxgrid.js) - include the engine first.");
        }
        return;
    }


    jsGrid.locales.tr = {
        grid: {
            noDataContent: "Kayıt Bulunamadı",
            deleteConfirm: "Emin misiniz ?",
            pagerFormat: "Sayfa başına satır: {pageSize} &nbsp;&nbsp; Sayfalar: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} / {pageCount} &nbsp;&nbsp; Bulunan kayıt: {itemCount}",
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",
            loadMessage: "Lütfen bekleyiniz...",
            invalidMessage: "Geçersiz veri girişi !"
        },

        loadIndicator: {
            message: "Yükleniyor..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "Arama moduna geç",
                insertModeButtonTooltip: "Yeni kayıt moduna geç",
                editButtonTooltip: "Değiştir",
                deleteButtonTooltip: "Sil",
                searchButtonTooltip: "Bul",
                clearFilterButtonTooltip: "Filtreyi temizle",
                insertButtonTooltip: "Ekle",
                updateButtonTooltip: "Güncelle",
                cancelEditButtonTooltip: "Güncelleme iptali"
            },
            Xcontrol: {
                searchModeButtonTooltip: "Arama moduna geç",
                insertModeButtonTooltip: "Yeni kayıt moduna geç",
                editButtonTooltip: "Değiştir",
                deleteButtonTooltip: "Sil",
                searchButtonTooltip: "Bul",
                clearFilterButtonTooltip: "Filtreyi temizle",
                insertButtonTooltip: "Ekle",
                updateButtonTooltip: "Güncelle",
                cancelEditButtonTooltip: "Güncelleme iptali",
                exportButtonTooltip: "Dışa aktar",
                exportPageText: "Geçerli sayfa",
                exportAllText: "Tüm kayıtlar"
            },
            XimgField: {
                editButtonText: "Dosya yöneticisini aç"
            },
            Xjsoneditor: {
                editText: "Düzenleyici",
                closeText: "Kaydet"
            }
        },

        validators: {
            required: { message: "Gerekli alandır" },
            rangeLength: { message: "Alan değerinin uzunluğu tanımlanan aralık dışındadır" },
            minLength: { message: "Alan değeri çok kısadır" },
            maxLength: { message: "Alan değeri çok uzundur" },
            pattern: { message: "Alan değeri tanımlanan şablon ile eşleşmiyor" },
            range: { message: "Alan değeri tanımlı aralığın dışındadır" },
            min: { message: "Alan değeri çok küçüktür" },
            max: { message: "Alan değeri çok büyüktür" }
        }
    };

}(window.jsGrid, window.jQuery));

