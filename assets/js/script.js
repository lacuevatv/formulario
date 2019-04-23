/**
 * File script.js
 *
 * @required jQuery
 * @ver 1.0
 --------------------------------------------------------------
>>> TABLE OF CONTENTS:
1.0 DOC READY
2.0 FUNCIONES
2.1 funciones de limpieza der caracteres y demas
2.2 initFormulario: da inicio al formulario
2.3. setea e imprime el indice del formulario
2.4. 
--------------------------------------------------------------*/
var baseUrl = 'http://' + window.location.host;
//var ajaxFileUrl = baseUrl + '/inc/ajax.php';
var indexactual = 1;
var totalPantallas = 9;
var hermanos = 0;//numero de hno, por defecto no hay

/*--------------------------------------------------------------
1.0 BASE 
* navigation, scroll to
--------------------------------------------------------------*/
$(document).ready(function(){

    initFormularios();

});//.ready()


/*--------------------------------------------------------------
2.0 FUNCIONES
--------------------------------------------------------------*/
//se pasa con numeral #page
function scrollToID ( id ) {
    $('html, body').stop().animate({
        scrollTop: $(id).offset().top -90
    }, 'slow');
}

function scrollUp () {
    $('html, body').stop().animate({
        scrollTop: 0
    }, 'slow');
}
/*
 * funciones de limpieza
*/
//busca los caracteres indicados en un string y devuelve true si existen
function areThereAny( cadena, characters ) {
    for (var i = 0; i < characters.length; i++) {
        if ( cadena.indexOf(characters[i]) != -1 ) {
                return true;    
        }
    }
    return false;
}

//quita caracteres especificos a un string
function cleanedOthers(cadena, caracteres){ 

    //eliminamos uno por uno
    for (var i = 0; i < caracteres.length; i++) {
        cadena= cadena.replace(new RegExp(caracteres[i], 'gi'), '');
    }   

    return cadena;
}

//quita caracteres extraños del string, los caracteres se pasan como una variable
function cleanedSpecialCharacters( cadena ){ 
    var specialcharacters = '@#$^&%*()+=[]\'\"\/{}|:;¡!¿?<>,.';

    //eliminamos uno por uno
    for (var i = 0; i < specialcharacters.length; i++) {
        cadena= cadena.replace(new RegExp("\\" + specialcharacters[i], 'gi'), '');
    }   

    return cadena;
}

//lo pasa a minúsculas
function toLowerCase(cadena) {
    cadena = cadena.toLowerCase();
    return cadena;
}

//remplasa dashes "-" del string por espacios
function replaceDashes( cadena ) {
    cadena = cadena.replace(/-/gi," ");
    cadena = cadena.replace(/_/gi," ");
    return cadena;
}


//borra espacios del string
function removeDashesSpaces( cadena ) {
    cadena = cadena.replace(/-/gi,"");
    cadena = cadena.replace(/_/gi,"");
    cadena = cadena.replace(/ /gi,"");
    return cadena;
}

// Quitamos espacios y los sustituimos por - porque nos gusta mas asi
function replaceSpaces( cadena ) {
    cadena = cadena.replace(/ /gi,"-");
    return cadena;
}

//quita acentos y ñ y lo pasa a minúsculas
function cleanAcentos( cadena ) {

    // Lo queremos devolver limpio en minusculas
    cadena = cadena.toLowerCase();

    // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
    cadena = cadena.replace(/á/gi,"a");
    cadena = cadena.replace(/é/gi,"e");
    cadena = cadena.replace(/í/gi,"i");
    cadena = cadena.replace(/ó/gi,"o");
    cadena = cadena.replace(/ú/gi,"u");
    cadena = cadena.replace(/ñ/gi,"n");
    return cadena;
}

/*
 * FUNCIONES DEL PROGRAMA
*/

