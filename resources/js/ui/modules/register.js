/**
 * Client Register View
 */

import {completaCEP} from "../../functions/correios";

import{formSettings} from "../starters/formManipulation";

import {hideADDR, showADDR, showProfile, hideProfile} from "../../functions/form-control";

require("../../functions/jetCorreios");


$(document).ready(function () {
    hideProfile(".pessoa.juridica");
    hideADDR();

    $("#registro_cliente").form(formSettings);

    function buscaCep(element, id) {
        let options = {
            inputSelector: {
                logradouro: "input[name='Address[" + id + "].StreetAddress']",
                bairro: "input[name='Address[" + id + "].Neighbourhood']",
                localidade: "input[name='Address[" + id + "].City']",
                numero: "input[name='Address[" + id + "].Number']",
                complemento: "input[name='Address[" + id + "].Complement']",
                uf: {
                    input: `#estado_${id}`,
                    isDropDown: true,
                    changing: function (uf) {
                        "use strict";
                        $(`#estado_${id}`).dropdown("set selected", uf);
                        if ($(`#estado_${id}`).closest(".jet.checkout").length === 1){
                            $(`#estado_${id}`).closest(".field").addClass("success");
                        }
                    },
                    loading: function () {
                        $("#estado_" + id + "").dropdown("set text", "...");
                    },
                    clearing: function () {
                        $("#estado_" + id + "").dropdown("clear");
                    }
                },
                onError: function () {

                }
            }
        };
        $(element).buscaCep(options);
    }

    $("input[name='Address[0].ZipCode']").inputmask("99999-999", {
        greedy: false,
        oncomplete: function () {
            buscaCep($(this), 0);
        }
    });

    $("input[name='Address[1].ZipCode']").inputmask("99999-999", {
        greedy: false,
        oncomplete: function () {
            buscaCep($(this), 1);
        }
    });

    $("#registro_cliente .endereco.igual").checkbox({
        onChecked: function () {
            hideADDR(true);
        },
        onUnchecked: function () {
            showADDR(true);
        }
    });

    $(".tipo.cliente").dropdown('set selected', 'pf')
        .dropdown({
            allowReselection: true,
            action: 'activate',
            onChange: function (value) {
                switch (value) {
                    case "pf":
                        hideProfile(".pessoa.juridica");
                        showProfile(".pessoa.fisica");
                        break;
                    case "pj":
                        hideProfile(".pessoa.fisica");
                        showProfile(".pessoa.juridica");
                        break;
                }
            }
        });
});