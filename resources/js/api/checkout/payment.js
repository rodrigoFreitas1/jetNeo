﻿import {_alert, _confirm} from '../../functions/message';
import {buscaCep, atualizaCampos} from '../../api/customer/AddressManager';

function clickShipping(){
    var zipcode = $("#zipcode").val();
    var valorFrete = "";
    var idFrete = "";
    var correiosEntrega = "";
    $("#GetShippping .item .checkbox").click(function(){
        if(cancelarCalculoFrete()){
            var ponteiroCurrent = $(".shippingGet", this);
            $(".shippingGet").attr("checked", false);
            $(ponteiroCurrent).attr("checked",true);

            valorFrete = $(ponteiroCurrent).attr("data-value");
            idFrete = $(ponteiroCurrent).attr("data-id");
            correiosEntrega = $(ponteiroCurrent).attr("data-correios");
        }

        if ((valorFrete != "") && (idFrete != "") && (correiosEntrega != "") && (zipcode != "")){
            disparaAjaxShipping(zipcode, idFrete, correiosEntrega);
        }
    });
}

function disparaAjaxShipping(zipcode, idFrete, correiosEntrega){
    $("#resumoCheckout .resumo .title").removeClass("active");
    $("#resumoCheckout .resumo .content").removeClass("active");
    $("#resumoCheckout .resumo .content").stop(false, true).slideUp();

    $.ajax({
        method: "POST",
        url: "SaveFrete",
        data: {
            zipCode: zipcode,
            idShippingMode: new Number(idFrete),
            deliveredByTheCorreiosService: correiosEntrega.toLowerCase()
        },
        success: function (response) {
            atualizaResumoCarrinho();
        }
    });
}

function OrderCreate() {
    $(".GerarPedido").click(function (event) {
        event.preventDefault();
        
        $(this).addClass("disabled");
        $(this).addClass("loading");

        var idCustomer = $("#idCustomer").val();
        var idAddress = $("#idAddress").val();
        var presente = $("#presente").val();
        var mensagem = $("#mensagem").val();
        var idInstallment = 0;
        var installmentNumber = 0;
        var idPaymentBrand = $(this).attr("data-idBrand");
        var tipoVerificacao = $(this).attr("data-Card");
        var creditCard = $("#CreditCard").val();
        var nameCard = $("#Name").val();
        var expDateCard = $("#ExpDate").val();
        var validaMes = expDateCard != "" ? new Number(expDateCard.split("/")[0]) : "";
        var validaAno = expDateCard != "" ? new Number(expDateCard.split("/")[1]) : "";
        var cvvCard = $("#CVV").val();
        var brandCard = $("#brandCard").val();
        var msgErrors = "";

        var validaFrete = "";

        $("#GetShippping .item .description").each(function (index, value) {
            var ponteiroCurrent = $(this);

            if($(ponteiroCurrent).find(".checked").length > 0){
                validaFrete = "S";
                return (false);
            }
            else{
                if($(ponteiroCurrent).find(":checked").length > 0){
                    validaFrete = "S";
                    return (false);
                }
            }
        });

        if(tipoVerificacao == "S"){
            idInstallment = $("#parcCard").val();
            installmentNumber = $("#parcCard").find(':selected').attr("data-InstallmentNumber");
            
            var dataCurrent = new Date();
            var anoCurrent = new Number(dataCurrent.getFullYear());
            var mesCurrent = new Number(dataCurrent.getMonth()+1);

            if(validaMes > 12){
                msgErrors+= "<br />O campo Data de Validade está com o mês inválido!";
            }

            if(validaAno < anoCurrent){
                msgErrors+= "<br />O campo Data de Validade está com o ano inválido!";
            }
            else{
                if(validaAno == anoCurrent){
                    if(validaMes < mesCurrent){
                        msgErrors+= "<br />O campo Data de Validade está com o mês inválido!";
                    }
                }
            }

            $("#validCardCredit").find(".required").each(function(){
                var ponteiroCurrent = $(this);
                var labelCurrent = $(".labelCheckPayment", this).text();
                var valorCurrent = $(".fieldCheckPayment", this).val();
                
                if((valorCurrent == "") || (valorCurrent.length < 3)){
                    msgErrors+= "<br />O campo "+labelCurrent+ " está inválido!";
                }
            });
        }

        if(msgErrors != ""){
            _alert("Ops! Encontramos um problema ..", msgErrors, "warning");
            $(".GerarPedido").removeClass("loading");
            $(".GerarPedido").removeClass("disabled")
        }
        else{
            if (validaFrete == "S") {
                $.ajax({
                    method: "POST",
                    url: "GerarPedido",
                    data: {
                        idCustomer        : idCustomer,
                        idAddress         : new Number(idAddress),
                        presente          : presente,
                        mensagem          : mensagem,
                        idInstallment     : idInstallment,
                        idPaymentBrand    : new Number(idPaymentBrand),
                        creditCard        : creditCard,
                        nameCard          : nameCard,
                        expDateCard       : expDateCard,
                        cvvCard           : cvvCard,
                        brandCard         : brandCard,
                        installmentNumber : new Number(installmentNumber)
                    },
                    success: function (response) {
                        if (response.success == true) {
                            document.location = "Success?orderId=" + response.msg;
                        } else {
                            _alert("Ops! Encontramos um problema ..", response.msg, "warning");
                            $(".GerarPedido").removeClass("loading");
                            $(".GerarPedido").removeClass("disabled");
                        }
                    }
                });
            } else {
                _alert("Ops! Encontramos um problema ..", "Escolha o frete antes de fechar o pedido!", "warning");
                $(".GerarPedido").removeClass("loading");
                $(".GerarPedido").removeClass("disabled");
            }        
        }
    });
}

