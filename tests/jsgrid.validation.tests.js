$(function() {

    var validators = jsGrid.validators;


    QUnit.module("validation.validate", {
        beforeEach: function() {
            this.validation = new jsGrid.Validation();
        }
    });

    QUnit.test("as function", function(assert) {
        var validateFunction = function(value) {
            return value === "test";
        };

        assert.deepEqual(this.validation.validate({
            value: "not_test",
            rules: validateFunction
        }), [undefined]);

        assert.deepEqual(this.validation.validate({
            value: "test",
            rules: validateFunction
        }), []);
    });

    QUnit.test("as rule config", function(assert) {
        var validateRule = {
            validator: function(value) {
                return value === "test";
            },
            message: "Error"
        };

        assert.deepEqual(this.validation.validate({
            value: "not_test",
            rules: validateRule
        }), ["Error"]);

        assert.deepEqual(this.validation.validate({
            value: "test",
            rules: validateRule
        }), []);
    });

    QUnit.test("as rule config with param", function(assert) {
        var validateRule = {
            validator: function(value, item, param) {
                return value === param;
            },
            param: "test",
            message: "Error"
        };

        assert.deepEqual(this.validation.validate({
            value: "not_test",
            rules: validateRule
        }), ["Error"]);

        assert.deepEqual(this.validation.validate({
            value: "test",
            rules: validateRule
        }), []);
    });

    QUnit.test("as array of rules", function(assert) {
        var validateRules = [{
            message: "Error",
            validator: function(value) {
                return value !== "";
            }
        }, {
            validator: function(value) {
                return value === "test";
            }
        }];

        assert.deepEqual(this.validation.validate({
            value: "",
            rules: validateRules
        }), ["Error", undefined]);

        assert.deepEqual(this.validation.validate({
            value: "test",
            rules: validateRules
        }), []);
    });

    QUnit.test("as string", function(assert) {
        validators.test_validator = function(value) {
            return value === "test";
        };

        assert.deepEqual(this.validation.validate({
            value: "not_test",
            rules: "test_validator"
        }), [undefined]);

        assert.deepEqual(this.validation.validate({
            value: "test",
            rules: "test_validator"
        }), []);

        delete validators.test_validator;
    });

    QUnit.test("as rule config with validator as string", function(assert) {
        validators.test_validator = function(value) {
            return value === "test";
        };

        var validateRule = {
            validator: "test_validator",
            message: "Error"
        };

        assert.deepEqual(this.validation.validate({
            value: "not_test",
            rules: validateRule
        }), ["Error"]);

        assert.deepEqual(this.validation.validate({
            value: "test",
            rules: validateRule
        }), []);

        delete validators.test_validator;
    });

    QUnit.test("as array of mixed rules", function(assert) {
        validators.test_validator = function(value) {
            return value === "test";
        };

        var validationRules = [
            "test_validator",
            function(value) {
                return value !== "";
            }, {
                validator: function(value) {
                    return value === "test";
                },
                message: "Error"
            }
        ];

        assert.deepEqual(this.validation.validate({
            value: "",
            rules: validationRules
        }), [undefined, undefined, "Error"]);

        assert.deepEqual(this.validation.validate({
            value: "not_test",
            rules: validationRules
        }), [undefined, "Error"]);

        assert.deepEqual(this.validation.validate({
            value: "test",
            rules: validationRules
        }), []);

        delete validators.test_validator;
    });

    QUnit.test("as string validator with default error message", function(assert) {
        validators.test_validator = {
            message: function(value) {
                return "Error: " + value;
            },
            validator: function(value) {
                return value === "test";
            }
        };

        var validateRule = {
            validator: "test_validator"
        };

        assert.deepEqual(this.validation.validate({
            value: "not_test",
            rules: validateRule
        }), ["Error: not_test"]);

        assert.deepEqual(this.validation.validate({
            value: "test",
            rules: validateRule
        }), []);

        delete validators.test_validator;
    });

    QUnit.test("throws exception for unknown validator", function(assert) {
        var validateRule = {
            validator: "unknown_validator"
        };

        var validation = this.validation;

        assert.throws(function() {
            validation.validate({
                value: "test",
                rules: validateRule
            });
        }, /unknown validator "unknown_validator"/, "exception for unknown validator");
    });


    QUnit.module("validators", {
        beforeEach: function() {
            var validation = new jsGrid.Validation();

            this.testValidator = function(validator, value, param) {
                var result = validation.validate({
                    value: value,
                    rules: { validator: validator, param: param }
                });

                return !result.length;
            }
        }
    });

    QUnit.test("required", function(assert) {
        assert.equal(this.testValidator("required", ""), false);
        assert.equal(this.testValidator("required", undefined), false);
        assert.equal(this.testValidator("required", null), false);
        assert.equal(this.testValidator("required", 0), true);
        assert.equal(this.testValidator("required", "test"), true);
    });

    QUnit.test("rangeLength", function(assert) {
        assert.equal(this.testValidator("rangeLength", "123456", [0, 5]), false);
        assert.equal(this.testValidator("rangeLength", "", [1, 5]), false);
        assert.equal(this.testValidator("rangeLength", "123", [0, 5]), true);
        assert.equal(this.testValidator("rangeLength", "", [0, 5]), true);
        assert.equal(this.testValidator("rangeLength", "12345", [0, 5]), true);
    });

    QUnit.test("minLength", function(assert) {
        assert.equal(this.testValidator("minLength", "123", 5), false);
        assert.equal(this.testValidator("minLength", "12345", 5), true);
        assert.equal(this.testValidator("minLength", "123456", 5), true);
    });

    QUnit.test("maxLength", function(assert) {
        assert.equal(this.testValidator("maxLength", "123456", 5), false);
        assert.equal(this.testValidator("maxLength", "12345", 5), true);
        assert.equal(this.testValidator("maxLength", "123", 5), true);
    });

    QUnit.test("pattern", function(assert) {
        assert.equal(this.testValidator("pattern", "_13_", "1?3"), false);
        assert.equal(this.testValidator("pattern", "13", "1?3"), true);
        assert.equal(this.testValidator("pattern", "3", "1?3"), true);
        assert.equal(this.testValidator("pattern", "_13_", /1?3/), true);
    });

    QUnit.test("range", function(assert) {
        assert.equal(this.testValidator("range", 6, [0, 5]), false);
        assert.equal(this.testValidator("range", 0, [1, 5]), false);
        assert.equal(this.testValidator("range", 3, [0, 5]), true);
        assert.equal(this.testValidator("range", 0, [0, 5]), true);
        assert.equal(this.testValidator("range", 5, [0, 5]), true);
    });

    QUnit.test("min", function(assert) {
        assert.equal(this.testValidator("min", 3, 5), false);
        assert.equal(this.testValidator("min", 5, 5), true);
        assert.equal(this.testValidator("min", 6, 5), true);
    });

    QUnit.test("max", function(assert) {
        assert.equal(this.testValidator("max", 6, 5), false);
        assert.equal(this.testValidator("max", 5, 5), true);
        assert.equal(this.testValidator("max", 3, 5), true);
    });

});
