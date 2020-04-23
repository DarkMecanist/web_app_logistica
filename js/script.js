function nada() {
    window.alert('Isto ainda não faz nada');
}

function expandir_encomenda() {
    this.innerHTML = "-";
    console.log(this.parentElement.nextElementSibling.nextElementSibling);
    var container_artigos = this.parentElement.nextElementSibling.nextElementSibling;

    container_artigos.style.cssText = "height: 200px";

}

function editar_valor() {
    this.innerHTML = 'novo valor';
}

var lista_botoes_encomenda = document.querySelectorAll(".botao-encomenda");

for (let i = 0; i < lista_botoes_encomenda.length; i++) {
    lista_botoes_encomenda[i].onclick = expandir_encomenda;
}