(function(jsGrid) {

    if (!jsGrid) {
        if (window.console) {
            console.error("[jsxgrid] he.js was loaded before the jsxgrid engine (jsxgrid.js) - include the engine first.");
        }
        return;
    }


    jsGrid.locales.he = {
        grid: {
            noDataContent: "לא נמצא",
            deleteConfirm: "האם אתה בטוח?",
            pagerFormat: "עמודים: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} מתוך {pageCount}",
            pagePrevText: "הקודם",
            pageNextText: "הבא",
            pageFirstText: "ראשון",
            pageLastText: "אחרון",
            loadMessage: "אנא המתן ...",
            invalidMessage: "נתונים לא חוקיים!"
        },

        loadIndicator: {
            message: "טוען..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "ביצוע חיפוש",
                insertModeButtonTooltip: "ביצוע עריכת שורה",
                editButtonTooltip: "עריכה",
                deleteButtonTooltip: "מחיקה",
                searchButtonTooltip: "חיפוש",
                clearFilterButtonTooltip: "ניקוי מסנן",
                insertButtonTooltip: "הכנסה",
                updateButtonTooltip: "עדכון",
                cancelEditButtonTooltip: "ביטול עריכה"
            },
            Xcontrol: {
                searchModeButtonTooltip: "ביצוע חיפוש",
                insertModeButtonTooltip: "ביצוע עריכת שורה",
                editButtonTooltip: "עריכה",
                deleteButtonTooltip: "מחיקה",
                searchButtonTooltip: "חיפוש",
                clearFilterButtonTooltip: "ניקוי מסנן",
                insertButtonTooltip: "הכנסה",
                updateButtonTooltip: "עדכון",
                cancelEditButtonTooltip: "ביטול עריכה"
            },
            XimgField: {
                editButtonText: "פתח מנהל קבצים"
            },
            Xjsoneditor: {
                editText: "עורך",
                closeText: "שמור"
            }
        },

        validators: {
            required: { message: "שדה נדרש" },
            rangeLength: { message: "אורכו של הערך הוא מחוץ לטווח המוגדר" },
            minLength: { message: "אורכו של הערך קצר מדי" },
            maxLength: { message: "אורכו של הערך ארוך מדי" },
            pattern: { message: "אורכו של הערך ארוך מדי" },
            range: { message: "ערך מחוץ לטווח" },
            min: { message: "ערך נמוך מדי" },
            max: { message: "גבוה מדי" }
        }
    };

}(window.jsGrid, window.jQuery));