function onChangeCheckBox(){
    $('#checkPresente').checkbox({
        onChecked: function() {
            $("#presente").val("on");
            $("#exibeMsg > label").show();
            $("#exibeMsg > #mensagem").show();
        },
        onUnchecked: function() {
            $("#presente").val("off");
            $("#exibeMsg > label").hide();
            $("#exibeMsg > #mensagem").hide();
        }
    });
}

function verificaPresente(){
    $("#embrulhaPresente").click(function(){
        $("#exibeMsg").removeAttr("style");
        if($('#checkPresente').checkbox('is checked')) {
            $("#exibeMsg > label").show();
            $("#exibeMsg > #mensagem").show();
        }
        else {
            $("#exibeMsg > label").hide();
            $("#exibeMsg > #mensagem").hide();
        }
    });
}

function validaCartaoCreditoBandeira(){
    $("#CreditCard").on("blur", function(){
        var cartoes = {
            elo: /^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|(506699|5067[0-6]\d|50677[0-8])|(50900\d|5090[1-9]\d|509[1-9]\d{2})|65003[1-3]|(65003[5-9]|65004\d|65005[0-1])|(65040[5-9]|6504[1-3]\d)|(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|(65054[1-9]| 6505[5-8]\d|65059[0-8])|(65070\d|65071[0-8])|65072[0-7]|(65090[1-9]|65091\d|650920)|(65165[2-9]|6516[6-7]\d)|(65500\d|65501\d)|(65502[1-9]|6550[3-4]\d|65505[0-8]))[0-9]{10,12}/,
            dinners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
            dinersClub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
            hipercard: /^(38[0-9]{17}|60[0-9]{14})$/,
            amex: /^3[47][0-9]{13}$/,
            aura: /^50[0-9]{14,17}$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            jcb: /^(?:2131|1800|35\d{3})\d{11}/
        };

        var numeroCartao = $(this).val().replace(/\s/g, '' );
        var codigoBandeira = 0;
        for (var cartao in cartoes){
            if (numeroCartao.match(cartoes[cartao])){
                switch(cartao) {
                    case "elo":
                        codigoBandeira = 0;
                        break;

                    case "dinners":
                        codigoBandeira = 210;
                        break;

                    case "discover":
                        codigoBandeira = 0;
                        break;

                    case "dinersClub":
                        codigoBandeira = 0;
                        break;

                    case "hipercard":
                        codigoBandeira = 212;
                        break;

                    case "amex":
                        codigoBandeira = 0;
                        break;

                    case "aura":
                        codigoBandeira = 0;
                        break;

                    case "mastercard":
                        codigoBandeira = 208;
                        break;

                    case "visa":
                        codigoBandeira = 209;
                        break;

                    case "jcb":
                        codigoBandeira = 213;
                        break;
                }
                $("#btnCardCredit").attr("data-idBrand",codigoBandeira);
                $("#brandCard").val(cartao);
                atualizaParcelamento(codigoBandeira);
            }
        }
        if(codigoBandeira == 0){
            $("#parcCard").html("<option value=''>Informe o numero do cartão primeiro</option>");
            _alert("Ops! Encontramos um problema ..", "A loja pode não aceitar essa bandeira ou o cartão está incorreto", "warning");
        }
    });
}

