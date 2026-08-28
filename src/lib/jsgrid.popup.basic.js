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