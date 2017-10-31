/**
 * Montagem da UI de Filtros do Sistema
 */

$(document).ready(function () {

    /**
     * Semantic-UI - Accordion
     */
    $(".filtros .ui.accordion").accordion({
        "exclusive": false,
    });

    $(".filterbutton").click(function () {
        $("#filtros").toggleClass("ativo");
        $(".filterbar").show();
    });

    $(".closeFiltros").click(function () {
        $("#filtros").toggleClass("ativo");
        $(".filterbar").hide();
    });


});