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
    const obterQuantidadeVisivelProcesso = () => {
        if (window.innerWidth <= 700) {
            return 1;
        }

        if (window.innerWidth <= 900) {
            return 2;
        }

        return 3;
    };
    let quantidadeVisivel = obterQuantidadeVisivelProcesso();
    const paradasLinhaPontilhada = [
        { inicio: "75%", largura: "25%" },
        { inicio: "50%", largura: "25%" },
        { inicio: "25%", largura: "25%" },
        { inicio: "0%", largura: "25%" },
    ];
    let primeiroCardVisivel = 0;

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

    const atualizarLinhaPontilhada = () => {
        if (!linhaPontilhada) {
            return;
        }

        const ultimoCard = Math.max(cardsProcesso.length - 1, 1);
        const ultimaParada = paradasLinhaPontilhada.length - 1;
        const indiceLinhaPontilhada = Math.round(
            (primeiroCardVisivel / ultimoCard) * ultimaParada
        );
        const paradaAtual = paradasLinhaPontilhada[indiceLinhaPontilhada];

        linhaPontilhada.style.setProperty(
            "--pontilhado-inicio",
            paradaAtual.inicio
        );
        linhaPontilhada.style.setProperty(
            "--pontilhado-largura",
            paradaAtual.largura
        );
    };

    const atualizarCarrossel = () => {
        quantidadeVisivel = obterQuantidadeVisivelProcesso();

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
        atualizarLinhaPontilhada();
    };

    window.addEventListener("resize", atualizarCarrossel);

    btnAnterior.addEventListener("click", () => {
        primeiroCardVisivel = Math.max(0, primeiroCardVisivel - 1);
        atualizarCarrossel();
    });

    btnProximo.addEventListener("click", () => {
        primeiroCardVisivel =
            (primeiroCardVisivel + 1) % cardsProcesso.length;
        atualizarCarrossel();
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
const botoesWhatsApp = document.querySelectorAll(".btn-wpp");

botoesWhatsApp.forEach((botao) => {
    botao.addEventListener("click", () => {
        window.open(linkWhatsApp, "_blank", "noopener,noreferrer");
    });
});

const elementosAnimacaoScroll = document.querySelectorAll(
    [
        ".nome",
        ".h2-section",
        ".h3-section",
        ".btn-psico",
        ".titulo-emocoes",
        ".img-sobre-imagens",
        ".sobre-leo",
        ".leonir",
        ".btn-sobre",
        ".p-diferenciais",
        ".p-terapeutico",
        ".carrossel",
        ".line-pontilhada",
        ".carrossel-depoimentos",
    ].join(", ")
);

if (elementosAnimacaoScroll.length > 0) {
    if ("IntersectionObserver" in window) {
        const observerAnimacoesScroll = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("animar");
                        observerAnimacoesScroll.unobserve(entrada.target);
                    }
                });
            },
            {
                threshold: 0.3,
            }
        );

        elementosAnimacaoScroll.forEach((elemento) => {
            observerAnimacoesScroll.observe(elemento);
        });
    } else {
        elementosAnimacaoScroll.forEach((elemento) => {
            elemento.classList.add("animar");
        });
    }
}

const carrosselDepoimentos = document.querySelector(".carrossel-depoimentos");

