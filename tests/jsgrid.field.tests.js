$(function() {

    var Grid = jsGrid.Grid;

    QUnit.module("common field config", {
        beforeEach: function() {
            this.isFieldExcluded = function(FieldClass) {
                return FieldClass === jsGrid.ControlField;
            };
        }
    });

    QUnit.test("filtering=false prevents rendering filter template", function(assert) {
        var isFieldExcluded = this.isFieldExcluded;

        $.each(jsGrid.fields, function(name, FieldClass) {
            if(isFieldExcluded(FieldClass))
                return;

            var field = new FieldClass({ filtering: false });

            assert.equal(field.filterTemplate(), "", "empty filter template for field " + name);
        });
    });

    QUnit.test("inserting=false prevents rendering insert template", function(assert) {
        var isFieldExcluded = this.isFieldExcluded;

        $.each(jsGrid.fields, function(name, FieldClass) {
            if(isFieldExcluded(FieldClass))
                return;

            var field = new FieldClass({ inserting: false });

            assert.equal(field.insertTemplate(), "", "empty insert template for field " + name);
        });
    });

    QUnit.test("editing=false renders itemTemplate", function(assert) {
        var isFieldExcluded = this.isFieldExcluded;

        $.each(jsGrid.fields, function(name, FieldClass) {
            if(isFieldExcluded(FieldClass))
                return;

            var item = {
                field: "test"
            };
            var args;

            var field = new FieldClass({
                editing: false,
                itemTemplate: function() {
                    args = arguments;
                    FieldClass.prototype.itemTemplate.apply(this, arguments);
                }
            });

            var itemTemplate = field.itemTemplate("test", item);
            var editTemplate = field.editTemplate("test", item);

            var editTemplateContent = editTemplate instanceof jQuery ? editTemplate[0].outerHTML : editTemplate;
            var itemTemplateContent = itemTemplate instanceof jQuery ? itemTemplate[0].outerHTML : itemTemplate;

            assert.equal(editTemplateContent, itemTemplateContent, "item template is rendered instead of edit template for " + name);
            assert.equal(args.length, 2, "passed both arguments for " + name);
            assert.equal(args[0], "test", "field value passed as a first argument for " + name);
            assert.equal(args[1], item, "item passed as a second argument for " + name);
        });
    });

    QUnit.module("jsGrid.field");

    QUnit.test("basic", function(assert) {
        var customSortingFunc = function() {
                return 1;
            },
            field = new jsGrid.Field({
                name: "testField",
                title: "testTitle",
                sorter: customSortingFunc
            });

        assert.equal(field.headerTemplate(), "testTitle");
        assert.equal(field.itemTemplate("testValue"), "testValue");
        assert.equal(field.filterTemplate(), "");
        assert.equal(field.insertTemplate(), "");
        assert.equal(field.editTemplate("testValue"), "testValue");
        assert.strictEqual(field.filterValue(), "");
        assert.strictEqual(field.insertValue(), "");
        assert.strictEqual(field.editValue(), "testValue");
        assert.strictEqual(field.sortingFunc, customSortingFunc);
    });


    QUnit.module("jsGrid.field.text");

    QUnit.test("basic", function(assert) {
        var field = new jsGrid.TextField({ name: "testField" });

        assert.equal(field.itemTemplate("testValue"), "testValue");
        assert.equal(field.filterTemplate()[0].tagName.toLowerCase(), "input");
        assert.equal(field.insertTemplate()[0].tagName.toLowerCase(), "input");
        assert.equal(field.editTemplate("testEditValue")[0].tagName.toLowerCase(), "input");
        assert.strictEqual(field.filterValue(), "");
        assert.strictEqual(field.insertValue(), "");
        assert.strictEqual(field.editValue(), "testEditValue");
    });

    QUnit.test("set default field options with setDefaults", function(assert) {
        jsGrid.setDefaults("text", {
            defaultOption: "test"
        });

        var $element = $("#jsGrid").jsGrid({
            fields: [{ type: "text" }]
        });

        assert.equal($element.jsGrid("option", "fields")[0].defaultOption, "test", "default field option set");
    });


    QUnit.module("jsGrid.field.number");

    QUnit.test("basic", function(assert) {
        var field = new jsGrid.NumberField({ name: "testField" });

        assert.equal(field.itemTemplate(5), "5");
        assert.equal(field.filterTemplate()[0].tagName.toLowerCase(), "input");
        assert.equal(field.insertTemplate()[0].tagName.toLowerCase(), "input");
        assert.equal(field.editTemplate(6)[0].tagName.toLowerCase(), "input");
        assert.strictEqual(field.filterValue(), undefined);
        assert.strictEqual(field.insertValue(), undefined);
        assert.strictEqual(field.editValue(), 6);
    });


    QUnit.module("jsGrid.field.textArea");

    QUnit.test("basic", function(assert) {
        var field = new jsGrid.TextAreaField({ name: "testField" });

        assert.equal(field.itemTemplate("testValue"), "testValue");
        assert.equal(field.filterTemplate()[0].tagName.toLowerCase(), "input");
        assert.equal(field.insertTemplate()[0].tagName.toLowerCase(), "textarea");
        assert.equal(field.editTemplate("testEditValue")[0].tagName.toLowerCase(), "textarea");
        assert.strictEqual(field.insertValue(), "");
        assert.strictEqual(field.editValue(), "testEditValue");
    });


    QUnit.module("jsGrid.field.checkbox");

    QUnit.test("basic", function(assert) {
        var field = new jsGrid.CheckboxField({ name: "testField" }),
            itemTemplate,
            filterTemplate,
            insertTemplate,
            editTemplate;

        itemTemplate = field.itemTemplate("testValue");
        assert.equal(itemTemplate[0].tagName.toLowerCase(), "input");
        assert.equal(itemTemplate.attr("type"), "checkbox");
        assert.equal(itemTemplate.attr("disabled"), "disabled");

        filterTemplate = field.filterTemplate();
        assert.equal(filterTemplate[0].tagName.toLowerCase(), "input");
        assert.equal(filterTemplate.attr("type"), "checkbox");
        assert.equal(filterTemplate.prop("indeterminate"), true);

        insertTemplate = field.insertTemplate();
        assert.equal(insertTemplate[0].tagName.toLowerCase(), "input");
        assert.equal(insertTemplate.attr("type"), "checkbox");

        editTemplate = field.editTemplate(true);
        assert.equal(editTemplate[0].tagName.toLowerCase(), "input");
        assert.equal(editTemplate.attr("type"), "checkbox");
        assert.equal(editTemplate.is(":checked"), true);

        assert.strictEqual(field.filterValue(), undefined);
        assert.strictEqual(field.insertValue(), false);
        assert.strictEqual(field.editValue(), true);
    });


    QUnit.module("jsGrid.field.select");

    QUnit.test("basic", function(assert) {
        var field,
            filterTemplate,
            insertTemplate,
            editTemplate;

        field = new jsGrid.SelectField({
            name: "testField",
            items: ["test1", "test2", "test3"],
            selectedIndex: 1
        });

        assert.equal(field.itemTemplate(1), "test2");

        filterTemplate = field.filterTemplate();
        assert.equal(filterTemplate[0].tagName.toLowerCase(), "select");
        assert.equal(filterTemplate.children().length, 3);

        insertTemplate = field.insertTemplate();
        assert.equal(insertTemplate[0].tagName.toLowerCase(), "select");
        assert.equal(insertTemplate.children().length, 3);

        editTemplate = field.editTemplate(2);
        assert.equal(editTemplate[0].tagName.toLowerCase(), "select");
        assert.equal(editTemplate.find("option:selected").length, 1);
        assert.ok(editTemplate.children().eq(2).is(":selected"));

        assert.strictEqual(field.filterValue(), 1);
        assert.strictEqual(field.insertValue(), 1);
        assert.strictEqual(field.editValue(), 2);
    });

    QUnit.test("items as array of integers", function(assert) {
        var field,
            filterTemplate,
            insertTemplate,
            editTemplate;

        field = new jsGrid.SelectField({
            name: "testField",
            items: [0, 10, 20],
            selectedIndex: 0
        });

        assert.strictEqual(field.itemTemplate(0), 0);

        filterTemplate = field.filterTemplate();
        assert.equal(filterTemplate[0].tagName.toLowerCase(), "select");
        assert.equal(filterTemplate.children().length, 3);

        insertTemplate = field.insertTemplate();
        assert.equal(insertTemplate[0].tagName.toLowerCase(), "select");
        assert.equal(insertTemplate.children().length, 3);

        editTemplate = field.editTemplate(1);
        assert.equal(editTemplate[0].tagName.toLowerCase(), "select");
        assert.equal(editTemplate.find("option:selected").length, 1);
        assert.ok(editTemplate.children().eq(1).is(":selected"));

        assert.strictEqual(field.filterValue(), 0);
        assert.strictEqual(field.insertValue(), 0);
        assert.strictEqual(field.editValue(), 1);
    });

    QUnit.test("string value type", function(assert) {
        var field = new jsGrid.SelectField({
            name: "testField",
            items: [
                { text: "test1", value: "1" },
                { text: "test2", value: "2" },
                { text: "test3", value: "3" }
            ],
            textField: "text",
            valueField: "value",
            valueType: "string",
            selectedIndex: 1
        });

        field.filterTemplate();
        assert.strictEqual(field.filterValue(), "2");

        field.editTemplate("2");
        assert.strictEqual(field.editValue(), "2");

        field.insertTemplate();
        assert.strictEqual(field.insertValue(), "2");
    });

    QUnit.test("value type auto-defined", function(assert) {
        var field = new jsGrid.SelectField({
            name: "testField",
            items: [
                { text: "test1", value: "1" },
                { text: "test2", value: "2" },
                { text: "test3", value: "3" }
            ],
            textField: "text",
            valueField: "value",
            selectedIndex: 1
        });

        assert.strictEqual(field.sorter, "string", "sorter set according to value type");

        field.filterTemplate();
        assert.strictEqual(field.filterValue(), "2");

        field.editTemplate("2");
        assert.strictEqual(field.editValue(), "2");

        field.insertTemplate();
        assert.strictEqual(field.insertValue(), "2");
    });

    QUnit.test("value type defaulted to string", function(assert) {
        var field = new jsGrid.SelectField({
            name: "testField",
            items: [
                { text: "test1" },
                { text: "test2", value: "2" }
            ],
            textField: "text",
            valueField: "value"
        });

        assert.strictEqual(field.sorter, "string", "sorter set to string if first item has no value field");
    });

    QUnit.test("object items", function(assert) {
        var field = new jsGrid.SelectField({
            name: "testField",
            items: [
                { text: "test1", value: 1 },
                { text: "test2", value: 2 },
                { text: "test3", value: 3 }
            ]
        });

        assert.strictEqual(field.itemTemplate(1), field.items[1]);

        field.textField = "text";
        assert.strictEqual(field.itemTemplate(1), "test2");

        field.textField = "";
        field.valueField = "value";
        assert.strictEqual(field.itemTemplate(1), field.items[0]);
        assert.ok(field.editTemplate(2));
        assert.strictEqual(field.editValue(), 2);

        field.textField = "text";
        assert.strictEqual(field.itemTemplate(1), "test1");
    });

    QUnit.test("object as input", function(assert) {
        var field = new jsGrid.SelectField({
            name: "testField",
            items: [
                { text: "test1", value: 1 },
                { text: "test2", value: 2 },
                { text: "test3", value: 3 }
            ],
            valueField: "value",
            textField: "text"
        });

        

        assert.strictEqual(field.itemTemplate({ text: "test1", value: 1 }), "test1");
        assert.strictEqual(field.itemTemplate({ text: "test2", value: 2 }), "test2");
        assert.strictEqual(field.itemTemplate({ text: "test3", value: 3 }), "test3");



        field.editTemplate({ text: "test1", value: 1 });
        assert.strictEqual(field.editValue(), 1);
        
        field.editTemplate({ text: "test2", value: 2 });
        assert.strictEqual(field.editValue(), 2);
        
        field.editTemplate({ text: "test3", value: 3 });
        assert.strictEqual(field.editValue(), 3);




    });


    QUnit.module("jsGrid.field.control");

    QUnit.test("basic", function(assert) {
        var field,
            itemTemplate,
            headerTemplate,
            filterTemplate,
            insertTemplate,
            editTemplate;

        field = new jsGrid.ControlField();
        field._grid = {
            filtering: true,
            inserting: true,
            option: $.noop
        };

        itemTemplate = field.itemTemplate("any_value");
        assert.equal(itemTemplate.filter("." + field.editButtonClass).length, 1);
        assert.equal(itemTemplate.filter("." + field.deleteButtonClass).length, 1);

        headerTemplate = field.headerTemplate();
        assert.equal(headerTemplate.filter("." + field.insertModeButtonClass).length, 1);

        var $modeSwitchButton = headerTemplate.filter("." + field.modeButtonClass);
        $modeSwitchButton.trigger("click");

        assert.equal(headerTemplate.filter("." + field.searchModeButtonClass).length, 1);

        filterTemplate = field.filterTemplate();
        assert.equal(filterTemplate.filter("." + field.searchButtonClass).length, 1);
        assert.equal(filterTemplate.filter("." + field.clearFilterButtonClass).length, 1);

        insertTemplate = field.insertTemplate();
        assert.equal(insertTemplate.filter("." + field.insertButtonClass).length, 1);

        editTemplate = field.editTemplate("any_value");
        assert.equal(editTemplate.filter("." + field.updateButtonClass).length, 1);
        assert.equal(editTemplate.filter("." + field.cancelEditButtonClass).length, 1);

        assert.strictEqual(field.filterValue(), "");
        assert.strictEqual(field.insertValue(), "");
        assert.strictEqual(field.editValue(), "");
    });

    QUnit.test("switchMode button should consider filtering=false", function(assert) {
        var optionArgs = {};

        var field = new jsGrid.ControlField();
        field._grid = {
            filtering: false,
            inserting: true,
            option: function(name, value) {
                optionArgs = {
                    name: name,
                    value: value
                };
            }
        };

        var headerTemplate = field.headerTemplate();
        assert.equal(headerTemplate.filter("." + field.insertModeButtonClass).length, 1, "inserting switch button rendered");

        var $modeSwitchButton = headerTemplate.filter("." + field.modeButtonClass);

        $modeSwitchButton.trigger("click");
        assert.ok($modeSwitchButton.hasClass(field.modeOnButtonClass), "on class is attached");
        assert.equal(headerTemplate.filter("." + field.insertModeButtonClass).length, 1, "insert button rendered");
        assert.equal(headerTemplate.filter("." + field.searchModeButtonClass).length, 0, "search button not rendered");
        assert.deepEqual(optionArgs, { name: "inserting", value: true }, "turn on grid inserting mode");

        $modeSwitchButton.trigger("click");
        assert.ok(!$modeSwitchButton.hasClass(field.modeOnButtonClass), "on class is detached");
        assert.deepEqual(optionArgs, { name: "inserting", value: false }, "turn off grid inserting mode");
    });

    QUnit.test("switchMode button should consider inserting=false", function(assert) {
        var optionArgs = {};

        var field = new jsGrid.ControlField();
        field._grid = {
            filtering: true,
            inserting: false,
            option: function(name, value) {
                optionArgs = {
                    name: name,
                    value: value
                };
            }
        };

        var headerTemplate = field.headerTemplate();
        assert.equal(headerTemplate.filter("." + field.searchModeButtonClass).length, 1, "filtering switch button rendered");

        var $modeSwitchButton = headerTemplate.filter("." + field.modeButtonClass);

        $modeSwitchButton.trigger("click");
        assert.ok(!$modeSwitchButton.hasClass(field.modeOnButtonClass), "on class is detached");
        assert.equal(headerTemplate.filter("." + field.searchModeButtonClass).length, 1, "search button rendered");
        assert.equal(headerTemplate.filter("." + field.insertModeButtonClass).length, 0, "insert button not rendered");
        assert.deepEqual(optionArgs, { name: "filtering", value: false }, "turn off grid filtering mode");

        $modeSwitchButton.trigger("click");
        assert.ok($modeSwitchButton.hasClass(field.modeOnButtonClass), "on class is attached");
        assert.deepEqual(optionArgs, { name: "filtering", value: true }, "turn on grid filtering mode");
    });

    QUnit.test("switchMode is not rendered if inserting=false and filtering=false", function(assert) {
        var optionArgs = {};

        var field = new jsGrid.ControlField();
        field._grid = {
            filtering: false,
            inserting: false
        };

        var headerTemplate = field.headerTemplate();
        assert.strictEqual(headerTemplate, "", "empty header");
    });

});
