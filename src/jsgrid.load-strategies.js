(function(jsGrid, $, undefined) {

    function DirectLoadingStrategy(grid) {
        this._grid = grid;
    }

    DirectLoadingStrategy.prototype = {

        firstDisplayIndex: function() {
            var grid = this._grid;
            return grid.option("paging") ? (grid.option("pageIndex") - 1) * grid.option("pageSize") : 0;
        },

        lastDisplayIndex: function() {
            var grid = this._grid;
            var itemsCount = grid.option("data").length;

            return grid.option("paging")
                ? Math.min(grid.option("pageIndex") * grid.option("pageSize"), itemsCount)
                : itemsCount;
        },

        itemsCount: function() {
            return this._grid.option("data").length;
        },

        openPage: function(index) {
            this._grid.refresh();
        },

        // jsxgrid extension: all rows are in memory already, "page" is just the slice on screen
        exportRows: function(scope) {
            var data = this._grid.option("data");
            var rows = scope === "page"
                ? data.slice(this.firstDisplayIndex(), this.lastDisplayIndex())
                : data.slice();

            return $.Deferred().resolve(rows).promise();
        },

        loadParams: function() {
            return {};
        },

        sort: function() {
            this._grid._sortData();
            this._grid.refresh();
            return $.Deferred().resolve().promise();
        },

        reset: function() {
            this._grid.refresh();
            return $.Deferred().resolve().promise();
        },

        finishLoad: function(loadedData) {
            this._grid.option("data", loadedData);
        },

        finishInsert: function(insertedItem, location) {
            var grid = this._grid;
            
            switch(location){
                case "top":
                    grid.option("data").unshift(insertedItem);
                    break;
                case "bottom":
                default:
                    grid.option("data").push(insertedItem);
            }
            
            grid.refresh();
        },

        finishDelete: function(deletedItem, deletedItemIndex) {
            var grid = this._grid;
            grid.option("data").splice(deletedItemIndex, 1);
            grid.reset();
        }
    };


    function PageLoadingStrategy(grid) {
        this._grid = grid;
        this._itemsCount = 0;
    }

    PageLoadingStrategy.prototype = {

        firstDisplayIndex: function() {
            return 0;
        },

        lastDisplayIndex: function() {
            return this._grid.option("data").length;
        },

        itemsCount: function() {
            return this._itemsCount;
        },

        openPage: function(index) {
            this._grid.loadData();
        },

        // jsxgrid extension: only the current page is in memory; "all" has to ask the controller
        exportRows: function(scope, chunkSize) {
            if(scope === "page") {
                return $.Deferred().resolve(this._grid.option("data").slice()).promise();
            }

            return this._grid._loadAllRows(chunkSize);
        },

        loadParams: function() {
            var grid = this._grid;
            return {
                pageIndex: grid.option("pageIndex"),
                pageSize: grid.option("pageSize")
            };
        },

        reset: function() {
            return this._grid.loadData();
        },

        sort: function() {
            return this._grid.loadData();
        },

        finishLoad: function(loadedData) {
            this._itemsCount = loadedData.itemsCount;
            this._grid.option("data", loadedData.data);
        },

        finishInsert: function(insertedItem) {
            this._grid.search();
        },

        finishDelete: function(deletedItem, deletedItemIndex) {
            this._grid.search();
        }
    };

    jsGrid.loadStrategies = {
        DirectLoadingStrategy: DirectLoadingStrategy,
        PageLoadingStrategy: PageLoadingStrategy
    };

}(jsGrid, jQuery));
