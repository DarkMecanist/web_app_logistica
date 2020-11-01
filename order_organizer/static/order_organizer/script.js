(function (global) {

    // Inserir HTML num selector
    function inserirtHtml(selector, html) {
        var targetElem = document.querySelector(selector);



        targetElem.innerHTML = html;
    }

    document.addEventListener("DOMContentLoaded", function (event) {
        let currently_open_modal = '';
        let currently_highlighted_part = {
            'element': '',
            'initial_color': ''
        };


        function detect_page() {
            let page_url = window.location.href;

            if (page_url.split('/')[3] === '') {
                return 'Encomendas';
            } else if (page_url.split('/')[3] === 'expedicoes') {
                return 'Expedicoes';
            } else if (page_url.split('/')[3] === 'stocks') {
                return 'Stocks';
            }

        }

        function set_event_listeners_page() {
            let page = detect_page();

            change_page_title(page);

            if (page === 'Encomendas') {
                set_event_display_hide_order_parts();
                set_elements_color_orders();
                set_event_display_select_file_modal();
                set_event_open_modal_notes_orders();
                // set_event_send_request_open_pdf_file();
                set_event_highlight_part_line();
                set_event_display_confirm_delete_modal();
                set_event_close_modal_onclick();
                set_event_detect_checkbox_selected();
                set_event_select_all_orders();
                set_event_open_technical_sheet_part();

                replace_string_numbers();
                calculate_num_total_orders();

            } else if (page === 'Expedicoes') {
                set_event_display_hide_order_parts();
                set_elements_color_shippings();
                set_event_open_modal_notes_shippings();
                set_event_highlight_part_line();
                set_event_close_modal_onclick();
                set_event_select_all_orders();
                set_event_display_confirm_delete_shippings_modal();
                set_event_send_request_delete_selected_shippings();
                set_event_generate_shippings_doc_list();
                set_event_open_technical_sheet_part();

                replace_string_numbers();
                calculate_num_total_orders();

            } else if (page === 'Stocks') {
                set_event_highlight_part_line();
                set_event_select_all_orders();
                set_event_display_confirm_delete_parts_modal();
                set_event_close_modal_onclick();
                set_event_send_request_delete_selected_parts();
                set_color_part_technical_PDF();
                set_event_generate_doc_list();

                calculate_num_total_parts();
            }
        }

        function change_page_title(page) {
            document.title = 'Logística Prilux - ' + page
        }

        // ORDERS PAGE BLOCK //

        function handle_response(response) {
            console.log(response);
        }

        function display_hide_order_parts() {
            if (this.textContent === '+') {
                this.parentElement.nextElementSibling.style.display = 'block';
                this.parentElement.parentElement.style.height = 'auto';
                this.textContent = '-';
            } else {
                this.parentElement.nextElementSibling.style.display = 'none';
                this.parentElement.parentElement.style.height = '85px';
                this.textContent = '+';
            }

        }

        function set_event_display_hide_order_parts() {

            //Botões mostrar/esconder artigos encomenda
            let display_hide_buttons = document.querySelectorAll('.botao-encomenda');
            let order_elements = document.querySelectorAll('.encomenda');

            for (let i = 0; i < display_hide_buttons.length; i++) {
                display_hide_buttons[i].addEventListener('click', display_hide_order_parts);
            }

            // for (let i = 0; i < order_elements.length; i++) {
            //     order_elements[i].addEventListener('dblclick', function () {
            //         display_hide_order_parts();
            //     })
            // }

        }

        function display_modal(modal_id=null, modal_element=null) {
            if (modal_element === null) {
                currently_open_modal = document.getElementById(modal_id);
            } else {
                console.log(modal_element);
                currently_open_modal = modal_element;
            }

            console.log(currently_open_modal);

            document.addEventListener('keydown', close_modal_by_esc_press);

            currently_open_modal.style.display = 'block';
        }

        function close_modal(){
            document.removeEventListener('keydown', close_modal_by_esc_press);

            currently_open_modal.style.display = 'none';

            if (this.parentElement.id === 'conteudo-modal-url-etiquetas') {
                this.previousElementSibling.innerHTML = '<img src="/static/order_organizer/ajax-loader.gif" alt="loading...">';
                this.previousElementSibling.previousElementSibling.innerHTML = 'Aguarde...<p>Em caso de encomendas com muitos artigos, poderá demorar alguns minutos</p>';
            }
        }

        function close_modal_by_esc_press(event) {
            const keyName = event.key;
            console.log(keyName);
            if (keyName === 'Escape') {
                close_modal()
            }
        }

        function set_elements_color_orders() {

            //Completion checks
            //Order general info
            let percent_complete_elements = document.querySelectorAll('.percentagem-completa');

            for (let i=0; i<percent_complete_elements.length; i++) {
                if (percent_complete_elements[i].innerText === '100% Finalizado') {
                    percent_complete_elements[i].style.color = '#9ACD32';
                    percent_complete_elements[i].previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.style.color = '#9ACD32';
                } else {
                    percent_complete_elements[i].style.color = '#FAFAFA';
                    percent_complete_elements[i].previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.style.color = '#FAFAFA';
                }
            }

            // Notes and PDF file checks
            let buttons_notes = document.querySelectorAll('.botao-notas');

            for (let i=0; i<buttons_notes.length; i++) {
                if (buttons_notes[i].nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.innerText === '' ||
                    buttons_notes[i].nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.innerText === 'N/A') {
                    buttons_notes[i].style.backgroundColor = '#FAFAFA';
                } else {
                    buttons_notes[i].style.backgroundColor = '#9ACD32';

                    buttons_notes[i].setAttribute('data-tooltip', buttons_notes[i].nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.innerText);
                    buttons_notes[i].setAttribute('data-tooltip-position', 'bottom');

                }
            }

            let buttons_pdf = document.querySelectorAll('.botao-abrir-pdf');

            for (let i=0; i<buttons_pdf.length; i++) {
                    if (buttons_pdf[i].id === '') {
                        buttons_pdf[i].style.backgroundColor = '#FAFAFA';
                    } else {
                        buttons_pdf[i].style.backgroundColor = '#9ACD32';
                    }
                }


            // Due Date
            let due_date_elements = document.querySelectorAll('.data-entrega');

            let current_date = new Date();

            for (let i=0; i<due_date_elements.length; i++) {
                let due_date_string = due_date_elements[i].firstElementChild.innerText;
                let due_date_month = Number(due_date_string.split('-')[1]) - 1;

                let due_date = new Date(due_date_string.split('-')[2], due_date_month, due_date_string.split('-')[0]);

                let day_difference = get_date_difference_days(due_date, current_date);

                let warning_message = get_warning_message_day_difference(day_difference);

                if (day_difference === 0 || day_difference === 1 || day_difference < 0 ) {
                    due_date_elements[i].style.color = '#FF4C4C';
                } else if (day_difference > 1 && day_difference < 4) {
                    due_date_elements[i].style.color = '#FFA500';
                } else {
                    due_date_elements[i].style.color = '#FAFAFA';
                }

                due_date_elements[i].setAttribute('data-tooltip', warning_message);

            }


            //OrderParts

            let parts_container_elements = document.querySelectorAll('.container-artigos');

            for (let i=0; i<parts_container_elements.length; i++) {
                for (let j=0; j<parts_container_elements[i].childNodes.length; j++) {
                    if (parts_container_elements[i].childNodes[j].tagName === 'DIV') {
                        if (parts_container_elements[i].childNodes[j].classList.contains('artigo')) {
                            let part_info = parts_container_elements[i].childNodes[j].childNodes;

                            for (let k=0; k<part_info.length; k++) {
                                if (part_info[k].tagName === 'DIV') {
                                     if (part_info[k].classList.contains('quantidade-encomenda')) {
                                        var part_qtty = Number(part_info[k].innerText);

                                     } if (part_info[k].classList.contains('quantidade-a-expedir')) {
                                        var part_ready_qtty = Number(part_info[k].innerText);
                                    }

                                    if (part_ready_qtty >= part_qtty) {
                                        parts_container_elements[i].childNodes[j].style.backgroundColor = '#9ACD32';
                                    } else {
                                        parts_container_elements[i].childNodes[j].style.backgroundColor = '#FAFAFA';
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }

        function get_date_difference_days(due_date, current_date) {
            let timedelta = due_date - current_date;

            return Math.ceil((timedelta * (2.77777778 * Math.pow(10, -7)) / 24));
        }

        function get_warning_message_day_difference(day_difference) {

            if (day_difference > 0) {
                    return 'Entrega daqui a ' + day_difference + ' dias';
                } else if (day_difference === 0) {
                    return 'Entrega hoje';
                } else {
                    return 'Entrega atrasada ' + Math.abs(day_difference) + ' dias';
                }
        }

        function set_event_display_select_file_modal() {
            document.querySelector('#botao-nova-encomenda-PDF').addEventListener('click', function () {
                display_modal('modal-selecionar-ficheiro');
            });
        }

        function set_event_open_modal_notes_orders() {
            let buttons_notes = document.querySelectorAll('.botao-notas');

            for (let i=0; i<buttons_notes.length; i++) {
                buttons_notes[i].addEventListener('click', function () {
                    display_modal(modal_id=null, modal_element=buttons_notes[i].nextElementSibling.nextElementSibling);
                })
            }
        }

        // function send_request_open_pdf_file(){
        //     // let order_major_info = this.parentElement.previousElementSibling;
        //     // console.log(order_major_info.parentElement.id);
        //     // // let client = order_major_info.firstElementChild.nextElementSibling.innerText;
        //     // let order = order_major_info.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
        //
        //     let data = {
        //         'open-pdf': true,
        //         'order_id': this.parentElement.parentElement.id,
        //     };
        //
        //     $ajaxUtils.sendPostRequest(data, '');
        // }
        //
        // function set_event_send_request_open_pdf_file() {
        //     let buttons_open_pdf = document.querySelectorAll('.botao-abrir-pdf');
        //
        //     for (let i=0; i<buttons_open_pdf.length; i++) {
        //         buttons_open_pdf[i].addEventListener('click', send_request_open_pdf_file)
        //     }
        // }

        function highlight_part_line() {
            let previously_highlighted_part = currently_highlighted_part;

            if (previously_highlighted_part['element'] !== '') {
                previously_highlighted_part['element'].style.backgroundColor = previously_highlighted_part['initial_color'];
            }

            currently_highlighted_part['element'] = this;
            currently_highlighted_part['initial_color'] = this.style.backgroundColor;

            this.style.backgroundColor = '#E0E0FF';
        }

        function set_event_highlight_part_line() {
            let part_lines = document.querySelectorAll('.artigo');

            for (let i=0; i<part_lines.length; i++) {
                part_lines[i].addEventListener('click', highlight_part_line);
            }
        }

        function replace_string_numbers(){
            let pending_qtty_elements = document.querySelectorAll('.quantidade-encomenda');
            let ready_qtty_elements = document.querySelectorAll('.quantidade-a-expedir');
            let stock_qtty_elements = document.querySelectorAll('.quantidade-stock');

            for (let i=0; i<pending_qtty_elements.length; i++) {
                pending_qtty_elements[i].innerText = Number(pending_qtty_elements[i].innerText);
            }

             for (let i=0; i<ready_qtty_elements.length; i++) {
                ready_qtty_elements[i].innerText = Number(ready_qtty_elements[i].innerText);
            }

            for (let i=0; i<stock_qtty_elements.length; i++) {
                stock_qtty_elements[i].innerText = Number(stock_qtty_elements[i].innerText);
            }
        }

        function set_event_display_confirm_delete_modal() {
            document.querySelector('#botao-apagar-encomenda').addEventListener('click', function () {
                check_elements_selected(display_modal, 'modal-confirmar-apagar');
                // display_modal('modal-confirmar-apagar');
            });
        }

        function set_event_close_modal_onclick() {
            let cancel_buttons = document.querySelectorAll('.botao-fechar-modal');

            for (let i=0; i<cancel_buttons.length; i++) {
                cancel_buttons[i].addEventListener('click', close_modal);
            }
        }

        function return_array_id_selected_orders() {
            let id_selected_orders = [];
            let checkboxes = document.querySelectorAll('.checkbox');

            for (let i=0; i<checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    let order_id = checkboxes[i].parentElement.parentElement.id;

                    id_selected_orders.push(order_id)
                }
            }

            return id_selected_orders
        }

        function gather_info_orders_selected(output) {
            let id_selected_orders = return_array_id_selected_orders();

            let ids_string = id_selected_orders.join(',');

            let data = {
                'output': output,
                'id_selected_orders': ids_string,
            };

            if (data['output'] === 'tags') {
                console.log('sending tags request');
                display_modal('modal-url-etiquetas');
                $ajaxUtils.sendPostRequest(data, '', handle_response_post_tags, false);
            } else if (data['output'] === 'lists') {
                console.log('sending lists request');
                display_modal('modal-url-etiquetas');
                $ajaxUtils.sendPostRequest(data, '', handle_response_post_lists, false);
            } else {
                $ajaxUtils.sendPostRequest(data, '', handle_response_redirect, false);
            }
        }

        function set_event_detect_checkbox_selected() {
            document.querySelector('#botao-imprimir-etiquetas').addEventListener('click', function () {
                check_elements_selected(gather_info_orders_selected, 'tags');
                // gather_info_orders_selected('tags')
            });

            document.querySelector('#botao-imprimir-listagem-encomendas').addEventListener('click', function () {
                check_elements_selected(gather_info_orders_selected, 'lists');
                // gather_info_orders_selected('lists');
            });

            document.querySelector('#botao-confirmar-apagar').addEventListener('click', function() {
                check_elements_selected(gather_info_orders_selected, 'delete');
                // gather_info_orders_selected('delete')
            })
        }

        function select_all_orders() {
            let checkbox_elements = document.querySelectorAll('.checkbox-encomenda');

            if (this.name ==="not-selected") {
                this.setAttribute('name', 'selected');
                this.style.backgroundColor = '#424242';

                for (let i=0; i<checkbox_elements.length; i++) {
                    checkbox_elements[i].checked = true;
                }
            } else {
                this.setAttribute('name', 'not-selected');
                this.style.backgroundColor = '#FAFAFA';

                for (let i=0; i<checkbox_elements.length; i++) {
                    checkbox_elements[i].checked = false;
                }
            }
        }

        function set_event_select_all_orders() {
            document.querySelector('#checkbox-selecionar-todas-encomendas').addEventListener('click', select_all_orders);
        }

        function handle_response_post_tags(response) {
            console.log('RECEIVED RESPONSE FROM SERVER:');
            console.log(response['status']);
            if (response['status'] === 'finished') {
                document.querySelector('#info-status-etiquetas').innerText = 'Pronto';
                document.querySelector('#status-etiquetas').innerHTML = '<a href=https://web-app-logistica-prilux.s3.us-east-2.amazonaws.com/Etiquetas_Produ%C3%A7%C3%A3o.docx>Download</a>'
            } else {
                console.log('SENDING A PING REQUEST');
                let data = {
                    'output': 'check_response_ready',
                };
                setTimeout(function() {
                    $ajaxUtils.sendPostRequest(data, '', handle_response_post_tags, false);
                }, 5000);

            }
        }

        function handle_response_post_lists(response) {
            console.log('RECEIVED RESPONSE FROM SERVER:');
            console.log(response['status']);
            if (response['status'] === 'finished') {
                document.querySelector('#info-status-etiquetas').innerText = 'Pronto';
                document.querySelector('#status-etiquetas').innerHTML = '<a href=https://web-app-logistica-prilux.s3.us-east-2.amazonaws.com/Listagem.docx>Download</a>'
            } else {
                console.log('SENDING A PING REQUEST');
                let data = {
                    'output': 'check_response_ready',
                };
                setTimeout(function() {
                    $ajaxUtils.sendPostRequest(data, '', handle_response_post_lists, false);
                }, 5000);
            }
        }

        function calculate_num_total_orders(){
            let order_elements = document.querySelectorAll('.encomenda');
            document.querySelector('#num-val').innerText = order_elements.length;
        }

        function send_request_technical_sheet() {
            let data = {
                'part_ref': this.previousElementSibling.previousElementSibling.innerText,
                'part_name': this.previousElementSibling.innerText,
                'output': 'technical_sheet_url'};

            console.log(data);

            $ajaxUtils.sendPostRequest(data, '/stocks/', handle_response_request_technical_sheet, false)
        }

        function handle_response_request_technical_sheet(response) {
            if (response['technical_sheet_url'] !== '') {
                window.open("https://web-app-logistica-prilux.s3.us-east-2.amazonaws.com/" + response['technical_sheet_url'], "_blank");
            } else {
                window.alert('Não existe ficha técnica associada a este artigo')
            }
        }

        function set_event_open_technical_sheet_part() {
            let technical_sheet_buttons = document.querySelectorAll('.botao-ficha-tecnica-artigo');

            for (let i=0; i<technical_sheet_buttons.length; i++) {
                technical_sheet_buttons[i].addEventListener('click', send_request_technical_sheet)
            }
        }


        // SHIPPINGS PAGE BLOCK //

        function set_elements_color_shippings() {
            let buttons_notes = document.querySelectorAll('.botao-notas');

            for (let i=0; i<buttons_notes.length; i++) {
                if (buttons_notes[i].nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.innerText === '' ||
                    buttons_notes[i].nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.innerText === 'N/A') {
                    buttons_notes[i].style.backgroundColor = '#FAFAFA';
                } else {
                    buttons_notes[i].style.backgroundColor = '#9ACD32';

                    buttons_notes[i].setAttribute('data-tooltip', buttons_notes[i].nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.innerText);
                    buttons_notes[i].setAttribute('data-tooltip-position', 'bottom');

                }
            }
        }

        function return_array_id_selected_shippings() {
            let id_selected_shippings = [];
            let checkboxes = document.querySelectorAll('.checkbox');

            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    let shipping_id = checkboxes[i].parentElement.parentElement.id;

                    id_selected_shippings.push(shipping_id)
                }
            }

            return id_selected_shippings
        }

        function gather_info_shippings_selected(output) {
            let id_selected_shippings = return_array_id_selected_shippings();

            console.log('SELECTED SHIPPINGS IDS = ' + id_selected_shippings);

            if (id_selected_shippings.length === 0) {
                window.alert('Nenhuma expedição selecionada')
            } else {
                let ids_string = id_selected_shippings.join(',');

            let data = {
                'output': output,
                'id_selected_shippings': ids_string
            };

            if (data['output'] === 'list')  {
                console.log('sending shipping lists request');
                display_modal('modal-url-etiquetas');
                $ajaxUtils.sendPostRequest(data, '/expedicoes/', handle_response_shippings_list, false)
            } else {
                $ajaxUtils.sendPostRequest(data, '/expedicoes/', handle_response_redirect, false);
            }
            }
        }

        function handle_response_shippings_list(response) {
            console.log('RECEIVED RESPONSE FROM SERVER:');
            console.log(response['status']);
            if (response['status'] === 'finished') {
                document.querySelector('#info-status-etiquetas').innerText = 'Pronto';
                document.querySelector('#status-etiquetas').innerHTML = '<a href=https://web-app-logistica-prilux.s3.us-east-2.amazonaws.com/Listagem_Artigos.docx>Download</a>'
            } else {
                console.log('SENDING A PING REQUEST');
                let data = {
                    'output': 'check_response_ready',
                };
                setTimeout(function() {
                    $ajaxUtils.sendPostRequest(data, '/stocks/', handle_response_parts_list, false);
                }, 5000);
            }
        }

        function set_event_display_confirm_delete_shippings_modal() {
            document.querySelector('#botao-apagar-expedicao').addEventListener('click', function () {
                check_elements_selected(display_modal, 'modal-confirmar-apagar-expedicao');
                // display_modal('modal-confirmar-apagar-expedicao')
            })
        }

        function set_event_send_request_delete_selected_shippings() {
            document.querySelector('#botao-confirmar-apagar-expedicao').addEventListener('click', function() {
                gather_info_shippings_selected('delete')
            })
        }

        function set_event_generate_shippings_doc_list() {
            document.querySelector('#botao-imprimir-listagem-expedicoes').addEventListener('click', function () {
                check_elements_selected(gather_info_shippings_selected, 'list');
                // gather_info_shippings_selected('list');
            })
        }

        function handle_response_shippings_list(response) {
            if (response['status'] === 'finished') {
                document.querySelector('#info-status-etiquetas').innerText = 'Pronto';
                document.querySelector('#status-etiquetas').innerHTML = '<a href=https://web-app-logistica-prilux.s3.us-east-2.amazonaws.com/Listagem_Expedicoes.docx>Download</a>'
            } else {
                let data = {
                    'output': 'check_response_ready',
                };
                setTimeout(function () {
                    $ajaxUtils.sendPostRequest(data, '/expedicoes/', handle_response_shippings_list, false);
                }, 5000);
            }
        }

        function set_event_open_modal_notes_shippings() {
            let buttons_notes = document.querySelectorAll('.botao-notas');

            for (let i=0; i<buttons_notes.length; i++) {
                buttons_notes[i].addEventListener('click', function () {
                    display_modal(modal_id=null, modal_element=buttons_notes[i].nextElementSibling.nextElementSibling.nextElementSibling);
                })
            }
        }

        // STOCKS PAGE BLOCK //

        function set_color_part_technical_PDF(){
            let buttons_technical_PDF = document.querySelectorAll('.botao-ficha-tecnica-artigo');

            for (let i=0; i<buttons_technical_PDF.length; i++) {
                if (buttons_technical_PDF[i].id === '') {
                    buttons_technical_PDF[i].style.backgroundColor = '#424242';
                } else {
                    buttons_technical_PDF[i].style.backgroundColor = '#9ACD32';
                }
            }
        }

        function return_array_id_selected_parts() {
            let id_selected_parts = [];
            let checkboxes = document.querySelectorAll('.checkbox');

            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    let part_id = checkboxes[i].parentElement.id;

                    id_selected_parts.push(part_id)
                }
            }

            return id_selected_parts
        }

        function gather_info_parts_selected(output) {
            let id_selected_parts = return_array_id_selected_parts();

            if (id_selected_parts.length === 0) {
                window.alert('Nenhum artigo selecionado')
            } else {
                let ids_string = id_selected_parts.join(',');

            let data = {
                'output': output,
                'id_selected_parts': ids_string
            };

            if (data['output'] === 'list')  {
                console.log('sending parts lists request');
                display_modal('modal-url-etiquetas');
                $ajaxUtils.sendPostRequest(data, '/stocks/', handle_response_parts_list, false)
            } else {
                $ajaxUtils.sendPostRequest(data, '/stocks/', handle_response_redirect, false);
            }
            }
        }

        function set_event_send_request_delete_selected_parts() {
            document.querySelector('#botao-confirmar-apagar-artigo').addEventListener('click', function() {
                gather_info_parts_selected('delete')
            })
        }

        function set_event_display_confirm_delete_parts_modal() {
            document.querySelector('#botao-apagar-artigo').addEventListener('click', function () {
                check_elements_selected(display_modal, 'modal-confirmar-apagar-artigos');
                // display_modal('modal-confirmar-apagar-artigos')
            })
        }

        function calculate_num_total_parts(){
            let order_elements = document.querySelectorAll('.artigo');
            document.querySelector('#num-val').innerText = order_elements.length;
        }

        function handle_response_parts_list(response) {
            console.log('RECEIVED RESPONSE FROM SERVER:');
            console.log(response['status']);
            if (response['status'] === 'finished') {
                document.querySelector('#info-status-etiquetas').innerText = 'Pronto';
                document.querySelector('#status-etiquetas').innerHTML = '<a href=https://web-app-logistica-prilux.s3.us-east-2.amazonaws.com/Listagem_Artigos.docx>Download</a>'
            } else {
                console.log('SENDING A PING REQUEST');
                let data = {
                    'output': 'check_response_ready',
                };
                setTimeout(function() {
                    $ajaxUtils.sendPostRequest(data, '/stocks/', handle_response_parts_list, false);
                }, 5000);
            }
        }

        function set_event_generate_doc_list() {
            document.querySelector('#botao-imprimir-listagem-artigos').addEventListener('click', function () {
                check_elements_selected(gather_info_parts_selected, 'list');
                // gather_info_parts_selected('list');
            })
        }


        // GENERAL //

        function set_padding_top_main_content() {
            let main_content_element = document.querySelector('#main-content');
            let current_page = detect_page();

            if (current_page === 'Encomendas' || current_page === 'Expedicoes') {
                main_content_element.style.paddingTop = '5px';
            } else {
                main_content_element.style.paddingTop = '0';
            }
        }

        function handle_response_redirect(response) {
                let redirect_location = response['redirect'];

                if (redirect_location !== undefined) {
                    let base_url = window.location.href.split('/')[0];
                    window.location.href = base_url + redirect_location
                }
        }

        function set_position_modal_buttons() {
            let close_buttons = document.querySelectorAll('.botao-fechar-modal');
            // let continue_buttons = document.querySelector('#botao-confirmar-apagar');

            for (let i=0; i<close_buttons.length; i++) {
                if (close_buttons[i].innerText === 'Cancelar') {
                    close_buttons[i].style.cssText = 'margin: 10px auto; display: inline';
                }
            }
        }

        function check_elements_selected(func, args) {
            let checkbox_elements = document.querySelectorAll('.checkbox-encomenda');
            let some_selected = false;

            for (let i=0; i<checkbox_elements.length; i++) {
                if (checkbox_elements[i].checked) {
                    some_selected = true;
                }
            }
            if (some_selected) {
                func(args);
            } else {
                alert('Nenhum elemento selecionado');
            }
        }

        function set_event_open_menu_demo() {
            document.querySelector('#demo-menu').addEventListener('click', function () {
                display_modal('modal-menu-demo');
            })
        }

        function set_event_open_confirm_reset_db_modal() {
            document.querySelector('#botao-reset-db').addEventListener('click', function () {
                display_modal('modal-confirmar-reset-db');
            })
        }

        function set_event_send_request_reset_db () {
            document.querySelector('#botao-confirmar-reset-db').addEventListener('click', function () {
                let modal_content_element = document.querySelector('#conteudo-confirmar-reset-db');
                modal_content_element.firstElementChild.innerText = 'Aguarde alguns segundos...';
                modal_content_element.firstElementChild.nextElementSibling.innerHTML = '<img src="/static/order_organizer/ajax-loader.gif" alt="loading...">';


                let data = { 'reset_db': true };
                $ajaxUtils.sendPostRequest(data, '', handle_response_redirect, false)
            });
        }

        set_event_listeners_page();
        set_padding_top_main_content();
        set_position_modal_buttons();
        set_event_open_menu_demo();
        set_event_open_confirm_reset_db_modal();
        set_event_send_request_reset_db();
    });
})(window);