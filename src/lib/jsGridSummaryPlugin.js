(function($, undefined) {
    var baseJsGrid = $.fn.jsGrid;
    if (!baseJsGrid) return;

    $.fn.jsGrid = function (options) {
        if (typeof options === "object") {
            var originalOnRefreshed = options.onRefreshed;

            options.onRefreshed = function (args) {
                if (originalOnRefreshed) originalOnRefreshed.apply(this, arguments);

                var grid = args.grid;
                var data = grid.option("data") || [];
                var fields = grid.option("fields") || [];

                var $table = grid._container.find(".jsgrid-table").last();
                $table.find(".jsgrid-summary-footer").remove();

                var $tfoot = $("<tfoot class='jsgrid-summary-footer'>").appendTo($table);
                var $tr = $("<tr>").addClass("jsgrid-row").css({
                    "background": "#e1e1e1",
                    "font-weight": "bold"
                }).appendTo($tfoot);

                fields.forEach(function (field) {
                    var $td = $("<td>").addClass("jsgrid-cell").appendTo($tr);
                    if (typeof field.summary === "function") {
                        var result = field.summary.call(field, data);
                        $td.html(result);
                    }
                });
            };
        }

        return baseJsGrid.apply(this, arguments);
    };
}(jQuery));