function atualizaParcelamento(codigoBandeira){
    var option = "";
    if(codigoBandeira > 0){
        $.ajax({
            method: "POST",
            url: "LoadInstallment",
            data: {
                idPaymentBrand: new Number(codigoBandeira),
                idPaymentMethod: new Number(1)
            },
            success: function (response) {
                var objParcelamento = response.ListInstallment;

                for (var i = 0; i < objParcelamento.length; i++) {
                    var IdInstallment = objParcelamento[i].IdInstallment;
                    var InstallmentNumber = objParcelamento[i].InstallmentNumber;
                    var Value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(objParcelamento[i].Value);
 
                    option += "<option value='"+IdInstallment+"' data-InstallmentNumber='"+InstallmentNumber+"'>"+InstallmentNumber+"x - "+Value+"</option>";
                    $("#parcCard").html(option);
                }
            }
        });
    }
}

function listAddressPayment(){
    $("#listAddressPayment").click(function(){
        $("#addDataAddress").removeClass("addAddress");
        $("#addDataAddress").text("Adicionar");
        $("#listAddressData").show();
        $("#registerAddressPayment").hide();
        
        viewAddressLogged();
        RecoverPasswordByEmail();
        $('.ui.modal').modal('show');
    });
}

function showAddressPayment(){
    $("#addDataAddress").click(function(){
        if($(".addAddress").length > 0){
            var jsonArray = [];
            var splittedFormData = $("#disparaForm").serialize().split('&');

            $.each(splittedFormData, function (key, value) {
                var item = {};
                var splittedValue = value.split('=');
                item["name"] = splittedValue[0];
                item["value"] = splittedValue[1];
                jsonArray.push(item);
            });

            $.ajax({
                method: "POST",
                url: "CreateAddress",
                data: jsonArray,
                success: function(responseDefault){
                    if(responseDefault.success){
                        atualizaEnderecos(responseDefault);
                    }
                    else{
                        _alert("Ops! Encontramos um problema ..", responseDefault.msg, "warning");
                    }
                }
            });
        }
        else{
            $("#listAddressData").hide();
            $("#registerAddressPayment").show();
            $(this).addClass("addAddress");
            $(this).text("Cadastrar");
            $('.ui.modal').modal('refresh');
        }
    });
}

function changeAddressPayment(){
    $(".utilAddress").click(function(){
        var zipCodeCart = $("#zipcode").val();
        var idShippingModeCart = new Number($("#idShipping").val());
        var idAddressChange = $(this).attr("data-id");
        $("#registerAddressPayment").hide();

        $.ajax({
            method: "POST",
            url: "ListAddressDefault",
            success: function(responseDefault){
                $.ajax({
                    method: "POST",
                    url: "ChangeAddressCheckout",
                    data:{
                        idAddressDefault : responseDefault.msg,
                        idAddressCurrent : idAddressChange
                    },
                    success: function(responseChange){
                        if(responseChange.success){
                            atualizaEnderecos(responseChange);
                        }
                        else{
                            _alert("Ops! Encontramos um problema ..", responseChange.msg, "warning");
                        }
                    }
                });
            }
        });
    });
}

