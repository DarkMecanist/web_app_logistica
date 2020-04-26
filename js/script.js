
(function (global) {

    // Inserir HTML num selector
    function inserirtHtml(selector, html) {
        var targetElem = document.querySelector(selector);



        targetElem.innerHTML = html;
    }

    // Mostrar loading gif no elemento identificado pelo selector.
    function mostrarLoading(selector) {
        var html = "<div class='imagem-loading'>";
        html += "<img src='imagens/ajax-loader.gif' alt='loading...'></div>";
        inserirtHtml(selector, html);
    }

    document.addEventListener("DOMContentLoaded", function (event) {

        var encomendasHtml = "snippets/encomendas-snippet.html";
        var expedicoesHtml = "snippets/expedicoes-snippet.html";
        var stocksHtml = "snippets/stocks-snippet.html";

        //Botões Selecção Menu
        let menu_selecionado = 'encomendas';

        function atribuir_funcionalidade_botoes_menu() {

            let lista_botoes_menu = document.querySelectorAll('.botao-menu');

            for (let i = 0; i < lista_botoes_menu.length; i++) {
                if (lista_botoes_menu[i].id === 'botao-menu-encomendas'){
                    lista_botoes_menu[i].onclick = function () {
                        mudar_pagina_principal('encomendas')
                    }

                } else if (lista_botoes_menu[i].id === 'botao-menu-expedicoes'){
                    lista_botoes_menu[i].onclick = function () {
                        mudar_pagina_principal('expedicoes')
                    }
                } else if (lista_botoes_menu[i].id === 'botao-menu-stocks'){
                    lista_botoes_menu[i].onclick = function () {
                        mudar_pagina_principal('stocks')
                    }
                }
            }
        }

        function definir_estilo_botoes_menu() {

            let estilo_selecionado = 'background-color: #FAFAFA; color: #424242;';
            let estilo_nao_selecionado = 'background-color: #424242; color: #FAFAFA;';
            // let estilo_hover = 'font-weight:bold; transition:0.5s';

            let lista_botoes_menu = document.querySelectorAll('.botao-menu');

            for (let i = 0; i < lista_botoes_menu.length; i++) {
                if (menu_selecionado === 'encomendas') {
                    if (lista_botoes_menu[i].id === 'botao-menu-encomendas') {
                        lista_botoes_menu[i].style.cssText = estilo_selecionado;
                        lista_botoes_menu[i].onmouseenter = function () {};
                        lista_botoes_menu[i].onmouseout = function () {};

                    } else {
                        lista_botoes_menu[i].style.cssText = estilo_nao_selecionado;
                        lista_botoes_menu[i].onmouseenter = function () {
                            lista_botoes_menu[i].style.cssText = estilo_selecionado;
                        };
                        lista_botoes_menu[i].onmouseout = function () {
                            lista_botoes_menu[i].style.cssText = estilo_nao_selecionado;
                        };
                    }
                } else if (menu_selecionado === 'expedicoes') {
                    if (lista_botoes_menu[i].id === 'botao-menu-expedicoes') {
                        lista_botoes_menu[i].style.cssText = estilo_selecionado;
                        lista_botoes_menu[i].onmouseenter = function () {};
                        lista_botoes_menu[i].onmouseout = function () {};
                    } else {
                        lista_botoes_menu[i].style.cssText = estilo_nao_selecionado;
                        lista_botoes_menu[i].onmouseenter = function () {
                            lista_botoes_menu[i].style.cssText = estilo_selecionado;
                        };
                        lista_botoes_menu[i].onmouseout = function () {
                            lista_botoes_menu[i].style.cssText = estilo_nao_selecionado;
                        };
                    }
                } else if (menu_selecionado === 'stocks') {
                    if (lista_botoes_menu[i].id === 'botao-menu-stocks') {
                        lista_botoes_menu[i].style.cssText = estilo_selecionado;
                        lista_botoes_menu[i].onmouseenter = function () {};
                        lista_botoes_menu[i].onmouseout = function () {};
                    } else {
                        lista_botoes_menu[i].style.cssText = estilo_nao_selecionado;
                        lista_botoes_menu[i].onmouseenter = function () {
                            lista_botoes_menu[i].style.cssText = estilo_selecionado;
                        };
                        lista_botoes_menu[i].onmouseout = function () {
                            lista_botoes_menu[i].style.cssText = estilo_nao_selecionado;
                        };
                    }
                }
            }

        }

        function mudar_pagina_principal(pagina){

            mostrarLoading('#main-content');

            let pagina_anterior = menu_selecionado;

            if (pagina_anterior !== pagina){
                remover_event_handlers(pagina_anterior)
            }

            if (pagina === 'encomendas'){
                $ajaxUtils.sendGetRequest(encomendasHtml, function (responseText) {
                    inserirtHtml("#main-content", responseText);
                }, false, false);

                menu_selecionado = 'encomendas';

            } else if (pagina === 'expedicoes') {
                $ajaxUtils.sendGetRequest(expedicoesHtml, function (responseText) {
                    inserirtHtml("#main-content", responseText)
                }, false, false);

                menu_selecionado = 'expedicoes';

            } else if (pagina === 'stocks') {
                $ajaxUtils.sendGetRequest(stocksHtml, function (responseText) {
                    inserirtHtml("#main-content", responseText)
                }, false, false);

                menu_selecionado = 'stocks';
            }

            definir_estilo_botoes_menu();
            aplicar_event_handlers();
        }

        function aplicar_event_handlers() {
            if (menu_selecionado === 'encomendas'){
                let lista_campos_editaveis_encomenda = document.querySelectorAll('.valor-campo-encomenda');

                for (let i = 0; i < lista_campos_editaveis_encomenda.length; i++) {
                    lista_campos_editaveis_encomenda[i].ondblclick = abrir_modal_box_encomenda;
                }
            } else if (menu_selecionado === 'expedicoes') {

            } else if (menu_selecionado === 'stocks'){

            }
        }

        function remover_event_handlers(pagina_anterior) {
            if (pagina_anterior === 'encomendas'){

            } else if (pagina_anterior === 'expedicoes') {

            } else if (pagina_anterior === 'stocks'){

            }
        }


        //Encomendas
        function abrir_modal_box_encomenda() {
            let modal_editar = document.querySelector('#modal-editar');
            let conteudo_modal_editar = document.querySelector('#conteudo-modal-editar');
            let mensagem_modal_editar = document.querySelector('#mensagem-modal-editar');
            let input_texto_modal = document.querySelector('#input-texto-modal-editar');
            let botao_aceitar_modal_editar = document.querySelector('#botao-aceitar-modal-editar');
            let botao_cancelar_modal_editar = document.querySelector('#botao-cancelar-modal-editar');

            let campo_a_editar = detetar_campo_editavel(this);
            let elemento_a_editar = this;

            //Alterar a mensagem personalizada
            if (campo_a_editar === 'nome-cliente'){
                mensagem_modal_editar.innerHTML = 'Alterar nome cliente';
            } else if (campo_a_editar === 'num-encomenda-interna' || campo_a_editar === 'num-encomenda-alt') {
                mensagem_modal_editar.innerHTML = 'Alterar nº ' + this.parentElement.innerHTML.split(':')[0];
            } else if (campo_a_editar === 'data-entrega') {
                mensagem_modal_editar.innerHTML = 'Alterar data de entrega';
            }

            //Preencher automaticamente a text-box
            input_texto_modal.value = this.innerHTML;

            //Atribuir funcionalidade aos botões
            botao_aceitar_modal_editar.onclick = function () {
                editar_campo_encomenda(elemento_a_editar, modal_editar)
            };

            botao_cancelar_modal_editar.onclick = function () {
                fechar_modal_box(modal_editar)
            };

            //Ativar a visualização da modal box
            modal_editar.style.display = 'block';
            input_texto_modal.focus();
            input_texto_modal.select();
        }

        function fechar_modal_box(modal_box) {
            modal_box.style.display = 'none';
        }

        function detetar_campo_editavel(campo) {
            let lista_classes = campo.classList;

            if (lista_classes.length === 2) {
                return 'nome-cliente'
            } else {
                return campo.parentElement.className;
            }
        }

        function editar_campo_encomenda(elemento_a_editar, modal_box) {
            elemento_a_editar.innerHTML = document.querySelector('#input-texto-modal-editar').value;

            gravar_alteracoes_pagina_html(encomendasHtml);

            fechar_modal_box(modal_box);
        }

        function gravar_alteracoes_pagina_html(pagina) {
           encomendasHtml = document.querySelector('#main-content').innerHTML;
        //   TODO Aprender como trabalhar com base de dados, de outro modo o conteudo não dará para gravar

        }


        //Executar quando a página arranca pela primeira vez
        atribuir_funcionalidade_botoes_menu();
        mudar_pagina_principal('encomendas');
    });
})(window);