if (carrosselDepoimentos) {
    const duracaoAnimacaoDepoimentos = 28;
    let arrastandoDepoimentos = false;
    let inicioArrasteDepoimentos = 0;
    let translateInicialDepoimentos = 0;
    let translateAtualDepoimentos = 0;
    let quantidadeDepoimentosOriginais = 0;

    const obterDepoimentosOriginais = () =>
        Array.from(carrosselDepoimentos.querySelectorAll(".depoimento")).filter(
            (depoimento) => !depoimento.classList.contains("depoimento-clone")
        );

    const atualizarDistanciaCarrosselDepoimentos = () => {
        const primeiroClone = carrosselDepoimentos.querySelector(
            ".depoimento-clone"
        );
        const janelaCarrossel = carrosselDepoimentos.parentElement;

        if (!primeiroClone || !janelaCarrossel) {
            return;
        }

        const estilosCarrossel = getComputedStyle(carrosselDepoimentos);
        const espacoEntreCards = parseFloat(estilosCarrossel.columnGap) || 0;
        const quantidadeVisivelDepoimentos =
            window.innerWidth <= 700 ? 1 : window.innerWidth <= 900 ? 2 : 3;
        const larguraCard =
            (janelaCarrossel.clientWidth -
                espacoEntreCards * (quantidadeVisivelDepoimentos - 1)) /
            quantidadeVisivelDepoimentos;

        carrosselDepoimentos.style.setProperty(
            "--largura-card-depoimento",
            `${larguraCard}px`
        );
        carrosselDepoimentos.style.setProperty(
            "--distancia-depoimentos",
            `${primeiroClone.offsetLeft}px`
        );
        carrosselDepoimentos.classList.add("carrossel-depoimentos-ativo");
    };

    const prepararLoopCarrosselDepoimentos = () => {
        const depoimentosOriginais = obterDepoimentosOriginais();

        carrosselDepoimentos
            .querySelectorAll(".depoimento-clone")
            .forEach((clone) => clone.remove());

        quantidadeDepoimentosOriginais = depoimentosOriginais.length;

        depoimentosOriginais.forEach((depoimento) => {
            const clone = depoimento.cloneNode(true);

            clone.setAttribute("aria-hidden", "true");
            clone.classList.add("depoimento-clone");
            carrosselDepoimentos.appendChild(clone);
        });

        requestAnimationFrame(atualizarDistanciaCarrosselDepoimentos);
    };

    prepararLoopCarrosselDepoimentos();
    window.addEventListener("resize", atualizarDistanciaCarrosselDepoimentos);

    const observerNovosDepoimentos = new MutationObserver(() => {
        const totalAtual = obterDepoimentosOriginais().length;

        if (totalAtual !== quantidadeDepoimentosOriginais) {
            prepararLoopCarrosselDepoimentos();
        }
    });

    observerNovosDepoimentos.observe(carrosselDepoimentos, {
        childList: true,
    });

    const obterDistanciaCarrosselDepoimentos = () =>
        parseFloat(
            getComputedStyle(carrosselDepoimentos).getPropertyValue(
                "--distancia-depoimentos"
            )
        ) || 0;

    const obterTranslateXCarrosselDepoimentos = () => {
        const transform = getComputedStyle(carrosselDepoimentos).transform;

        if (!transform || transform === "none") {
            return 0;
        }

        return new DOMMatrixReadOnly(transform).m41;
    };

    const normalizarTranslateCarrosselDepoimentos = (valor) => {
        const distancia = obterDistanciaCarrosselDepoimentos();

        if (!distancia) {
            return valor;
        }

        let translateNormalizado = valor;

        while (translateNormalizado > 0) {
            translateNormalizado -= distancia;
        }

        while (translateNormalizado < -distancia) {
            translateNormalizado += distancia;
        }

        return translateNormalizado;
    };

    const continuarAnimacaoCarrosselDepoimentos = () => {
        const distancia = obterDistanciaCarrosselDepoimentos();
        const progresso = distancia
            ? Math.abs(translateAtualDepoimentos) / distancia
            : 0;

        carrosselDepoimentos.style.setProperty(
            "--depoimentos-animation-delay",
            `${-(progresso * duracaoAnimacaoDepoimentos)}s`
        );
        carrosselDepoimentos.style.transform = "";
        carrosselDepoimentos.classList.remove("carrossel-depoimentos-ativo");
        carrosselDepoimentos.offsetWidth;
        carrosselDepoimentos.classList.add("carrossel-depoimentos-ativo");
    };

    const janelaDepoimentos = carrosselDepoimentos.parentElement;

    if (janelaDepoimentos) {
        janelaDepoimentos.addEventListener("pointerdown", (evento) => {
            arrastandoDepoimentos = true;
            inicioArrasteDepoimentos = evento.clientX;
            translateInicialDepoimentos = obterTranslateXCarrosselDepoimentos();
            translateAtualDepoimentos = translateInicialDepoimentos;

            janelaDepoimentos.classList.add("arrastando");
            janelaDepoimentos.setPointerCapture(evento.pointerId);
            carrosselDepoimentos.style.transform = `translateX(${translateAtualDepoimentos}px)`;
            evento.preventDefault();
        });

        janelaDepoimentos.addEventListener("pointermove", (evento) => {
            if (!arrastandoDepoimentos) {
                return;
            }

            const distanciaArrastada = evento.clientX - inicioArrasteDepoimentos;

            translateAtualDepoimentos = normalizarTranslateCarrosselDepoimentos(
                translateInicialDepoimentos + distanciaArrastada
            );
            carrosselDepoimentos.style.transform = `translateX(${translateAtualDepoimentos}px)`;
        });

        janelaDepoimentos.addEventListener("pointerup", (evento) => {
            if (!arrastandoDepoimentos) {
                return;
            }

            arrastandoDepoimentos = false;
            janelaDepoimentos.classList.remove("arrastando");
            janelaDepoimentos.releasePointerCapture(evento.pointerId);
            continuarAnimacaoCarrosselDepoimentos();
        });

        janelaDepoimentos.addEventListener("pointercancel", () => {
            if (!arrastandoDepoimentos) {
                return;
            }

            arrastandoDepoimentos = false;
            janelaDepoimentos.classList.remove("arrastando");
            continuarAnimacaoCarrosselDepoimentos();
        });
    }
}

const perguntasFrequentes = document.querySelectorAll(".pergunta");

perguntasFrequentes.forEach((pergunta, indice) => {
    const resposta = pergunta.querySelector("p");

    if (!resposta) {
        return;
    }

    const idResposta = `resposta-pergunta-${indice + 1}`;

    resposta.id = idResposta;
    resposta.setAttribute("aria-hidden", "true");
    pergunta.setAttribute("role", "button");
    pergunta.setAttribute("tabindex", "0");
    pergunta.setAttribute("aria-expanded", "false");
    pergunta.setAttribute("aria-controls", idResposta);

    const alternarPergunta = () => {
        const vaiAbrir = !pergunta.classList.contains("aberta");

        perguntasFrequentes.forEach((outraPergunta) => {
            const outraResposta = outraPergunta.querySelector("p");

            outraPergunta.classList.remove("aberta");
            outraPergunta.setAttribute("aria-expanded", "false");

            if (outraResposta) {
                outraResposta.setAttribute("aria-hidden", "true");
            }
        });

        if (vaiAbrir) {
            pergunta.classList.add("aberta");
            pergunta.setAttribute("aria-expanded", "true");
            resposta.setAttribute("aria-hidden", "false");
        }
    };

    pergunta.addEventListener("click", alternarPergunta);
    pergunta.addEventListener("keydown", (evento) => {
        if (evento.key !== "Enter" && evento.key !== " ") {
            return;
        }

        evento.preventDefault();
        alternarPergunta();
    });
});