function cancelarCalculoFrete(){
    atualizaResumoCarrinho();
    return(true);
}

function atualizaResumoCarrinho(){
    $.ajax({
        method: "POST",
        url: "LoadResumoPayment",
        success: function (data) {
            $("#resumoCheckout").html(data);
            $("#resumoCheckout .resumo .title").addClass("active");
            $("#resumoCheckout .resumo .content").addClass("active");
            $("#resumoCheckout .resumo .content").stop(false, true).slideDown();
            var codigoBandeira = $("#btnCardCredit").attr("data-idBrand");
            if(typeof(codigoBandeira) != "undefined"){
                atualizaParcelamento(codigoBandeira);
            }
        }
    });
}

function atualizaEnderecos(responseChange){
    updateAddress();

    $("#idAddress").val(responseChange.idAddress);
    $("#streetClient").text(responseChange.streetClient);
    $("#numberClient").text(responseChange.numberClient);
    $("#complementClient").text(responseChange.complementClient);
    $("#neighbourhoodClient").text(responseChange.neighbourhoodClient);
    $("#cityClient").text(responseChange.cityClient);
    $("#stateClient").text(responseChange.stateClient);
    $("#zipCodeClient").text(responseChange.zipCodeClient);
    $("#zipcode").val(responseChange.zipCodeClient);

    $.ajax({
        method: "POST",
        url: "ListaFretePagamento",
        success: function success(data) {
            $("#updateShippingPayment").html(data);
            if(cancelarCalculoFrete()){
                clickShipping();
            }
            $('.ui.modal').modal('hide');
        }
    });
}


function applyDiscount(){
    $("#applyDiscount").click(function(){
        var key = $("#key").val();
        var customerId = $("#idCustomer").val();

        if((key != "") && (customerId != "")){
            $.ajax({
                method: "POST",
                url: "AplicaDescontoCheckout",
                data: {
                    key         : key,
                    customerId  : customerId
                },
                success: function success(response) {
                    if(response.success){
                        atualizaResumoCarrinho();
                        _alert("Cupom de Desconto!", response.msg, "success");
                    }else{
                        $("#key").val("");
                        _alert("Ops! Encontramos um problema ..", response.msg, "warning");
                    }
                }
            });
        }else{
            _alert("Ops! Encontramos um problema ..", "Você não informou uma chave de desconto!", "warning");
        }
    });
}

function updateAddress(){
    $.ajax({
        method: "POST",
        url: "ListaEnderecosCliente",
        success: function success(data) {
            $("#ListaEnderecosCliente").html(data);
            $("#registerAddressPayment").hide();
            changeAddressPayment();
            showAddressPayment();
            calculaFreteUpdate();

            $('.ui.modal').modal('refresh');
        }
    });
}

function viewAddressLogged(){
    $("#loginPayment").click(function(){
        var token = $("input[name='__RequestVerificationToken']").val();
        var userName = $("#UserName").val();
        var password = $("#password").val();
        $.ajax({
            method: "POST",
            url: "/Customer/Login",
            data:{
                __RequestVerificationToken : token,
                UserName : userName,
                password: password
            },
            success: function success(response){
                if(response.success){
                    updateAddress();
                    updateDadosUsuario();
                }else{
                    _alert("Ops! Encontramos um problema ..", response.message, "warning");
                }
            }
        });
    });
}

function calculaFreteUpdate(){
    $("#zipCode").keyup(function (event) {
        var cep = $("#zipCode").val()
        cep = cep.replace("-", "")
        if (cep.length == 8) {
            buscaCep(cep)
        }
    });
}

function updateDadosUsuario(){
    var zipCodeCart = $("#zipCode").val();
    var idShippingModeCart = $("#idAddress").val();
    $.ajax({
        method: "POST",
        url: "ListaDadosCliente",
        data:{
            zipCodeCart         : zipCodeCart,
            idShippingModeCart  : idShippingModeCart
        },
        success: function success(response){
            $("#dadosClienteUpdate").html(response);
            updateAddress();
            listAddressPayment();
        }
    });
}

