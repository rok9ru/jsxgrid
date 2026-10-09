(function(jsGrid) {

    if (!jsGrid) {
        if (window.console) {
            console.error("[jsxgrid] ka.js was loaded before the jsxgrid engine (jsxgrid.js) - include the engine first.");
        }
        return;
    }


    jsGrid.locales.ka = {
        grid: {
            noDataContent: "მონაცემები ცარიელია.",
            deleteConfirm: "ნამდვილად გსურთ ჩანაწერის წაშლა?",
            pagerFormat: "სტრიქონი გვერდზე: {pageSize} &nbsp;&nbsp; გვერდები: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} - {pageCount} დან. &nbsp;&nbsp; ნაპოვნია ჩანაწერი: {itemCount}",
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",
            loadMessage: "გთხოვთ დაიცადოთ...",
            invalidMessage: "შეყვანილია არასწორი მონაცემები!"
        },

        loadIndicator: {
            message: "მიმდინარეობს ჩატვირთვა..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "ძებნა",
                insertModeButtonTooltip: "ჩანაწერის დამატება",
                editButtonTooltip: "შესწორება",
                deleteButtonTooltip: "წაშლა",
                searchButtonTooltip: "ძებნა",
                clearFilterButtonTooltip: "ფილტრის გასუფთავება",
                insertButtonTooltip: "დამატება",
                updateButtonTooltip: "შენახვა",
                cancelEditButtonTooltip: "გაუქმება"
            },
            Xcontrol: {
                searchModeButtonTooltip: "ძებნა",
                insertModeButtonTooltip: "ჩანაწერის დამატება",
                editButtonTooltip: "შესწორება",
                deleteButtonTooltip: "წაშლა",
                searchButtonTooltip: "ძებნა",
                clearFilterButtonTooltip: "ფილტრის გასუფთავება",
                insertButtonTooltip: "დამატება",
                updateButtonTooltip: "შენახვა",
                cancelEditButtonTooltip: "გაუქმება",
                exportButtonTooltip: "ექსპორტი",
                exportPageText: "მიმდინარე გვერდი",
                exportAllText: "ყველა ჩანაწერი"
            },
            XimgField: {
                editButtonText: "ფაილების მენეჯერის გახსნა"
            },
            Xjsoneditor: {
                editText: "რედაქტორი",
                closeText: "შენახვა"
            }
        },

        validators: {
            required: { message: "ველი აუცილებელია შესავსებად." },
            rangeLength: { message: "შეყვანილი ჩანაწერის ზომა არ ექვემდებარება დიაპაზონს." },
            minLength: { message: "შეყვანილი ჩანაწერის ზომა საკმაოდ პატარა არის." },
            maxLength: { message: "შეყვანილი ჩანაწერის ზომა საკმაოდ დიდი არის." },
            pattern: { message: "შეყვანილი მნიშვნელობა არ ემთხვევა მითითებულ შაბლონს." },
            range: { message: "შეყვანილი ინფორმაცია არ ჯდება დიაპაზონში." },
            min: { message: "შეყვანილი ინფორმაციის ზომა საკმაოდ პატარა არის." },
            max: { message: "შეყვანილი ინფორმაციის ზომა საკმაოდ დიდი არის." }
        }
    };

}(window.jsGrid, window.jQuery));
