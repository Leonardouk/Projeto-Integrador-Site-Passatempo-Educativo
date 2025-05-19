async function inserirNavbar() {
    console.log("FUNÇÃO inserirNavabar()")
    //Confere condição de login e insere navbar padrão ou navbar admin
    const tokenExiste = await checarStatusLogin()
    const arquivoNavbar = tokenExiste ? 'navbar_adm.html' : 'navbar.html'
    console.log("Token existe:", tokenExiste)
    console.log("O arquivoNavbar é: ", arquivoNavbar)
    fetch(arquivoNavbar)
    .then(res => res.text())
    .then(html => {
        const barraNavegacao = document.querySelector('.barra_navegacao')
        barraNavegacao.innerHTML = html
        const itens_navbar = barraNavegacao.children

        for (const item of itens_navbar) {
            if (item.firstElementChild.getAttribute('href') === window.location.pathname.split('/').pop())
                item.firstElementChild.classList.add('active')
        }
    })
    .catch(err => console.error("Erro ao carregar a navbar:", err))
}