function CheckAccessKey(){
    $("#ListaEnderecosCliente").on("click", "#confirmTokkenPayment", function(event){
        var codeTokkenPayment = $("#codeTokkenPayment").val();
        if((codeTokkenPayment != "") && (typeof(codeTokkenPayment) != "undefined")){
            $.ajax({
                method: "POST",
                url: "/customer/CheckAccessKey",
                data:{
                    KeyAccess : codeTokkenPayment
                },
                success: function success(response){
                    if(response.Success){
                        viewNewPassword();
                        $('.ui.modal').modal('refresh');
                    }else{
                        _alert("Ops! Encontramos um problema ..", response.Message, "warning");
                    }
                }
            });
        }else{
            _alert("Ops! Encontramos um problema ..", "Informe a Chave de Acesso!", "warning");
        }
    });
}

function viewRecive_Code(){
    $.ajax({
        method: "POST",
        url: "Recive_Code",
        success: function success(response){
            $("#ListaEnderecosCliente").html(response);
        }
    });
}

function viewNewPassword(){
    var token = $("input[name='__RequestVerificationToken']").val();

    $.ajax({
        method: "POST",
        url: "PageNewPassword",
        data:{
            __RequestVerificationToken : token
        },
        success: function success(response){
            $("#ListaEnderecosCliente").html(response);
            accessUser();
        }
    });
}

function accessUser(){
    $("#pwdPayment").click(function(event){
        event.preventDefault();
        event.stopPropagation();
        var token = $("input[name='__RequestVerificationToken']").val();
        var pwdUser = $("#pwdUser").val();
        var pwdUserConfirm = $("#pwdUserConfirm").val();

        if((pwdUser != "") && (pwdUserConfirm != ""))
        {
            $.ajax({
                method: "POST",
                url: "NewPassword",
                data: {
                    __RequestVerificationToken : token,
                    pwdUser : pwdUser,
                    pwdUserConfirm : pwdUserConfirm
                },
                success: function success(response){
                    if(response.success){
                        updateAddress();
                        updateDadosUsuario();
                        calculaFreteUpdate();
                    }else{
                        _alert("Ops! Encontramos um problema .. 1", response.message, "warning");
                    }
                }
            });
        }else{
            _alert("Ops! Encontramos um problema ..", "Informe a senha", "warning");
        }
    });
}

function ReEnviarCodigoEmail(){
    $("#reenviarCod").click(function(){
        $.ajax({
            method: "POST",
            url: "ReEnviarCodigoEmail",
            success: function success(response){
                if(!response.success){
                    _alert("Ops! Encontramos um problema ..", response.message, "warning");
                }else{
                    _alert("Por favor Aguarde!", "Em instantes você receberá no seu e-mail, as instruções para obter seu código de acesso.", "warning");
                }
            }
        });
    });
}

function RecoverPasswordByEmail(){
    $("#RecoverPasswordByEmail").click(function(){
        $.ajax({
            method: "POST",
            url: "/customer/RecoverPasswordByEmail",
            data:{
                email : $("#UserName").val()
            },
            success: function success(response){
                if(response.Success){
                    _alert("Por favor Aguarde!", response.Message, "warning");
                }else{
                    _alert("Ops! Encontramos um problema ..", response.Message, "warning");
                }
            }
        });
    });
}



$(document).ready(function () {
    //$.jetRoute("checkout", function (){ 
        if($("#idAddress").val() != ""){
            clickShipping();
            if ($(".GerarPedido").length > 0) {
                OrderCreate();
            }
            onChangeCheckBox();
            verificaPresente();
            validaCartaoCreditoBandeira();
            listAddressPayment();
            changeAddressPayment();
            showAddressPayment();
            applyDiscount();
            CheckAccessKey();
            ReEnviarCodigoEmail();
        }
        else{
            _alert("Ops! Encontramos um problema ..", "Você não pode fechar um pedido sem um endereço de entrega!", "warning");
        }
    //});
});