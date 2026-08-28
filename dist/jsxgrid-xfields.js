/*
 * jsxgrid v2.0.0 (https://github.com/rok9ru/jsxgrid#readme)
 * (c) 2026 Mikhail Kremza
 * Licensed under MIT
 */

(function(jsGrid, $, undefined) {
    if (!jsGrid) {
        console.log("jsGrid is not defined!");
        return;
    }
    jsGrid.popup = jsGrid.popupBasic = function (formContent, options) {
        this.idcounter = this.idcounter || 0;
        this.idcounter++;


        options = options || {};

        options.closeText = options.closeText || 'Close';
        options.heading = options.heading || '';

        options.styles = options.styles || '.jsGridpopupBasicOverlay {' +
            '  position: fixed;' +
            '  top: 0;' +
            '  bottom: 0;' +
            '  left: 0;' +
            '  right: 0;' +
            '  background: rgba(0, 0, 0, 0.7);' +
            '  transition: opacity 500ms;' +
            '  opacity: 1;' +
            '}' +
            '' +
            '.jsGridpopupBasicPopup {' +
            '  margin: 70px auto;' +
            '  padding: 20px;' +
            '  min-height: 60%;'+
            '  background: #fff;' +
            '  border-radius: 5px;' +
            '  width: 60%;' +
            '  position: relative;' +
            '  transition: all 300ms ease-in-out;' +
            '}' +
            '' +
            '.jsGridpopupBasicPopup h2 {' +
            '  margin-top: 0;' +
            '  color: #333;' +
            '  font-family: Tahoma, Arial, sans-serif;' +
            '}' +
            '.jsGridpopupBasicPopup .close {' +
            '  position: absolute;' +
            '  top: 10px;' +
            '  right: 30px;' +
            '  transition: all 200ms;' +
            '  font-size: 30px;' +
            '  font-weight: bold;' +
            '  text-decoration: none;' +
            '  color: #333;' +
            '}' +
            '.jsGridpopupBasicPopup .close:hover {' +
            '  color: #06D85F;' +
            '}' +
            '.jsGridpopupBasicPopup .jsGridpopupBasicContent {' +
            '  max-height: 30%;' +
            '  overflow: auto;' +
            '}' +
            '' +
            '@media screen and (max-width: 700px){' +
            '  .jsGridpopupBasicPopup{' +
            '    width: 70%;' +
            '  }' +
            '}';

        if(!$('#jsGridpopupBasicStyles').length){
            var $head = $("head");
            var $headlinklast = $head.find("link[rel='stylesheet']:last");
            var linkElement = "<style id='jsGridpopupBasicStyles'>" + options.styles + "</style>";
            if ($headlinklast.length) {
                $headlinklast.after(linkElement);
            } else {
                $head.append(linkElement);
            }

        }
        var id = "jsGridpopupBasic" + this.idcounter;
        var popup = $(
            '<div id="' + id + '" class="jsGridpopupBasicOverlay">' +
            '<div class="jsGridpopupBasicPopup">' +
            '<h2></h2>'+
            '<a class="close" href="#">&times;</a>' +
            '<div class="jsGridpopupBasicContent">' +
            '' +
            '</div>' +
            '</div>' +
            '</div>');

        popup.find('h2').text(options.heading);
        popup.find('.jsGridpopupBasicContent').append(formContent);
        popup.find('.close').click(function () {
            if (options.onClose instanceof Function) {
                options.onClose(popup);
            }
            popup.remove();
        });
        $('body').append(popup);
        return {
            'id': id,
            '$popup': popup,
            'hide':function () {
                popup.remove();
            }
        };
    }
}(jsGrid, jQuery));
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
(function(jsGrid, $, undefined) {

    // Standalone: does not extend jsGrid.CheckboxField, only jsGrid.Field.
    // Same tri-state (checked/unchecked/indeterminate) filter behavior as
    // CheckboxField, reimplemented here directly instead of inherited.

    var Field = jsGrid.Field;

    var Xcheckbox = function (config) {
        Field.call(this, config);
    };

    Xcheckbox.prototype = new Field({
        sorter: "number",
        align: "center",
        autosearch: true,
        defaultSelected: null,//value (0/1/true/false) to preset the filter checkbox with, applied once on first filter render then reset

        filterTemplate: function () {
            if (!this.filtering)
                return "";

            var grid = this._grid,
                $result = this.filterControl = this._createCheckbox();

            $result.prop({
                readOnly: true,
                indeterminate: true
            });

            $result.on("click", function () {
                var $cb = $(this);

                if ($cb.prop("readOnly")) {
                    $cb.prop({
                        checked: false,
                        readOnly: false
                    });
                } else if (!$cb.prop("checked")) {
                    $cb.prop({
                        readOnly: true,
                        indeterminate: true
                    });
                }
            });

            if (this.autosearch) {
                $result.on("click", function () {
                    grid.search();
                });
            }

            if (this.defaultSelected !== null) {
                $result.prop({
                    checked: !!this.defaultSelected,
                    indeterminate: false,
                    readOnly: false
                });
                this.defaultSelected = null;
            }

            return $result;
        },

        filterValue: function () {
            return this.filterControl.get(0).indeterminate
                ? undefined
                : (this.filterControl.is(":checked") ? 1 : 0);
        },

        insertTemplate: function () {
            if (!this.inserting)
                return "";

            return this.insertControl = this._createCheckbox();
        },

        insertValue: function () {
            return +(this.insertControl.is(":checked"));
        },

        editValue: function () {
            return +(this.editControl.is(":checked"));
        },
        itemTemplate: function (value) {
            return this._createCheckbox().prop({
                checked: +value,
                disabled: true
            });
        },
        editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);

            var $result = this.editControl = this._createCheckbox();
            $result.prop("checked", +value);
            return $result;
        },

        _createCheckbox: function () {
            return $("<input>").attr("type", "checkbox");
        }

    });

    jsGrid.fields.Xcheckbox = Xcheckbox;

}(jsGrid, jQuery));
(function(jsGrid, $, undefined) {

    // Standalone: does not extend jsGrid.TextField, only jsGrid.Field.

    var Field = jsGrid.Field;

    var XimgField = function (config) {
        Field.call(this, config);
    };

    XimgField.prototype = new Field({
        autosearch: true,
        readOnly: false,
        fm_callback: null,
        editButtonText: 'Open FM',
        defaultSelected: null,//value to preset the filter input with, applied once on first filter render then reset

        filterTemplate: function () {
            if (!this.filtering)
                return "";

            var grid = this._grid,
                $result = this.filterControl = this._createTextBox();

            if (this.autosearch) {
                $result.on("keypress", function (e) {
                    if (e.which === 13) {
                        grid.search();
                        e.preventDefault();
                    }
                });
            }

            if (this.defaultSelected !== null) {
                $result.val(this.defaultSelected);
                this.defaultSelected = null;
            }

            return $result;
        },

        filterValue: function () {
            return this.filterControl.val();
        },

        itemTemplate: function (value) {
            var img = $('<img class="jsgrid-img" src="">');
            img.attr("src", value || '');
            img.css('max-height', '50px');
            img.css('max-width', '50px');

            return img;
        }
        , editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);
            var fm = this.fm_callback;

            var editControl = this.editControl = $('<input type="text">').val(value || '');
            if (fm) {
                return $('<button class="jsgrid-imgField-button">' + this.editButtonText + '</button>').click(function () {
                    fm(editControl);
                });
            }
            return editControl;

        },
        insertTemplate: function () {
            if (!this.inserting)
                return "";
            var fm = this.fm_callback;

            var insertControl = this.insertControl = $('<input type="text">');
            if (typeof fm == 'function') {
                return $('<button class="jsgrid-imgField-button">'+this.editButtonText+'</button>').click(function () {
                    fm(insertControl);
                });
            }
            return insertControl;
        },

        insertValue: function () {
            return this.insertControl.val();
        },

        editValue: function () {
            return this.editControl.val();
        },

        _createTextBox: function () {
            return $("<input>").attr("type", "text")
                .prop("readonly", !!this.readOnly);
        }

    });

    jsGrid.fields.XimgField = XimgField;

}(jsGrid, jQuery));
(function(jsGrid, $, undefined) {

    // Standalone: does not extend jsGrid.SelectField, only jsGrid.Field.

    var Field = jsGrid.Field;
    var NUMBER_VALUE_TYPE = "number";

    var Xselect = function (config) {
        this.items = [];
        this.selectedIndex = -1;
        this.valueField = "";
        this.textField = "";

        if (config.valueField && config.items && config.items.length) {
            var firstItemValue = config.items[0][config.valueField];
            this.valueType = (typeof firstItemValue) === NUMBER_VALUE_TYPE ? NUMBER_VALUE_TYPE : "string";
        }

        this.sorter = this.valueType;

        Field.call(this, config);
    };

    Xselect.prototype = new Field({
        align: "center",
        autosearch: true,
        valueType: NUMBER_VALUE_TYPE,
        pseudoElement: null,//pseudoElement that will be unsifted to start of select data in filters
        select2: null,
        defaultSelected: null,

        itemTemplate: function (value) {
            var items = this.items,
                valueField = this.valueField,
                textField = this.textField,
                resultItem;

            if (valueField) {
                if (typeof(value) === "object") {
                    resultItem = value;
                } else {
                    resultItem = $.grep(items, function (item) {
                        return item[valueField] === value;
                    })[0] || {};
                }
            } else {
                resultItem = items[value];
            }

            var result = (textField ? resultItem[textField] : resultItem);

            return (result === undefined || result === null) ? "" : result;
        },

        insertTemplate: function () {
            if (!this.inserting)
                return "";

            return this.insertControl = this._createSelect();
        },

        editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);

            var $result = this.editControl = this._createSelect();
            var editValue = value;
            if (typeof(value) === "object") {
                editValue = value[this.valueField];
            }
            (editValue !== undefined) && $result.val(editValue);
            return $result;
        },

        insertValue: function () {
            var val = this.insertControl.val();
            return this.valueType === NUMBER_VALUE_TYPE ? parseInt(val || 0, 10) : val;
        },

        editValue: function () {
            var val = this.editControl.val();
            return this.valueType === NUMBER_VALUE_TYPE ? parseInt(val || 0, 10) : val;
        },

        filterTemplate: function () {
            if (!this.filtering)
                return "";
            var data;
            if (Array.isArray(this.items)) {
                data = this.items.slice(0);
                if (this.pseudoElement) {
                    data.unshift(this.pseudoElement);
                } else {
                    var d = {};
                    d[this.textField] = '';
                    d[this.valueField] = null;
                    data.unshift(d);
                }
            } else if (typeof this.items === 'object') {
                data = Object.assign({}, this.items);
                if ((typeof this.pseudoElement === 'object') && this.pseudoElement) {
                    data = Object.assign({}, data, this.pseudoElement);
                } else {
                    data = Object.assign({}, {'': null}, data);
                }
            }
            if (this.defaultSelected !== null) {
                var valueField = this.valueField;
                var targetValue = this.defaultSelected;
                var foundIndex = -1;

                $.each(data, function (index, item) {
                    var value = valueField ? item[valueField] : index;
                    if (value == targetValue) {
                        foundIndex = index;
                        return false;
                    }
                });
                if (foundIndex !== -1) {
                    this.selectedIndex = foundIndex;
                }
                this.defaultSelected = null;
            }

            var grid = this._grid,
                $result = this.filterControl = this._createSelect(data);

            if (this.autosearch) {
                $result.on("change", function (e) {
                    grid.search();
                });
            }

            return $result;
        },

        filterValue: function () {
            var val = this.filterControl.val();
            return this.valueType === NUMBER_VALUE_TYPE ? parseInt(val || 0, 10) : val;
        },

        _createSelect: function (data) {
            var $result = $("<select>"),
                valueField = this.valueField,
                textField = this.textField,
                selectedIndex = this.selectedIndex;

            $.each((data || this.items), function (index, item) {
                var value = valueField ? item[valueField] : index,
                    text = textField ? item[textField] : item;

                var $option = $("<option>")
                    .attr("value", value)
                    .text(text)
                    .appendTo($result);

                $option.prop("selected", (selectedIndex === index));
            });

            $result.prop("disabled", !!this.readOnly);

            if(this.select2){
                var s2 = Object.assign({}, this.select2, {width: '100%'});
                setTimeout(function() {
                    $result.select2(s2);
                }, 0);
            }

            return $result;
        }

    });

    jsGrid.fields.Xselect = Xselect;

}(jsGrid, jQuery));
(function(jsGrid, $, undefined) {

    // Standalone: does not extend jsGrid.TextAreaField, only jsGrid.Field.

    var Field = jsGrid.Field;

    var Xtextarea = function (config) {
        Field.call(this, config);
    };

    Xtextarea.prototype = new Field({
        autosearch: true,
        readOnly: false,
        maxShowSymbols: 50,
        defaultSelected: null,//value to preset the filter input with, applied once on first filter render then reset

        filterTemplate: function () {
            if (!this.filtering)
                return "";

            var grid = this._grid,
                $result = this.filterControl = this._createTextBox();

            if (this.autosearch) {
                $result.on("keypress", function (e) {
                    if (e.which === 13) {
                        grid.search();
                        e.preventDefault();
                    }
                });
            }

            if (this.defaultSelected !== null) {
                $result.val(this.defaultSelected);
                this.defaultSelected = null;
            }

            return $result;
        },

        filterValue: function () {
            return this.filterControl.val();
        },

        insertTemplate: function () {
            if (!this.inserting)
                return "";

            return this.insertControl = this._createTextArea();
        },

        editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);

            var $result = this.editControl = this._createTextArea();
            $result.val(value);
            return $result;
        },

        insertValue: function () {
            return this.insertControl.val();
        },

        editValue: function () {
            return this.editControl.val();
        },

        _createTextBox: function () {
            return $("<input>").attr("type", "text")
                .prop("readonly", !!this.readOnly);
        },

        _createTextArea: function () {
            return $("<textarea>").prop("readonly", !!this.readOnly);
        },

        itemTemplate: function (value, item) {
            value = value == null ? '' : String(value);

            if (value.length <= this.maxShowSymbols) {
                return $("<div>").text(value);
            }
            var str = value.slice(0, this.maxShowSymbols);
            var div = $("<div>").text(str + ' ...').one("click",function () {
                div.text(value);
                return false;
            });

            return div;
        }

    });

    jsGrid.fields.Xtextarea = Xtextarea;

}(jsGrid, jQuery));
(function(jsGrid, $, undefined) {

    // Standalone: does not extend jsGrid.TextAreaField, only jsGrid.Field.

    var Field = jsGrid.Field;

    var Xjsoneditor = function (config) {
        Field.call(this, config);
    };

    Xjsoneditor.prototype = new Field({
        autosearch: true,
        readOnly: false,
        templates: [],
        closeText: 'Save',
        editText: "Editor",
        defaultSelected: null,//value to preset the filter input with, applied once on first filter render then reset

        filterTemplate: function () {
            if (!this.filtering)
                return "";

            var grid = this._grid,
                $result = this.filterControl = this._createTextBox();

            if (this.autosearch) {
                $result.on("keypress", function (e) {
                    if (e.which === 13) {
                        grid.search();
                        e.preventDefault();
                    }
                });
            }

            if (this.defaultSelected !== null) {
                $result.val(this.defaultSelected);
                this.defaultSelected = null;
            }

            return $result;
        },

        filterValue: function () {
            return this.filterControl.val();
        },

        insertValue: function () {
            return this.insertControl.val();
        },

        editValue: function () {
            return this.editControl.val();
        },

        _createTextBox: function () {
            return $("<input>").attr("type", "text")
                .prop("readonly", !!this.readOnly);
        },

        _doModal: function (formContent, options, resultControl) {
            return jsGrid.popup(formContent, options);
        },

        _createJsonEditor: function (json, mode) {
            if (typeof JSONEditor === 'undefined') {
                throw new Error("Xjsoneditor requires the 'jsoneditor' package to be loaded on the page.");
            }

            json = json || {};
            if (typeof json !== 'object') {
                json = JSON.parse(json);
            }

            var container = $('<div style="height: 500px;">');
            $('body').append(container);
            container = container[0];
            var options = {
                templates: this.templates,
                modes: ['code', 'text', 'tree'], // allowed modes
                onError: function (err) {
                    alert(err.toString());
                },
                mode: mode || 'view'
            };

            return new JSONEditor(container, options, json);
        },

        itemTemplate: function (value, item) {
            var f = this;

            return $("<button>" + f.editText + "</button>").click(function () {
                var editor = f._createJsonEditor(value);
                f._doModal(editor.container, {
                    onClose: function () {
                        $(editor.container).remove();
                        editor.destroy();
                    }
                });
                return false;
            });
        },
        insertTemplate: function () {
            if (!this.inserting)
                return "";

            var f = this;

            return this.insertControl = $("<textarea>").click(function () {
                var editor = f._createJsonEditor({}, 'tree');
                var ta = $(this);

                f._doModal(editor.container, {
                    closeText: f.closeText,
                    onClose: function () {

                        var json = editor.get();
                        if (!$.isEmptyObject(json)) {
                            ta.val(JSON.stringify(json));
                        } else {
                            ta.val({});
                        }
                        editor.destroy();

                    }
                });
                return false;
            });

        },
        editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);


            var f = this;

            return this.editControl = $("<textarea>").val(value).click(function () {
                var ta = $(this);
                var editor = f._createJsonEditor(ta.val(), 'tree');


                f._doModal(editor.container, {
                    closeText: f.closeText,
                    onClose: function () {

                        var json = editor.get();
                        if (!$.isEmptyObject(json)) {
                            ta.val(JSON.stringify(json));
                        } else {
                            ta.val({});
                        }
                        editor.destroy();

                    }
                });
                return false;
            });
        }

    });

    jsGrid.fields.Xjsoneditor = Xjsoneditor;

}(jsGrid, jQuery));
(function(jsGrid, $, undefined) {

    var XRowSelectField = function (config) {
        this.selectedItems = [];
        // Must be generated per instance: the prototype literal is shared by
        // every XRowSelectField, so a uid set there would be identical for
        // all of them, letting unselectAll() clobber checkboxes from other
        // grids/fields sharing the page.
        this.uid = Date.now().toString(36) + Math.random().toString(36).substring(2);
        jsGrid.Field.call(this, config);
    };

    XRowSelectField.prototype = new jsGrid.Field({
        filtering: false,
        deleteItemByItem: false,
        buttonText: "",
        selectedItemsAction: function (selectedItems) {

        },
        unselectAll: function () {
            this.selectedItems = [];
            this._grid._container.find('[data-uid=\'' + this.uid + '\'] ').prop('checked', false);
        },
        headerTemplate: function () {
            if (!this.buttonText) {
                return '';
            }
            var that = this;
            return $("<button>").attr("type", "button").text(that.buttonText)
                .on("click", function (event) {
                    that.selectedItemsAction(that.selectedItems);
                    event.stopPropagation();
                });
        },
        itemTemplate: function (_, item) {
            var that = this;
            return $("<input data-uid='" + that.uid + "' type='checkbox'>")
                .prop("checked", $.inArray(item, that.selectedItems) > -1)
                .on("change", function () {
                    $(this).is(":checked") ? that.selectItem(item) : that.unselectItem(item);
                }).click(function (event) {
                    event.stopPropagation();
                });
        },
        editTemplate: function () {
            return '';
        },
        align: "center",

        selectItem: function (item) {
            this.selectedItems.push(item);
        },
        unselectItem: function (item) {
            this.selectedItems = $.grep(this.selectedItems, function (i) {
                return i !== item;
            });
        }
    });

    jsGrid.fields.XRowSelectField = XRowSelectField;

}(jsGrid, jQuery));
(function(jsGrid, $, undefined) {
    var XDateTimeField = function (config) {
        jsGrid.Field.call(this, config);
    };
    XDateTimeField.prototype = new jsGrid.Field({

        css: "date-field",            // redefine general property 'css'
        align: "center",              // redefine general property 'align'
        datePickerType: "datetime-local",
        dateRange: false,
        defaultSelected: null,//value (or {from, to} when dateRange is true) to preset the filter with, applied once on first filter render then reset
        sorter: function (date1, date2) {
            return new Date(date1) - new Date(date2);
        },

        filterTemplate: function () {
            if (!this.filtering)
                return "";


            var grid = this._grid;
            var $result = $();
            if(this.dateRange){
                var $container = $("<div class='jsgrid-date-range-wrapper'>");

                var $startInput = $("<input>", {
                    "class": "jsgrid-date-picker jsgrid-date-start",
                    "type": this.datePickerType,
                    "title": "Period date start"
                });

                var $endInput = $("<input>", {
                    "class": "jsgrid-date-picker jsgrid-date-end",
                    "type": this.datePickerType,
                    "title": "Period date end"
                });

                $container.val = function () {
                    var fromVal = $startInput.val();
                    var toVal = $endInput.val();

                    return {
                        from: fromVal,
                        to: toVal
                    };
                };

                $result = this.filterControl = $container.append($startInput).append($endInput);

                if (this.defaultSelected !== null) {
                    var range = this.defaultSelected || {};
                    $startInput.val(range.from || '');
                    $endInput.val(range.to || '');
                    this.defaultSelected = null;
                }

                if (this.autosearch) {
                    $result.on("change", ".jsgrid-date-picker", function (e) {
                        grid.search();
                    });
                }
            }else{
                $result = this.filterControl = this._createPicker();

                if (this.defaultSelected !== null) {
                    $result.val(this.defaultSelected);
                    this.defaultSelected = null;
                }

                if (this.autosearch) {
                    $result.on("change", function (e) {
                        grid.search();
                    });
                }
            }

            return $result;
        },

        filterValue: function () {
            return this.filterControl.val();
        },

        itemTemplate: function (value) {
            if (!value) {
                return '';
            }
            var options = this.options || {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            return new Date(value.replace(' ', 'T')).toLocaleDateString(undefined, options);
        },

        insertTemplate: function () {
            return this._insertPicker = this._createPicker();
        },

        editTemplate: function (value) {
            return this._editPicker = this._createPicker().val(value);
        },

        insertValue: function () {
            return this._insertPicker.val();
        },

        editValue: function () {
            return this._editPicker.val();
        },
        _createPicker: function () {
            return $("<input class='date-picker'>").attr("type", this.datePickerType);
        }
    });


    jsGrid.fields.XDateTimeField = XDateTimeField;
}(jsGrid, jQuery));