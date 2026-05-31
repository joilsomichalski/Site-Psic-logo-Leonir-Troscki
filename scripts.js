const cardsEmocoes = document.querySelectorAll(".emocao");

cardsEmocoes.forEach((cardSelecionado) => {
    const btnAbrir = cardSelecionado.querySelector(".btn-saiba-mais");
    const btnFechar = cardSelecionado.querySelector(".btn-fechar");

    btnAbrir.addEventListener("click", () => {
        cardsEmocoes.forEach((card) => {
            if (card !== cardSelecionado) {
                card.classList.add("oculta");
            }
        });

        cardSelecionado.classList.add("aberta");
    });

    btnFechar.addEventListener("click", () => {
        cardSelecionado.classList.remove("aberta");

        cardsEmocoes.forEach((card) => {
            card.classList.remove("oculta");
        });
    });
});