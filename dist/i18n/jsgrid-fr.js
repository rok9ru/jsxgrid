(function(jsGrid) {

    if (!jsGrid) {
        if (window.console) {
            console.error("[jsxgrid] fr.js was loaded before the jsxgrid engine (jsxgrid.js) - include the engine first.");
        }
        return;
    }


    jsGrid.locales.fr = {
        grid: {
            noDataContent: "Pas de données",
            deleteConfirm: "Êtes-vous sûr ?",
            pagerFormat: "Pages: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} de {pageCount}",
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",
            loadMessage: "Chargement en cours...",
            invalidMessage: "Des données incorrectes sont entrés !"
        },

        loadIndicator: {
            message: "Chargement en cours..."
        },

        fields: {
            control: {
                searchModeButtonTooltip: "Recherche",
                insertModeButtonTooltip: "Ajouter une entrée",
                editButtonTooltip: "Changer",
                deleteButtonTooltip: "Effacer",
                searchButtonTooltip: "Trouve",
                clearFilterButtonTooltip: "Effacer",
                insertButtonTooltip: "Ajouter",
                updateButtonTooltip: "Sauvegarder",
                cancelEditButtonTooltip: "Annuler"
            },
            Xcontrol: {
                searchModeButtonTooltip: "Recherche",
                insertModeButtonTooltip: "Ajouter une entrée",
                editButtonTooltip: "Changer",
                deleteButtonTooltip: "Effacer",
                searchButtonTooltip: "Trouve",
                clearFilterButtonTooltip: "Effacer",
                insertButtonTooltip: "Ajouter",
                updateButtonTooltip: "Sauvegarder",
                cancelEditButtonTooltip: "Annuler"
            },
            XimgField: {
                editButtonText: "Ouvrir le gestionnaire de fichiers"
            },
            Xjsoneditor: {
                editText: "Éditeur",
                closeText: "Enregistrer"
            }
        },

        validators: {
            required: { message: "Champ requis" },
            rangeLength: { message: "Longueur de la valeur du champ est hors de la plage définie" },
            minLength: { message: "La valeur du champ est trop court" },
            maxLength: { message: "La valeur du champ est trop long" },
            pattern: { message: "La valeur du champ ne correspond pas à la configuration définie" },
            range: { message: "La valeur du champ est hors de la plage définie" },
            min: { message: "La valeur du champ est trop petit" },
            max: { message: "La valeur du champ est trop grande" }
        }
    };

}(window.jsGrid, window.jQuery));