function initFormularios(){
    
    //coloca la primer pantalla para empezar
    setScreenFormulario(indexactual);

    //clic en label, focus en input
    $(document).on('click', 'label', function(){
        
        if ( $(this).attr('data-animate') == 'false' ) {
            return true;    
        }
        focusInput( this );
    });

    //on focus, etiqueta se achica
    $(document).on('focus', 'input', function(){
        zoomOutLabel( this );
        $(this).addClass('input-on');
    });

    //botones pantalla, para adelante y para atras:
    $(document).on('click', '.btn-pantallas', function(e){
        var pantallaActual = $(this).attr('data-pantalla');
        var direccion = $(this).attr('data-direction');
        var nuevaPantalla;

        //chequea direccion para asignar la pantalla a activar
        if (direccion == 'next') {

            //si es la ultima pantalla hay que enviar formulario
            if ( parseInt(pantallaActual) == totalPantallas ) {
                console.log('estamos en la ultima pantalla, enviar formulario');
                return true;
            }

            nuevaPantalla = parseInt(pantallaActual)+1;

            if ( indexactual >= 3 &&  indexactual == nuevaPantalla) {
                //setea y activa el indice si es mayor q 3 (a partir de la tercer pantalla y si estan igualados, es decir, cuando haces para atras lo espera hasta volver a igualarse)
                setIndex(indexactual);
            }
            
            //actualiza el indice
            indexactual = nuevaPantalla+1;

        } else if (direccion == 'back') {
            nuevaPantalla = parseInt(pantallaActual)-1;
        } else {
            console.log('error, no indica direccion');
            return true;
        }
        
        //cambia las pantallas
        setScreenFormulario( nuevaPantalla )

    });

    //se ocultan los elementos q deben estar ocultos
    $('.input-ocultos').hide();
    //al chekear estos inputs se muestras mas inputs para rellenar
    $(document).on('click', '.index-checked', function(e){
        var target = $(this).attr('data-target');
        var li = $(this).closest('li');
        var items = $(li).find(target);
        
        items.each(function(){
            $(this).show().css('opacity', '1');
        });

    });

    //al marcar que se tienen hermanos se agrega uno a la variable hnos, al deseleccionarlo se agrega 0
    $('input[name="hermanos"]').click(function(){
        if ( $('input[name="hermanos"]').prop('checked') ) {
            hermanos = 1;
        } else {
            hermanos = 0;
        }
    });

    //al seleccionar cant de hermanos se crea el html de hermanos para rellenar
    $('select[name="cuantos_hermanos"]').change(function(){
        //se busca cuantos se seleccionaron
        //se ajusta la variable hermanos
        hermanos = $(this).val();

        //si hermanos no es un numero es porque no hay nada seleccionado, se corrije eso antes de pasarlo a la funcion siguiente
        if ( isNaN(parseInt(hermanos)) ) {
            if ( $('input[name="hermanos"]').prop('checked') ) {
                hermanos = 1;
            } else {
                hermanos = 0;
            }
        }
        
        //se crea el html
        html_hermanos( hermanos );
    });

}//initFormularios()


//crea el html de los hermanos de acuerdo a su seleccion
function html_hermanos( cantidadHnos ) {
    
    //si la candidad pasada es 0 hay q ver si selecciono el checkbox como afirmativo
    if ( cantidadHnos <= 1 ) {
        return true;
    } else {
        var contenedor = $('#contenedor_hermanos');

        //primero se fija cuantos ya estan creados, esta info esta registrado en el html, por defecto es 1
        var cantCreada = $(contenedor).attr('data-cant-hermanos');
        if ( cantCreada == cantidadHnos || cantCreada > cantidadHnos ) {
            return true;
        } else {
            var html = '';
            
            //se fija cuantos crear y lo realiza mediante un loop
            var cantCrear = cantidadHnos - cantCreada;
            
            for (var i = cantCreada; i < cantidadHnos; i++) {
                var index = parseInt(i)+1;
                html += crear_html_hermano(index);
            }

            $(contenedor).append(html);
            $(contenedor).attr('data-cant-hermanos', cantidadHnos);
        }

    }
}

