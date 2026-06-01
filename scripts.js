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

const carrosselProcesso = document.querySelector(".carrossel");

if (carrosselProcesso) {
    const cardsProcesso = Array.from(carrosselProcesso.children).filter(
        (elemento) => elemento.tagName === "DIV"
    );
    const linhaPontilhada = document.querySelector(".line-pontilhada");
    const quantidadeVisivel = 3;
    let primeiroCardVisivel = 0;
    let pontosNaEsquerda = false;

    const criarBotaoCarrossel = (classe, descricao) => {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = `btn-carrossel-processo ${classe}`;
        botao.setAttribute("aria-label", descricao);
        carrosselProcesso.appendChild(botao);

        return botao;
    };

    const btnAnterior = criarBotaoCarrossel(
        "btn-carrossel-anterior",
        "Mostrar etapas anteriores"
    );
    const btnProximo = criarBotaoCarrossel(
        "btn-carrossel-proximo",
        "Mostrar próximas etapas"
    );

    const atualizarCarrossel = () => {
        cardsProcesso.forEach((card) => {
            card.classList.remove("card-processo-visivel");
            card.classList.add("card-processo-oculto");
            card.style.order = "";
        });

        for (let posicao = 0; posicao < quantidadeVisivel; posicao += 1) {
            const indice = (primeiroCardVisivel + posicao) % cardsProcesso.length;
            const card = cardsProcesso[indice];

            card.classList.remove("card-processo-oculto");
            card.classList.add("card-processo-visivel");
            card.style.order = posicao;
        }

        btnAnterior.hidden = primeiroCardVisivel === 0;
        btnProximo.hidden = cardsProcesso.length <= quantidadeVisivel;
    };

    const animarLinhaPontilhada = () => {
        if (!linhaPontilhada) {
            return;
        }

        pontosNaEsquerda = !pontosNaEsquerda;
        linhaPontilhada.classList.toggle(
            "pontilhado-esquerda",
            pontosNaEsquerda
        );
    };

    btnAnterior.addEventListener("click", () => {
        primeiroCardVisivel = Math.max(0, primeiroCardVisivel - 1);
        atualizarCarrossel();
    });

    btnProximo.addEventListener("click", () => {
        primeiroCardVisivel =
            (primeiroCardVisivel + 1) % cardsProcesso.length;
        atualizarCarrossel();
        animarLinhaPontilhada();
    });

    atualizarCarrossel();
}

const numeroWhatsApp = "5547991049570";
const mensagemWhatsApp = `Olá Psicólogo Leonir Troscki! 😃

Gostaria de obter mais informações sobre o atendimento!

Obrigada(o)!`;
const linkWhatsApp =
    `https://api.whatsapp.com/send?phone=${numeroWhatsApp}` +
    `&text=${encodeURIComponent(mensagemWhatsApp)}`;
const botoesWhatsApp = document.querySelectorAll(
    ".btn-header, " +
    ".btn-psico, " +
    ".btn-emocoes, " +
    ".btn-sobre, " +
    ".btn-terapias, " +
    ".btn-diferenciais"
);

botoesWhatsApp.forEach((botao) => {
    botao.addEventListener("click", () => {
        window.open(linkWhatsApp, "_blank", "noopener,noreferrer");
    });
});
