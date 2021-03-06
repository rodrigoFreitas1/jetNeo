export function hideADDR(limpeza = false) {
    $(".endereco.cobranca").hide().find("input").each(function () {
        $(this).hide().attr("disabled", true);
        if (limpeza){
            $(this).val("");
        }
    });
}

export function showADDR(limpeza = false) {
    $(".endereco.cobranca").show().find("input").each(function () {
        $(this).show().attr("disabled", false);
        if (limpeza){
            $(this).val("");
        }
    });
}

export function hideProfile(profile) {
    $(profile).hide().find('input').each(function () {
        $(this).val('').attr('disabled', true);
    });
}

export function showProfile(profile) {
    $(profile).show().find('input').each(function () {
        $(this).val('').attr('disabled', false);
    });
}

export function SomenteNumerosPositivos(valor) {
    var resultado = valor.replace('/^[1-9]\d*$/g', '');
    if(resultado == ""){
      return 1;
    }else {
        var resultadoPositivo = parseInt(resultado);
        if(resultadoPositivo < 0){
          return 1;
        }else {
            return resultadoPositivo;
        }
    }

}