//esta funcion simplemente aplica un template html y le agrega el numero pasado
function crear_html_hermano(numero) {
    var html = '<div class="inputs-col"><div class="col-title">Hermanx '+numero+'</div><div class="inputs-row"><div class="form-group"><input type="text" name="hermano_apellido_'+numero+'"><label for="hermano_apellido'+numero+'">Apellido</label><span class="msj-error-input">Este campo es requerido</span></div></div><div class="inputs-row"><div class="form-group"><input type="text" name="hermano_nombre'+numero+'"><label for="hermano_nombre'+numero+'">Nombre</label><span class="msj-error-input">Este campo es requerido</span></div></div><div class="inputs-row row-flex-space-between"><div class="label-row form-group-2-only-mov">Tel.móvil:</div><div class="form-group form-group-2 form-group-3-only-mov mr-min-2"><input type="text" name="hermano_telmovil_cod'+numero+'"><label for="hermano_telmovil_cod'+numero+'">Cod.area</label><span class="msj-error-input">Requerido</span><span class="nota-aclaracion"><sup>*</sup>Sin 0</span></div><div class="form-group form-group-4-only-mov form-group-6"><input type="text" name="hermano_telmovil_numero'+numero+'"><label for="hermano_telmovil_numero'+numero+'">Número</label><span class="msj-error-input">Este campo es requerido</span><span class="nota-aclaracion"><sup>*</sup>Sin 15</span></div></div><div class="inputs-row"><div class="form-group"><input type="text" name="hermano_email'+numero+'"><label for="hermano_email_'+numero+'">Email</label><span class="msj-error-input">Este campo es requerido</span></div></div></div>';

    return html;
}

//va navegando por las pantallas del formulario
function setScreenFormulario( index ) {
    
    var contenedorPantallas = $('.pantallas-formulario');
    var pantallas = $('.pantalla');
    
    $(pantallas[index-2]).removeClass('activa');
    $(pantallas[index-1]).addClass('activa');
    $(pantallas[index]).removeClass('activa');

    //sube la pantalla
    scrollUp();
}


//carga o modifica el indice de acuerdo al index actual
function setIndex( index ) {
    var indices = $('.index-wrapper .dots li');

    //si no esta cargado lo carga y pone por defecto el
    if ( !( indices.length > 0 ) ) {
        var indiceTotal = 3
        var html = '';
        for (var i = 0; i < indiceTotal; i++) {
            
            html += '<li';
            /*if ( i == 0 ) {
                html += ' class="active active-1"';
            }*/
            html += '><span class="number-index">'+(i+1)+'</span></li>';
            
        }//for
        
        $('.index-wrapper .dots').append( $(html) );
    }

    //ahora se setea el indice
    switch (index) {
        case 3:
            var indices = $('.index-wrapper .dots li');
            $(indices[0]).addClass('active active-1');
        break;
        case 4:
            $(indices[0]).addClass('active active-2');
        break;
        case 5:
            $(indices[0]).addClass('active active-full');
            $(indices[1]).addClass('active');
        break;
        case 6:
            $(indices[1]).addClass('active-1');
        break;
        case 7:
            $(indices[1]).addClass('active-2');
        break;
        case 8:
            $(indices[1]).addClass('active-3');
        break;
        case 9:
            $(indices[1]).addClass('active-full');
            $(indices[2]).addClass('active');
        break;
    }
}//setIndex()

/*
* FUNCIONES DE LOS LABEL
*/
//función que hace zoom out a las etiquetas para escribir en los input:
function zoomOutLabel( input ) {
    var contenedor = $(input).closest('.form-group')
    var label = $(contenedor).find('label')
    $(label).addClass('on');
}
//funcion al hacer click en label
function focusInput( label ) {
    var contenedor = $(label).closest('.form-group')
    var input = $(contenedor).find('input')
    $(input).focus();
}