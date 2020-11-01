
function change_text_labels_login() {
    let label_parents = document.querySelectorAll('.form-group');

    label_parents[1].firstChild.nextSibling.textContent = 'Utilizador';
    label_parents[2].firstChild.nextSibling.textContent = 'Password';
}

change_text_labels_login();