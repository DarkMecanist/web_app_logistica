(function (global) {
    document.addEventListener("DOMContentLoaded", function (event) {
        function select_unit() {
            this.parentElement.nextElementSibling.firstElementChild.value = this.innerText;
        }

        function set_event_select_unit() {
            let targets = document.querySelectorAll('.select_unit_stock');

            for (let i=0; i<targets.length; i++){
                targets[i].addEventListener('click', select_unit);
            }
        }

        function send_post_request_form_data(form) {
            let part_id = window.location.href.split('/')[4] +'/';
            let formData = new FormData(form);
            let url = '/artigo/' + part_id;

            $ajaxUtils.sendPostRequest(formData, url , handle_response_redirect, true);
        }

        function gather_form_info_create_part() {
            let data = {
                'storage': document.getElementById('id_storage').value,
                'reference': document.getElementById('id_reference').value,
                'name': document.getElementById('id_name').value,
                'stock_quantity': document.getElementById('id_stock_quantity').value,
                'stock_unit': document.getElementById('id_stock_unit').value,
                'material': document.getElementById('id_material').value,
                'weight': document.getElementById('id_weight').value,
                'technical_PDF': document.getElementById('id_technical_PDF').value
            };

            validate_form(data);
        }

        function validate_form(data) {
            let valid_storage = true;
            let valid_reference = true;
            let valid_name = true;
            let valid_stock_quantity = true;
            let valid_stock_unit = true;
            let valid_weight = true;

            if (data['storage'] === '') {
                valid_storage = false
            }
            if (data['reference'] === '') {
                valid_reference = false
            }
            if (data['name'] === '') {
                valid_name = false
            }
            if (data['stock_quantity'] === '' || !Number.isInteger(parseInt(data['stock_quantity'])) ) {
                valid_stock_quantity = false
            }
            if (data['stock_unit'] !== 'UN.' && data['stock_unit'] !== 'MT.' && data['stock_unit'] !== 'KG.') {
                valid_stock_unit = false
            }
            if (data['weight'] !== '' && !Number.isInteger(parseInt(data['weight'])))  {
                valid_weight = false
            }

            if (valid_storage && valid_reference && valid_name && valid_stock_quantity && valid_stock_unit && valid_weight) {
                send_post_request_form_data(document.getElementById('part-info'));
            } else {
                let field_dict = {
                    'valid_storage': valid_storage,
                    'valid_reference': valid_reference,
                    'valid_name': valid_name,
                    'valid_stock_quantity': valid_stock_quantity,
                    'valid_stock_unit': valid_stock_unit,
                    'valid_weight': valid_weight
                };

                highlight_invalid_fields(field_dict)
            }
        }

        function highlight_invalid_fields(field_dict) {
            window.alert('Informação Inválida ou incompleta');

            console.log(field_dict);

            if (!field_dict['valid_storage']) {
                document.getElementById('id_storage').style.backgroundColor = '#FF4C4C';
            } else {
                document.getElementById('id_storage').style.backgroundColor = 'white';
            }
            if (!field_dict['valid_reference']) {
                document.getElementById('id_reference').style.backgroundColor = '#FF4C4C';
            } else {
                document.getElementById('id_reference').style.backgroundColor = 'white';
            }
            if (!field_dict['valid_name']) {
                document.getElementById('id_name').style.backgroundColor = '#FF4C4C';
            } else {
                document.getElementById('id_name').style.backgroundColor = 'white';
            }
            if (!field_dict['valid_stock_quantity']) {
                 document.getElementById('id_stock_quantity').style.backgroundColor = '#FF4C4C';
            } else {
                document.getElementById('id_stock_quantity').style.backgroundColor = 'white';
            }
            if (!field_dict['valid_stock_unit']) {
                document.getElementById('id_stock_unit').style.backgroundColor = '#FF4C4C';
            } else {
                document.getElementById('id_stock_unit').style.backgroundColor = 'white';
            }
            if (!field_dict['valid_weight']) {
                document.getElementById('id_weight').style.backgroundColor = '#FF4C4C';
            } else {
                document.getElementById('id_weight').style.backgroundColor = 'white';
            }
        }

        function set_event_update_part() {
            document.querySelector('#botao-atualizar-artigo').addEventListener('click', gather_form_info_create_part)
        }

        function handle_response_redirect(response) {
                let redirect_location = response['redirect'];

                if (redirect_location !== undefined) {
                    let base_url = window.location.href.split('/')[0];
                    window.location.href = base_url + redirect_location
                }
        }

        function replace_text() {
            let initial_string = document.querySelector('#input-area-technical-PDF').innerHTML;
            let new_string = initial_string.replace('Currently', 'Atual').replace('Change','Selecionar outro');
            document.querySelector('#input-area-technical-PDF').innerHTML = new_string;
        }

        set_event_select_unit();
        set_event_update_part();
        replace_text();
    })
})(window);