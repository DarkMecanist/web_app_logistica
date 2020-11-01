(function (global) {
    document.addEventListener("DOMContentLoaded", function (event) {
        let currently_open_modal = '';
        let deleted_parts = false;

        function overhaul_default_text() {
            let datetime_ti = document.querySelector('#id_due_date');
            let notes_ti = document.querySelector('#id_notes');
            let associated_doc_ti = document.querySelector('#id_associated_doc_type');
            let order_num_associated_doc_ti = document.querySelector('#id_order_num_associated_doc');

            let date = datetime_ti.value.split(' ')[0];

            let day = date.split('-')[2];
            let month = date.split('-')[1];
            let year = date.split('-')[0];

            datetime_ti.value = day + '/' + month + '/' + year;

            if (notes_ti.value === 'N/A') {
                notes_ti.value = '';
            }

            if (associated_doc_ti.value === 'N/A') {
                associated_doc_ti.value = '';
            }

            if (order_num_associated_doc_ti.value === 'N/A') {
                order_num_associated_doc_ti.value = '';
            }


        }

        function select_doc_type() {
            this.parentElement.nextElementSibling.firstElementChild.value = this.innerText;
        }

        function set_event_select_doc_type() {
            let targets = document.querySelectorAll('.select_doc_type');

            for (let i=0; i<targets.length; i++){
                targets[i].addEventListener('click', select_doc_type);
            }
        }

        function dropdown_select() {
            this.parentElement.previousElementSibling.textContent = this.textContent;
        }

        function set_event_dropdown_select() {
            let dropdown_containers_list = document.querySelectorAll('.dropdown-unit');

            for (let i = 0; i < dropdown_containers_list.length; i++) {
                let options_list = dropdown_containers_list[i].children;

                for (let i = 0; i < options_list.length; i++) {
                    options_list[i].addEventListener('click', dropdown_select);
                }
            }
        }

        function dropdown_unit_expand() {
            this.nextElementSibling.classList.toggle("show");
        }

        function set_event_dropdown_unit_expand() {
            let dropdown_button_list = document.querySelectorAll('.dropbtn-unit');

            for (let i = 0; i < dropdown_button_list.length; i++) {
                dropdown_button_list[i].addEventListener('click', dropdown_unit_expand)
            }
        }

        function set_event_close_dropdown_on_outside_click() {
            window.addEventListener('click', function (event) {
                if (!event.target.matches('.dropbtn')) {
                    var dropdowns = document.getElementsByClassName("dropdown-content");
                    var i;
                    for (i = 0; i < dropdowns.length; i++) {
                        var openDropdown = dropdowns[i];
                        if (openDropdown.classList.contains('show')) {
                            openDropdown.classList.remove('show');
                        }
                    }
                }
            })
        }

        function add_new_part_line() {
            let target = document.getElementById('container-artigos-nova-encomenda');
            let part = document.querySelector('.artigo-nova-encomenda').cloneNode(true);

            let part_html = '<div class="artigo artigo-nova-encomenda">\n' +
                '                <a class="botao botao-apagar-artigo">x</a>\n' +
                '                <input class="informacao-artigo armazem" type="text">\n' +
                '                <input class="informacao-artigo codigo" type="text">\n' +
                '                <input class="informacao-artigo nome" type="text">\n' +
                '\n' +
                '                <input class="informacao-artigo material" type="text">\n' +
                '                <div class="informacao-artigo unidade-quantidade select2-dropdown">\n' +
                '                    <a class="dropbtn" id="dropbtn-unit">Unid.</a>\n' +
                '                        <div class="dropdown-content" id="dropdown-unit">\n' +
                '                            <a>UN.</a>\n' +
                '                            <a>MT.</a>\n' +
                '                            <a>KG.</a>\n' +
                '                        </div>\n' +
                '                </div>\n' +
                '                <input class="informacao-artigo quantidade-encomenda" type="text">\n' +
                '            </div>';

            // target.innerHTML += part_html;
            target.appendChild(part);

            set_event_remove_new_part_line();
            set_event_dropdown_unit_expand();
            set_event_dropdown_select();
        }

        function set_event_add_new_part_line() {
            document.querySelector('#botao-adicionar-artigo').addEventListener('click', add_new_part_line);
        }

        function remove_new_part_line() {
            if (document.querySelectorAll('.artigo-nova-encomenda').length > 1) {
                this.parentElement.remove();
                deleted_parts = true;
            }
        }

        function set_event_remove_new_part_line() {
            let remove_buttons = document.querySelectorAll('.botao-apagar-artigo');

            for (let i = 0; i < remove_buttons.length; i++) {
                remove_buttons[i].addEventListener('click', remove_new_part_line)
            }
        }

        function return_parts_list() {
            let parts_list = [];
            let parts = document.querySelectorAll('.artigo-nova-encomenda');

            for (let i = 0; i < parts.length; i++) {
                let part_info = parts[i].children;

                for (let j = 0; j < part_info.length; j++) {
                    if (part_info[j].classList.contains('armazem')) {
                        var armazem = part_info[j].value;
                    } else if (part_info[j].classList.contains('codigo')) {
                        var codigo = part_info[j].value;
                    } else if (part_info[j].classList.contains('nome')) {
                        var nome = part_info[j].value;
                    } else if (part_info[j].classList.contains('quantidade-encomenda')) {
                        var quantidade_encomenda = part_info[j].value;
                    } else if (part_info[j].classList.contains('quantidade-pronta')) {
                        var quantidade_pronta = part_info[j].value;
                    } else if (part_info[j].classList.contains('unidade-quantidade')) {
                        var unidade_quantidade = part_info[j].firstElementChild.textContent;
                    } else if (part_info[j].classList.contains('material')) {
                        var material = part_info[j].value;
                    }
                }

                var quantidade_stock = '0';
                var caminho_ficha_tecnica = 'N/A';

                parts_list.push([armazem, codigo, nome, quantidade_encomenda, quantidade_pronta, quantidade_stock, unidade_quantidade, material,
                    caminho_ficha_tecnica])
            }

            return parts_list
        }

        function generate_parts_string(parts_list=return_parts_list()) {
            console.log(parts_list);

            let parts_string = '';

            for (let i = 0; i < parts_list.length; i++) {
                let sub_part_string = parts_list[i].join('|?!|') + '|?!|';

                parts_string += sub_part_string + '/?_!/';
            }

            return parts_string
        }

        function gather_form_info_update_order(redirect=true) {
            console.log('RAN GATHER FORM FUNC WITH REDIRECT SET TO ' + redirect);
            let data = {
                'pk': window.location.href.split('/')[4],
                'client': document.getElementById('id_client').value,
                'doc_type': document.getElementById('id_doc_type').value,
                'order_num_doc': document.getElementById('id_order_num_doc').value,
                'associated_doc_type': document.getElementById('id_associated_doc_type').value,
                'order_num_associated_doc': document.getElementById('id_order_num_associated_doc').value,
                'due_date': document.getElementById('id_due_date').value,
                'notes': document.getElementById('id_notes').value,
                'parts_string': generate_parts_string()
            };

            validate_form(data, redirect);
        }

        // function validate_form(data) {
        //     let valid_client = true;
        //     let valid_doc_type = true;
        //     let valid_order_num_doc = true;
        //     let valid_associated_doc_type = true;
        //     let valid_order_num_associated_doc = true;
        //     let valid_due_date = true;
        //     let valid_parts_string = true;
        //
        //     // Validate General Order Info
        //     if (data['client'] === ''){
        //         valid_client = false;
        //     }
        //     if (data['doc_type'] !== 'EPROD' && data['doc_type'] !== 'ENCOM' &&
        //         data['doc_type'] !== 'eprod' && data['doc_type'] !== 'encom') {
        //         valid_doc_type = false;
        //     }
        //     if (!Number.isInteger(parseInt(data['order_num_doc']))) {
        //
        //         valid_order_num_doc = false;
        //     }
        //     if (data['associated_doc_type'] !== 'EPROD' && data['associated_doc_type'] !== 'ENCOM' &&
        //         data['associated_doc_type'] !== 'eprod' && data['associated_doc_type'] !== 'encom' &&
        //         data['associated_doc_type'] !== 'Eprod' && data['associated_doc_type'] !== 'Encom') {
        //
        //         valid_associated_doc_type = false
        //     }
        //     if (!Number.isInteger(parseInt(data['order_num_associated_doc']))) {
        //         valid_order_num_associated_doc = false;
        //     }
        //     if (data['due_date'] !== '') {
        //         if (!check_date_is_valid(data['due_date'])) {
        //             valid_due_date = false;
        //         } else {
        //             let dd = data['due_date'].split('/')[0];
        //             let mm = data['due_date'].split('/')[1];
        //             let yyyy = data['due_date'].split('/')[2];
        //
        //             data['due_date'] = yyyy + '-' + mm + '-' + dd;
        //         }
        //     } else if (data['due_date'] === '') {
        //         let today = new Date();
        //         let dd = String(today.getDate()).padStart(2, '0');
        //         let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        //         let yyyy = today.getFullYear();
        //
        //         data['due_date'] =  yyyy + '-' + mm + '-' + dd;
        //     }
        //     if (data['notes'] === '') {
        //         data['notes'] = 'empty_notes';
        //     }
        //
        //     // Validate Parts Info
        //     let parts_qtty = document.querySelectorAll('.quantidade-encomenda');
        //     let parts_ready_qttdy = document.querySelectorAll('.quantidade-pronta');
        //     let parts_unit = document.querySelectorAll('.dropbtn-unit');
        //
        //     for (let i = 0; i < parts_qtty.length; i++) {
        //         if (!Number.isInteger(parseInt(parts_qtty[i].value))) {
        //             valid_parts_string = false;
        //             parts_qtty[i].style.backgroundColor = '#FF4C4C';
        //         } else {
        //             parts_qtty[i].style.backgroundColor = 'white';
        //         }
        //     }
        //
        //     for (let i = 0; i < parts_ready_qttdy.length; i++) {
        //         if (!Number.isInteger(parseInt(parts_ready_qttdy[i].value))) {
        //             valid_parts_string = false;
        //             parts_ready_qttdy[i].style.backgroundColor = '#FF4C4C';
        //         } else {
        //             parts_ready_qttdy[i].style.backgroundColor = 'white';
        //         }
        //     }
        //
        //     for (let i=0; i < parts_unit.length; i++) {
        //         if (parts_unit[i].innerText === 'Unid.') {
        //             valid_parts_string = false;
        //             parts_unit[i].style.backgroundColor = '#FF4C4C';
        //         } else {
        //             parts_unit[i].style.backgroundColor = 'white';
        //         }
        //     }
        //
        //
        //     if (valid_client && valid_doc_type && valid_order_num_doc && valid_associated_doc_type
        //         && valid_order_num_associated_doc && valid_due_date && valid_parts_string) {
        //         let order_id = data['pk'];
        //         let url = '/encomenda/' + order_id + '/';
        //         $ajaxUtils.sendPostRequest(data, url);
        //         location.href = '/';
        //     } else {
        //         let field_dict = {
        //             'valid_client': valid_client,
        //             'valid_doc_type' : valid_doc_type,
        //             'valid_order_num_doc' : valid_order_num_doc,
        //             'valid_associated_doc_type' : valid_associated_doc_type,
        //             'valid_order_num_associated_doc' : valid_order_num_associated_doc,
        //             'valid_due_date' : valid_due_date
        //         };
        //
        //         highlight_invalid_fields(field_dict)
        //     }
        // }

        function validate_form(data, redirect=true) {
            let valid_client = true;
            let valid_doc_type = true;
            let valid_order_num_doc = true;
            let valid_associated_doc_type = true;
            let valid_order_num_associated_doc = true;
            let valid_due_date = true;
            let valid_parts_string = true;

            // Validate General Order Info
            if (data['client'] === ''){
                valid_client = false;
            }
            if (data['doc_type'] !== 'EPROD' && data['doc_type'] !== 'ENCOM' &&
                data['doc_type'] !== 'eprod' && data['doc_type'] !== 'encom') {
                valid_doc_type = false;
            }
            if (!Number.isInteger(parseInt(data['order_num_doc']))) {

                valid_order_num_doc = false;
            }
            if (data['associated_doc_type'] !== 'EPROD' && data['associated_doc_type'] !== 'ENCOM' &&
                data['associated_doc_type'] !== 'eprod' && data['associated_doc_type'] !== 'encom' &&
                data['associated_doc_type'] !== 'Eprod' && data['associated_doc_type'] !== 'Encom' && data['associated_doc_type'] !== '') {

                valid_associated_doc_type = false
            } else if (data['associated_doc_type'] === '') {
                data['associated_doc_type'] = 'N/A';
            }
            if (data['associated_doc_type'] !== 'N/A') {
                if (!Number.isInteger(parseInt(data['order_num_associated_doc']))) {
                    valid_order_num_associated_doc = false;
                }
            } else {
                    data['order_num_associated_doc'] = 'N/A';
            }


            if (data['due_date'] !== '') {
                if (!check_date_is_valid(data['due_date'])) {
                    valid_due_date = false;
                } else {
                    let dd = data['due_date'].split('/')[0];
                    let mm = data['due_date'].split('/')[1];
                    let yyyy = data['due_date'].split('/')[2];

                    data['due_date'] = yyyy + '-' + mm + '-' + dd;
                }
            } else if (data['due_date'] === '') {
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                let yyyy = today.getFullYear();

                data['due_date'] =  yyyy + '-' + mm + '-' + dd;
            }
            if (data['notes'] === '') {
                data['notes'] = 'N/A';
            }

            // Validate Parts Info
            let parts_ref = document.querySelectorAll('.codigo');
            let parts_name = document.querySelectorAll('.nome');
            let parts_qtty = document.querySelectorAll('.quantidade-encomenda');
            let parts_ready_qttdy = document.querySelectorAll('.quantidade-pronta');
            let parts_unit = document.querySelectorAll('.dropbtn-unit');

            for (let i = 0; i < parts_ref.length; i++) {
                if (parts_ref[i].value === '') {
                    valid_parts_string = false;
                    parts_ref[i].style.backgroundColor = '#FF4C4C';
                } else {
                    parts_ref[i].style.backgroundColor = 'white';
                }
            }

            for (let i = 0; i < parts_name.length; i++) {
                if (parts_name[i].value === '') {
                    valid_parts_string = false;
                    parts_name[i].style.backgroundColor = '#FF4C4C';
                } else {
                    parts_name[i].style.backgroundColor = 'white';
                }
            }

            for (let i = 0; i < parts_qtty.length; i++) {
                if (!Number.isInteger(parseInt(parts_qtty[i].value))) {
                    valid_parts_string = false;
                    parts_qtty[i].style.backgroundColor = '#FF4C4C';
                } else {
                    parts_qtty[i].style.backgroundColor = 'white';
                }
            }

             for (let i = 0; i < parts_ready_qttdy.length; i++) {
                if (!Number.isInteger(parseInt(parts_ready_qttdy[i].value))) {
                    valid_parts_string = false;
                    parts_ready_qttdy[i].style.backgroundColor = '#FF4C4C';
                } else {
                    parts_ready_qttdy[i].style.backgroundColor = 'white';
                }
            }

            for (let i=0; i < parts_unit.length; i++) {
                if (parts_unit[i].innerText === 'Unid.') {
                    valid_parts_string = false;
                    parts_unit[i].style.backgroundColor = '#FF4C4C';
                } else {
                    parts_unit[i].style.backgroundColor = 'white';
                }
            }


            if (valid_client && valid_doc_type && valid_order_num_doc && valid_associated_doc_type
                && valid_order_num_associated_doc && valid_due_date && valid_parts_string) {
                let order_id = data['pk'];
                let url = '/encomenda/' + order_id + '/';
                $ajaxUtils.sendPostRequest(data, url);
                if (redirect) {
                    location.href = '/';
                }

            } else {
                let field_dict = {
                    'valid_client': valid_client,
                    'valid_doc_type' : valid_doc_type,
                    'valid_order_num_doc' : valid_order_num_doc,
                    'valid_associated_doc_type' : valid_associated_doc_type,
                    'valid_order_num_associated_doc' : valid_order_num_associated_doc,
                    'valid_due_date' : valid_due_date
                };

                highlight_invalid_fields(field_dict)
            }
        }

        function check_date_is_valid(date_string) {
            let day = date_string.split('/')[0];
            let month = date_string.split('/')[1];
            let year = date_string.split('/')[2];

            if (!Number.isInteger(parseInt(day)) || !Number.isInteger(parseInt(month)) ||
                !Number.isInteger(parseInt(year))) {
                return false
            }
            if (parseInt(day) < 1 || parseInt(day) > 31) {
                return false
            }
            if (parseInt(month) < 1 || parseInt(month) > 12) {
                return false
            }
            if (year.length !== 4) {
                return false
            }
            return true
        }

        function highlight_invalid_fields(field_dict) {
            window.alert('Informação Inválida ou incompleta');

            if (!field_dict['valid_client']) {
                document.getElementById('id_client').style.backgroundColor = '#FF4C4C';
            } else {
                document.getElementById('id_client').style.backgroundColor = 'white';
            }
            if (!field_dict['valid_doc_type']) {
                document.getElementById('id_doc_type').style.backgroundColor = '#FF4C4C';
            }else {
                document.getElementById('id_doc_type').style.backgroundColor = 'white';
            }
            if (!field_dict['valid_order_num_doc']) {
                document.getElementById('id_order_num_doc').style.backgroundColor = '#FF4C4C';
            }else {
                document.getElementById('id_order_num_doc').style.backgroundColor = 'white';
            }
            if (!field_dict['valid_associated_doc_type']) {
                document.getElementById('id_associated_doc_type').style.backgroundColor = '#FF4C4C';
            }else {
                document.getElementById('id_associated_doc_type').style.backgroundColor = 'white';
            }
            if (!field_dict['valid_order_num_associated_doc']) {
                document.getElementById('id_order_num_associated_doc').style.backgroundColor = '#FF4C4C';
            }else {
                document.getElementById('id_order_num_associated_doc').style.backgroundColor = 'white';
            }
            if (!field_dict['valid_due_date']) {
                document.getElementById('id_due_date').style.backgroundColor = '#FF4C4C';
            }else {
                document.getElementById('id_due_date').style.backgroundColor = 'white';
            }
        }

        function set_event_update_order() {
            document.querySelector('#botao-atualizar-encomenda').addEventListener('click', function() {
                if (deleted_parts) {
                    display_modal('modal-aviso-apagar-artigos');
                } else {
                   gather_form_info_update_order();
                }
            });
        }

        function replace_string_numbers( ){
            let pending_qtty_textboxes = document.querySelectorAll('.quantidade-encomenda');
            let ready_qtty_textboxes = document.querySelectorAll('.quantidade-pronta');

            for (let i=0; i<pending_qtty_textboxes.length; i++) {
                pending_qtty_textboxes[i].value = Number(pending_qtty_textboxes[i].value);
            }

             for (let i=0; i<ready_qtty_textboxes.length; i++) {
                ready_qtty_textboxes[i].value = Number(ready_qtty_textboxes[i].value);
            }
        }

        function set_color_part_lines() {
            let part_ready_qttys = document.querySelectorAll('.quantidade-pronta');

            for (let i = 0; i < part_ready_qttys.length; i++) {
                if (Number(part_ready_qttys[i].value) >= Number(part_ready_qttys[i].nextElementSibling.value)) {
                    part_ready_qttys[i].parentElement.style.backgroundColor = '#9ACD32';

                    for (let j = 0; j < part_ready_qttys[i].parentElement.childNodes.length; j++) {

                        if (j !== 0 && j !== 2 && j !== 4 && j !== 6 && j !== 8 && j !== 10 && j !== 12 && j !== 14 && j !== 16 && j !== 1) {
                            part_ready_qttys[i].parentElement.childNodes[j].style.backgroundColor = '#9ACD32';
                            part_ready_qttys[i].parentElement.childNodes[j].style.border = '0';
                        }
                    }

                } else {
                    part_ready_qttys[i].parentElement.style.backgroundColor = '#FAFAFA';
                    for (let j = 0; j < part_ready_qttys[i].parentElement.childNodes.length; j++) {
                         if (j !== 0 && j !== 2 && j !== 4 && j !== 6 && j !== 8 && j !== 10 && j !== 12 && j !== 14 && j !== 16 && j !== 1) {
                             part_ready_qttys[i].parentElement.childNodes[j].style.backgroundColor = '#FAFAFA';
                             part_ready_qttys[i].parentElement.childNodes[j].style.border = '0';
                         }
                    }

                }
            }
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
            if (keyName === 'Escape') {
                close_modal()
            }
        }

        function display_modal(modal_id=null, modal_element=null) {
            if (modal_element === null) {
                currently_open_modal = document.getElementById(modal_id);
            } else {
                currently_open_modal = modal_element;
            }

            document.addEventListener('keydown', close_modal_by_esc_press);

            currently_open_modal.style.display = 'block';
        }

        function gather_info_create_shipping() {
            let ready_qtty_elements = document.querySelectorAll('.quantidade-pronta');
            let elements_to_display = [];

            for (let i=0; i<ready_qtty_elements.length; i++) {
                if (ready_qtty_elements[i].value !== '0') {
                    let storage_element = ready_qtty_elements[i].parentElement.firstElementChild.nextElementSibling;
                    let reference_element = storage_element.nextElementSibling;
                    let name_element = reference_element.nextElementSibling;
                    let unit = name_element.nextElementSibling.nextElementSibling.firstElementChild.innerText;
                    let ready_quantity_element = name_element.nextElementSibling.nextElementSibling.nextElementSibling;
                    let pending_quantity = ready_quantity_element.nextElementSibling.value;

                    elements_to_display.push({'storage': storage_element.value, 'reference': reference_element.value, 'name': name_element.value,
                    'pending_quantity': pending_quantity, 'ready_quantity': ready_quantity_element.value, 'unit': unit})
                }
            }

            // REQUEST PART WEIGHT UNIT.
            console.log(elements_to_display);
            let url = '/' + window.location.href.split('/')[3] + '/' + window.location.href.split('/')[4] + '/';
            $ajaxUtils.sendPostRequest({'request_type': 'request_weight', 'request_weight': elements_to_display}, url, handle_response_request_part_weight, false)
        }

        function set_event_create_shipping() {
            document.querySelector('#botao-gerar-guia-remessa').addEventListener('click', function() {
                gather_form_info_update_order(redirect=false);
                display_modal('modal-criar-expedicao');
                gather_info_create_shipping();
            })
        }

        function handle_response_request_part_weight(response) {
            console.log('RESPONSE RECEIVED');

            let html_string = '';

            for (let i=0; i<response['updated_list'].length; i++) {
                let part_object = response['updated_list'][i];
                let partial_weight = Number(part_object.ready_quantity) * Number(part_object.weight);

                if (isNaN(partial_weight)) {
                    partial_weight = 'N/A'
                } else {
                    partial_weight = round_floating_number(partial_weight);
                    partial_weight += ' kg'
                }

                html_string += '<div class="artigo"><input type="checkbox" class="checkbox checkbox-artigo-gerar-guia" name="not-selected"><span class="artigo-gerar-guia armazem-gerar-guia">'
                    + part_object.storage + '</span>' + '<span class="artigo-gerar-guia codigo-gerar-guia">' + part_object.reference +
                    '</span><span class="artigo-gerar-guia nome-gerar-guia">' + part_object.name + '</span><span class="artigo-gerar-guia peso-gerar-guia">' +
                    partial_weight + '</span><span class="artigo-gerar-guia unidade-quantidade-gerar-guia">' +
                    part_object.unit + '</span><span class="artigo-gerar-guia quantidade-stock-gerar-guia">' + part_object.stock_quantity +
                    '</span><input class="artigo-gerar-guia quantidade-pronta-gerar-guia"><span class="artigo-gerar-guia quantidade-encomenda-gerar-guia">' +
                    part_object.pending_quantity +  '</span></div>';
            }

            document.querySelector('#artigos').innerHTML = html_string;


            for (let i=0; i<response['updated_list'].length; i++) {
                document.querySelectorAll('.quantidade-pronta-gerar-guia')[i].value = response['updated_list'][i].ready_quantity;
                document.querySelectorAll('.peso-gerar-guia')[i].name = response['updated_list'][i].weight;
            }

            document.querySelector('#info-peso-total').previousElementSibling.addEventListener('click', calculate_total_weight);
            calculate_total_weight();

            document.querySelector('#status-loading').innerHTML = '';

            document.querySelector('#checkbox-selecionar-todos-artigos').addEventListener('click', select_all_parts);
            document.querySelector('#botao-guardar-e-sair').addEventListener('click', send_request_create_shipping);
            document.querySelector('#botao-voltar').addEventListener('click', close_modal);
        }

        function round_floating_number(number) {
            if (number % 1 !== 0) {
                number = number.toFixed(2)
            }
            return number
        }

        function calculate_total_weight() {
            let weight_elements_list = document.querySelectorAll('.peso-gerar-guia');
            let ready_qtty_elements_list = document.querySelectorAll('.quantidade-pronta-gerar-guia');
            let total_weight = 0;

            for (let i=0; i<weight_elements_list.length; i++) {
                let checkbox = weight_elements_list[i].parentElement.firstElementChild;
                if (checkbox.checked) {
                    if (weight_elements_list[i].innerText !== 'N/A') {
                    let partial_weight = Number(weight_elements_list[i].name) * Number(ready_qtty_elements_list[i].value);
                    weight_elements_list[i].innerText = partial_weight;
                    total_weight += Number(weight_elements_list[i].innerText.split(' ')[0]);
                }
                }
            }

            document.querySelector('#peso-total').innerText = total_weight + ' kg';
        }

        function select_all_parts() {
            let checkbox_elements = document.querySelectorAll('.checkbox-artigo-gerar-guia');

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

        function send_request_create_shipping() {
            let doc_type_element = document.querySelector('#info-tipo-documento-criar-expedicao');
            let num_doc_element = document.querySelector('#info-num-documento-criar-expedicao');
            let vehicle_info_element = document.querySelector('#info-veiculo-criar-expedicao');
            let selected_parts = document.querySelectorAll('.checkbox-artigo-gerar-guia');
            let ready_qtty_elements = [];
            let parts_info = [];
            let is_valid_ready_quantity = true;

            for (let i=0; i<selected_parts.length; i++) {
                if (selected_parts[i].checked) {
                    let storage_element = selected_parts[i].nextElementSibling;
                    let ref_element = storage_element.nextElementSibling;
                    let name_element = ref_element.nextElementSibling;
                    let unit_element =  name_element.nextElementSibling.nextElementSibling;
                    let ready_qtty_element = unit_element.nextElementSibling.nextElementSibling;

                    if (!Number.isInteger(parseInt(ready_qtty_element.value))) {
                        ready_qtty_element.style.backgroundColor = '#FF4C4C';
                        is_valid_ready_quantity = false;
                    } else {
                        ready_qtty_element.style.backgroundColor = 'white';

                        parts_info.push([storage_element.innerText, ref_element.innerText, name_element.innerText, ready_qtty_element.value, unit_element.innerText])

                        // parts_info.push({
                        //     'storage': storage_element.innerText,
                        //     'ref': ref_element.innerText,
                        //     'name': name_element.innerText,
                        //     'ready_qtty': ready_qtty_element.value,
                        //     'unit': unit_element.innerText,
                        // })
                    }

                    ready_qtty_elements.push(ready_qtty_element);
                }
            }

            let info_valid = validate_info_create_shipping(is_valid_ready_quantity, doc_type_element, num_doc_element);

            if (info_valid) {
                calculate_total_weight();

                let data = {
                    'request_type': 'create_shipping',
                    'client': document.querySelector('#id_client').value,
                    'doc_type': doc_type_element.value,
                    'num_doc': num_doc_element.value,
                    'associated_doc_type': document.querySelector('#id_doc_type').value,
                    'order_num_associated_doc': document.querySelector('#id_order_num_doc').value,
                    'vehicle_info': vehicle_info_element.value,
                    'total_weight': document.querySelector('#peso-total').innerText,
                    'parts_string': generate_parts_string(parts_info)
                };

                console.log(parts_info);

                let url = '/' + window.location.href.split('/')[3] + '/' + window.location.href.split('/')[4] + '/';
                $ajaxUtils.sendPostRequest(data, url, handle_response_redirect, false);

                // SEND POST REQUEST HERE
            } else {
                window.alert('Informação Inválida ou incompleta')
            }
        }

        function validate_info_create_shipping(is_valid_ready_quantity, doc_type_element, num_doc_element) {
            let is_valid_doc_type = false;
            let is_valid_num_doc = false;

            if (doc_type_element.value !== '') {
                is_valid_doc_type = true;
                doc_type_element.style.backgroundColor = 'white';
            } else {
                doc_type_element.style.backgroundColor = '#FF4C4C';
                is_valid_doc_type = false
            }
            if (num_doc_element.value !== '') {
                is_valid_num_doc = true;
                num_doc_element.style.backgroundColor = 'white';
            } else {
                num_doc_element.style.backgroundColor = '#FF4C4C';
                is_valid_num_doc = false
            }

            if (is_valid_doc_type && is_valid_num_doc && is_valid_ready_quantity) {
                return true
            } else {
                return false
            }
        }

        function handle_response_redirect(response) {
            if (response['redirect'] === 'shippings') {
                window.location.href = '/expedicoes';
            }
        }

        function set_events_warning_modal() {
            let cancel_button = document.querySelector('#botao-cancelar-aviso-apagar-artigo');
            let continue_button = document.querySelector('#botao-confirmar-aviso-apagar-artigo');

            cancel_button.addEventListener('click', close_modal);
            continue_button.addEventListener('click', gather_info_create_order);
        }


        //    Call functions here
        set_event_select_doc_type();
        set_event_dropdown_select();
        set_event_dropdown_unit_expand();
        set_event_close_dropdown_on_outside_click();
        set_event_add_new_part_line();
        set_event_remove_new_part_line();
        set_event_update_order();
        set_event_create_shipping();
        overhaul_default_text();
        replace_string_numbers();
        set_color_part_lines();
        set_events_warning_modal();
    })
})(window);