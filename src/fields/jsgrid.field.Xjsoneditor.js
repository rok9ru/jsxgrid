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