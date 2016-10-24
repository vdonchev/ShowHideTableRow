function initBlockControls() {
    let allRows = $('.hide-block');
    let controller = (function () {
        let cookieManager = (function () {
            function createCookie(name, value, days = 90) {
                let expires;
                if (days) {
                    let date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date;
                }
                else {
                    expires = "";
                }

                document.cookie = name + "=" + value + expires + "; path=/";
            }

            function readCookie(name) {
                let nameEQ = name + "=";
                let ca = document.cookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                }

                return null;
            }

            return {createCookie, readCookie}
        })();

        (function updateBlocksOnLoad() {
            let toShow = JSON.parse(cookieManager.readCookie('hiddenBlocks'));
            if (toShow != null) {
                toShow
                    .forEach(id => {
                        let current = $('#' + id);
                        current.show();
                        current.prev().find('.hide-block').text('-');
                        current.removeAttr('data-hidden');
                    })
            } else {
                let all = $('.block-content');
                all.show();
                all.prev().find('.hide-block').text('-');
                all.removeAttr('data-hidden');
            }
        })();

        function hideShow() {
            let rowToHide = $(this).parent().parent().next();
            if (rowToHide.attr('data-hidden')) {
                rowToHide.show();
                rowToHide.removeAttr('data-hidden');
                $(this).text('-');
                updateCookie();
            } else {
                rowToHide.hide();
                rowToHide.attr('data-hidden', 'true');
                $(this).text('+');
                updateCookie();
            }

            function updateCookie() {
                let hidden = $('tr.header')
                    .toArray()
                    .map(tr => $(tr))
                    .filter(tr => !tr.next().attr('data-hidden'))
                    .map(tr => tr.next().attr('id'));

                cookieManager.createCookie('hiddenBlocks', JSON.stringify(hidden));
            }
        }

        return {hideShow}
    })();

    allRows.click(controller.hideShow);
}