$(function() {

    var sortStrategies = jsGrid.sortStrategies;


    QUnit.module("sortStrategies");

    QUnit.test("string sorting", function(assert) {
        var data = ["c", "a", "d", "b"];

        data.sort(sortStrategies["string"]);

        assert.deepEqual(data, ["a", "b", "c", "d"]);
    });

    QUnit.test("string sorting should be robust", function(assert) {
        var data = ["a", 1, true, "b"];

        data.sort(sortStrategies["string"]);

        assert.deepEqual(data, [1, "a", "b", true]);
    });

    QUnit.test("number sorting", function(assert) {
        var data = [5, 3.2, 1e2, 4];

        data.sort(sortStrategies["number"]);

        assert.deepEqual(data, [3.2, 4, 5, 100]);
    });

    QUnit.test("date sorting", function(assert) {
        var date1 = new Date(2010, 0, 1),
            date2 = new Date(2011, 0, 1),
            date3 = new Date(2012, 0, 1);

        var data = [date2, date3, date1];

        data.sort(sortStrategies["date"]);

        assert.deepEqual(data, [date1, date2, date3]);
    });

    QUnit.test("numberAsString sorting", function(assert) {
        var data = [".1", "2.1", "4e5", "2"];

        data.sort(sortStrategies["numberAsString"]);

        assert.deepEqual(data, [".1", "2", "2.1", "4e5"]);
    });
});
