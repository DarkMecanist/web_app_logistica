(function (global) {
    document.addEventListener("DOMContentLoaded", function (event) {
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
            console.log('RUNING DROPDOWN EXPAND FUNC');
            console.log(this.nextElementSibling);
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
                        var quantidade_expedida = part_info[j].value;
                    } else if (part_info[j].classList.contains('unidade-quantidade')) {
                        var unidade_quantidade = part_info[j].firstElementChild.textContent;
                    } else if (part_info[j].classList.contains('material')) {
                        var material = part_info[j].value;
                    }
                }



                parts_list.push([armazem, codigo, nome, quantidade_expedida, unidade_quantidade])
            }

             parts_list = parts_list.sort((a,b) => a[2].toUpperCase().localeCompare(b[2].toUpperCase())); //SORT BY PART NAME

            console.log(parts_list);

            return parts_list
        }

        function generate_parts_string() {
            let parts_string = '';
            let parts_list = return_parts_list();

            for (let i = 0; i < parts_list.length; i++) {
                let sub_part_string = parts_list[i].join('|?!|') + '|?!|';

                parts_string += sub_part_string + '/?_!/';
            }

            return parts_string
        }

        function gather_form_info_create_shipping() {

            let data = {
                'client': document.getElementById('id_client').value,
                'doc_type': document.getElementById('id_doc_type').value,
                'num_doc': document.getElementById('id_num_doc').value,
                'associated_doc_type': document.getElementById('id_associated_doc_type').value,
                'order_num_associated_doc': document.getElementById('id_order_num_associated_doc').value,
                'vehicle_info': document.getElementById('id_vehicle_info').value,
                'notes': document.getElementById('id_notes').value,
                'parts_string': generate_parts_string()
            };

            validate_form(data);
        }

        function validate_form(data) {
            let valid_client = true;
            let valid_doc_type = true;
            let valid_num_doc = true;
            let valid_order_num_associated_doc = true;
            let valid_parts_string = true;

            // Validate General Order Info
            if (data['client'] === ''){
                valid_client = false;
            }
            if (data['doc_type'] === '') {
                valid_doc_type = false;
            }
            if (data['num_doc'] === '') {
                valid_num_doc = false;
            }
            if (data['associated_doc_type'] === '') {
                data['associated_doc_type'] = 'N/A';
            }
            if (data['associated_doc_type'] !== 'N/A') {
                if (data['order_num_associated_doc'] === '') {
                    valid_order_num_associated_doc = false;
                }
            } else {
                    data['order_num_associated_doc'] = 'N/A';
            }
            if (data['vehicle_info'] === '') {
                data['vehicle_info'] = 'N/A';
            }
            if (data['notes'] === '') {
                data['notes'] = 'N/A';
            }

            // Validate Parts Info
            let parts_ref = document.querySelectorAll('.codigo');
            let parts_name = document.querySelectorAll('.nome');
            let parts_qtty = document.querySelectorAll('.quantidade-encomenda');
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

            for (let i=0; i < parts_unit.length; i++) {
                if (parts_unit[i].innerText === 'Unid.') {
                    valid_parts_string = false;
                    parts_unit[i].style.backgroundColor = '#FF4C4C';
                } else {
                    parts_unit[i].style.backgroundColor = 'white';
                }
            }


            if (valid_client && valid_doc_type && valid_num_doc
                && valid_order_num_associated_doc && valid_parts_string) {

                console.log(data);

                $ajaxUtils.sendPostRequest(data, '/nova_expedicao/', handle_response_redirect);
            } else {
                let field_dict = {
                    'valid_client': valid_client,
                    'valid_doc_type' : valid_doc_type,
                    'valid_num_doc' : valid_num_doc,
                    'valid_order_num_associated_doc' : valid_order_num_associated_doc
                };

                highlight_invalid_fields(field_dict)
            }
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
            if (!field_dict['valid_num_doc']) {
                document.getElementById('id_num_doc').style.backgroundColor = '#FF4C4C';
            }else {
                document.getElementById('id_order_num_doc').style.backgroundColor = 'white';
            }
            if (!field_dict['valid_order_num_associated_doc']) {
                document.getElementById('id_order_num_associated_doc').style.backgroundColor = '#FF4C4C';
            }else {
                document.getElementById('id_order_num_associated_doc').style.backgroundColor = 'white';
            }
        }

        function set_event_submit_new_shipping() {
            document.querySelector('#botao-criar-nova-encomenda').addEventListener('click', gather_form_info_create_shipping);
        }

        function handle_response_redirect(response) {
                let redirect_location = response['redirect'];

                if (redirect_location !== undefined) {
                    let base_url = window.location.href.split('/')[0];
                    window.location.href = base_url + redirect_location
                }
        }

        set_event_dropdown_unit_expand();
        set_event_close_dropdown_on_outside_click();
        set_event_dropdown_select();
        set_event_add_new_part_line();
        set_event_remove_new_part_line();
        set_event_submit_new_shipping()
    })
})(window);