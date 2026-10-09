(function(jsGrid) {

    if (!jsGrid) {
        if (window.console) {
            console.error("[jsxgrid] ru.js was loaded before the jsxgrid engine (jsxgrid.js) - include the engine first.");
        }
        return;
    }


    jsGrid.locales.ru = {
        grid: {
            noDataContent: "Данных не найдено",
            deleteConfirm: "Вы действительно хотите удалить запись?",
            pagerFormat: "Показывать по {pageSize} строк &nbsp;&nbsp; Страницы: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} из {pageCount} &nbsp;&nbsp; Найдено записей: {itemCount}",
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",
            loadMessage: "Пожалуйста, подождите...",
            invalidMessage: "Введены неверные данные!"
        },

        loadIndicator: {
            message: "Загрузка..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "Поиск",
                insertModeButtonTooltip: "Добавить запись",
                editButtonTooltip: "Изменить",
                deleteButtonTooltip: "Удалить",
                searchButtonTooltip: "Найти",
                clearFilterButtonTooltip: "Очистить фильтр",
                insertButtonTooltip: "Добавить",
                updateButtonTooltip: "Сохранить",
                cancelEditButtonTooltip: "Отменить"
            },
            Xcontrol: {
                searchModeButtonTooltip: "Поиск",
                insertModeButtonTooltip: "Добавить запись",
                editButtonTooltip: "Изменить",
                deleteButtonTooltip: "Удалить",
                searchButtonTooltip: "Найти",
                clearFilterButtonTooltip: "Очистить фильтр",
                insertButtonTooltip: "Добавить",
                updateButtonTooltip: "Сохранить",
                cancelEditButtonTooltip: "Отменить",
                exportButtonTooltip: "Экспорт",
                exportPageText: "Текущая страница",
                exportAllText: "Все записи"
            },
            XimgField: {
                editButtonText: "Открыть менеджер файлов"
            },
            Xjsoneditor: {
                editText: "Редактор",
                closeText: "Сохранить"
            }
        },

        validators: {
            required: { message: "Поле обязательно для заполения" },
            rangeLength: { message: "Длинна введенного значения вне допустимого диапазона" },
            minLength: { message: "Введенное значение слишком короткое" },
            maxLength: { message: "Введенное значение слишком длинное" },
            pattern: { message: "Введенное значение не соответствует заданному шаблону" },
            range: { message: "Введенное значение вне допустимого диапазона" },
            min: { message: "Введенное значение слишком маленькое" },
            max: { message: "Введенное значение слишком большое" }
        }
    };

}(window.jsGrid, window.jQuery));

