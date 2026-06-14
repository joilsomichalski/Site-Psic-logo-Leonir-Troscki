const cardsEmocoes = document.querySelectorAll(".emocao");

const linksRolagemInterna = document.querySelectorAll('a[href^="#"]');

linksRolagemInterna.forEach((link) => {
    link.addEventListener("click", (evento) => {
        const idDestino = link.getAttribute("href");

        if (!idDestino || idDestino === "#") {
            return;
        }

        const destino = document.querySelector(idDestino);

        if (!destino) {
            return;
        }

        const reduzirMovimento = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        evento.preventDefault();
        destino.scrollIntoView({
            behavior: reduzirMovimento ? "auto" : "smooth",
            block: "start",
        });
        history.pushState(null, "", idDestino);
    });
});

cardsEmocoes.forEach((cardSelecionado) => {
    const btnAbrir = cardSelecionado.querySelector(".btn-saiba-mais");
    const btnFechar = cardSelecionado.querySelector(".btn-fechar");

    btnAbrir.addEventListener("click", () => {
        const posicaoAntesDeAbrir = cardSelecionado.getBoundingClientRect().top;

        cardsEmocoes.forEach((card) => {
            if (card !== cardSelecionado) {
                card.classList.add("oculta");
            }
        });

        cardSelecionado.classList.add("aberta");

        requestAnimationFrame(() => {
            const posicaoDepoisDeAbrir = cardSelecionado.getBoundingClientRect().top;

            window.scrollBy({
                top: posicaoDepoisDeAbrir - posicaoAntesDeAbrir,
                left: 0,
                behavior: "auto",
            });
        });
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
    let arrastandoProcesso = false;
    let arrastouProcesso = false;
    let inicioArrasteProcesso = 0;

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

    const mostrarProcessoAnterior = () => {
        primeiroCardVisivel = Math.max(0, primeiroCardVisivel - 1);
        atualizarCarrossel();
    };

    const mostrarProcessoProximo = () => {
        if (cardsProcesso.length <= quantidadeVisivel) {
            return;
        }

        primeiroCardVisivel =
            (primeiroCardVisivel + 1) % cardsProcesso.length;
        atualizarCarrossel();
    };

    const finalizarArrasteProcesso = (evento) => {
        if (!arrastandoProcesso) {
            return;
        }

        arrastandoProcesso = false;
        carrosselProcesso.classList.remove("arrastando");

        if (typeof carrosselProcesso.releasePointerCapture === "function") {
            try {
                carrosselProcesso.releasePointerCapture(evento.pointerId);
            } catch {
                // Alguns navegadores liberam o ponteiro automaticamente.
            }
        }

        const distanciaArrastada = evento.clientX - inicioArrasteProcesso;
        const limiteArraste = 45;

        if (Math.abs(distanciaArrastada) < limiteArraste) {
            return;
        }

        if (distanciaArrastada < 0) {
            mostrarProcessoProximo();
            return;
        }

        mostrarProcessoAnterior();
    };

    window.addEventListener("resize", atualizarCarrossel);

    btnAnterior.addEventListener("click", () => {
        mostrarProcessoAnterior();
    });

    btnProximo.addEventListener("click", () => {
        mostrarProcessoProximo();
    });

    carrosselProcesso.addEventListener("pointerdown", (evento) => {
        if (evento.target.closest(".btn-carrossel-processo")) {
            return;
        }

        arrastandoProcesso = true;
        arrastouProcesso = false;
        inicioArrasteProcesso = evento.clientX;
        carrosselProcesso.classList.add("arrastando");

        if (typeof carrosselProcesso.setPointerCapture === "function") {
            carrosselProcesso.setPointerCapture(evento.pointerId);
        }
    });

    carrosselProcesso.addEventListener("pointermove", (evento) => {
        if (!arrastandoProcesso) {
            return;
        }

        if (Math.abs(evento.clientX - inicioArrasteProcesso) > 8) {
            arrastouProcesso = true;
        }
    });

    carrosselProcesso.addEventListener("pointerup", finalizarArrasteProcesso);
    carrosselProcesso.addEventListener("pointercancel", finalizarArrasteProcesso);
    carrosselProcesso.addEventListener("pointerleave", finalizarArrasteProcesso);

    carrosselProcesso.addEventListener(
        "click",
        (evento) => {
            if (!arrastouProcesso) {
                return;
            }

            evento.preventDefault();
            evento.stopPropagation();
            arrastouProcesso = false;
        },
        true
    );

    atualizarCarrossel();
}

const listaTerapias = document.querySelector(".lista-terapias");

if (listaTerapias) {
    const cardsTerapias = Array.from(listaTerapias.querySelectorAll(".terapias"));
    const controlesTerapias = document.createElement("div");
    const btnTerapiasAnterior = document.createElement("button");
    const btnTerapiasProximo = document.createElement("button");
    let indiceTerapiaAtual = 0;
    let arrastandoTerapias = false;
    let arrastouTerapias = false;
    let inicioArrasteTerapias = 0;
    let scrollInicialTerapias = 0;
    let indiceInicialArrasteTerapias = 0;

    controlesTerapias.className = "carrossel-terapias-controles";
    btnTerapiasAnterior.type = "button";
    btnTerapiasProximo.type = "button";
    btnTerapiasAnterior.className =
        "btn-carrossel-terapias btn-carrossel-terapias-anterior";
    btnTerapiasProximo.className =
        "btn-carrossel-terapias btn-carrossel-terapias-proximo";
    btnTerapiasAnterior.setAttribute("aria-label", "Mostrar terapia anterior");
    btnTerapiasProximo.setAttribute("aria-label", "Mostrar próxima terapia");
    btnTerapiasAnterior.textContent = "<";
    btnTerapiasProximo.textContent = ">";
    controlesTerapias.append(btnTerapiasAnterior, btnTerapiasProximo);
    listaTerapias.insertAdjacentElement("afterend", controlesTerapias);

    const terapiasTemRolagem = () =>
        listaTerapias.scrollWidth > listaTerapias.clientWidth + 2;

    const atualizarControlesTerapias = () => {
        const podeNavegar = cardsTerapias.length > 1 && terapiasTemRolagem();

        controlesTerapias.hidden = !podeNavegar;

        if (!podeNavegar) {
            listaTerapias.scrollTo({ left: 0 });
            indiceTerapiaAtual = 0;
            return;
        }

        btnTerapiasAnterior.disabled = cardsTerapias.length <= 1;
        btnTerapiasProximo.disabled = cardsTerapias.length <= 1;
    };

    const obterLarguraCardTerapia = () =>
        cardsTerapias[0]?.offsetWidth || listaTerapias.clientWidth || 1;

    const normalizarIndiceTerapia = (indice) => {
        if (cardsTerapias.length === 0) {
            return 0;
        }

        return ((indice % cardsTerapias.length) + cardsTerapias.length) %
            cardsTerapias.length;
    };

    const atualizarIndiceTerapiaPeloScroll = () => {
        const larguraCard = obterLarguraCardTerapia();

        indiceTerapiaAtual = Math.min(
            Math.max(Math.round(listaTerapias.scrollLeft / larguraCard), 0),
            cardsTerapias.length - 1
        );
    };

    const irParaTerapia = (indice) => {
        indiceTerapiaAtual = normalizarIndiceTerapia(indice);

        const cardAtual = cardsTerapias[indiceTerapiaAtual];

        if (cardAtual && terapiasTemRolagem()) {
            listaTerapias.scrollTo({
                left: cardAtual.offsetLeft - listaTerapias.offsetLeft,
                behavior: "smooth",
            });
        }

        atualizarControlesTerapias();
    };

    const finalizarArrasteTerapias = (evento) => {
        if (!arrastandoTerapias) {
            return;
        }

        arrastandoTerapias = false;
        listaTerapias.classList.remove("arrastando");

        if (typeof listaTerapias.releasePointerCapture === "function") {
            try {
                listaTerapias.releasePointerCapture(evento.pointerId);
            } catch {
                // Alguns navegadores liberam o ponteiro automaticamente.
            }
        }

        const distanciaArrastada = evento.clientX - inicioArrasteTerapias;
        const limiteArraste = 45;

        if (Math.abs(distanciaArrastada) >= limiteArraste) {
            irParaTerapia(
                distanciaArrastada < 0
                    ? indiceInicialArrasteTerapias + 1
                    : indiceInicialArrasteTerapias - 1
            );
            return;
        }

        atualizarIndiceTerapiaPeloScroll();
        irParaTerapia(indiceTerapiaAtual);
    };

    btnTerapiasAnterior.addEventListener("click", () => {
        irParaTerapia(indiceTerapiaAtual - 1);
    });

    btnTerapiasProximo.addEventListener("click", () => {
        irParaTerapia(indiceTerapiaAtual + 1);
    });

    listaTerapias.addEventListener("scroll", () => {
        if (!terapiasTemRolagem()) {
            return;
        }

        atualizarIndiceTerapiaPeloScroll();
        atualizarControlesTerapias();
    });

    listaTerapias.addEventListener("pointerdown", (evento) => {
        if (!terapiasTemRolagem() || evento.target.closest("button")) {
            return;
        }

        arrastandoTerapias = true;
        arrastouTerapias = false;
        inicioArrasteTerapias = evento.clientX;
        scrollInicialTerapias = listaTerapias.scrollLeft;
        indiceInicialArrasteTerapias = indiceTerapiaAtual;
        listaTerapias.classList.add("arrastando");

        if (typeof listaTerapias.setPointerCapture === "function") {
            listaTerapias.setPointerCapture(evento.pointerId);
        }
    });

    listaTerapias.addEventListener("pointermove", (evento) => {
        if (!arrastandoTerapias || !terapiasTemRolagem()) {
            return;
        }

        const distancia = evento.clientX - inicioArrasteTerapias;

        if (Math.abs(distancia) > 8) {
            arrastouTerapias = true;
        }

        listaTerapias.scrollLeft = scrollInicialTerapias - distancia;
    });

    listaTerapias.addEventListener("pointerup", finalizarArrasteTerapias);
    listaTerapias.addEventListener("pointercancel", finalizarArrasteTerapias);
    listaTerapias.addEventListener("pointerleave", finalizarArrasteTerapias);

    listaTerapias.addEventListener(
        "click",
        (evento) => {
            if (!arrastouTerapias) {
                return;
            }

            evento.preventDefault();
            evento.stopPropagation();
            arrastouTerapias = false;
        },
        true
    );

    window.addEventListener("resize", atualizarControlesTerapias);
    atualizarControlesTerapias();
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
        ".btn-saiba-mais",
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
                rootMargin: "0px 0px -8% 0px",
                threshold: 0.08,
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

const carrosseisDepoimentos = document.querySelectorAll(".carrossel-depoimentos");

carrosseisDepoimentos.forEach((carrosselDepoimentos) => {
    const janelaDepoimentos = carrosselDepoimentos.parentElement;
    const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );
    const velocidadeAutomatica = 15;
    const direcaoAutomatica = carrosselDepoimentos.classList.contains(
        "carrossel-doctoralia"
    ) ? 1 : -1;
    const velocidadeMaximaArraste = 1200;
    let distanciaLoopDepoimentos = 0;
    let posicaoDepoimentos = 0;
    let velocidadeInercia = 0;
    let arrastandoDepoimentos = false;
    let ponteiroAtivo = null;
    let ultimaPosicaoPonteiro = 0;
    let ultimoTempoPonteiro = 0;
    let ultimoTempoAnimacao = performance.now();
    let mouseSobreCarrossel = false;
    let quantidadeDepoimentosOriginais = 0;
    let frameRedimensionamento = 0;

    if (!janelaDepoimentos) {
        return;
    }

    carrosselDepoimentos.classList.add("carrossel-controlado-js");
    carrosselDepoimentos.querySelectorAll("img").forEach((imagem) => {
        imagem.draggable = false;
    });

    const obterDepoimentosOriginais = () =>
        Array.from(carrosselDepoimentos.querySelectorAll(".depoimento")).filter(
            (depoimento) => !depoimento.classList.contains("depoimento-clone")
        );

    const normalizarPosicaoDepoimentos = (posicao) => {
        if (!distanciaLoopDepoimentos) {
            return posicao;
        }

        let posicaoNormalizada = posicao;

        while (posicaoNormalizada <= -distanciaLoopDepoimentos) {
            posicaoNormalizada += distanciaLoopDepoimentos;
        }

        while (posicaoNormalizada > 0) {
            posicaoNormalizada -= distanciaLoopDepoimentos;
        }

        return posicaoNormalizada;
    };

    const renderizarCarrosselDepoimentos = () => {
        carrosselDepoimentos.style.transform =
            `translate3d(${posicaoDepoimentos}px, 0, 0)`;
    };

    const atualizarMedidasCarrosselDepoimentos = () => {
        const estilosCarrossel = getComputedStyle(carrosselDepoimentos);
        const espacoEntreCards = parseFloat(estilosCarrossel.columnGap) || 0;
        const larguraJanelaCarrossel = janelaDepoimentos.clientWidth;
        let quantidadeVisivelDepoimentos = 1;
        let larguraCard = Math.max(
            230,
            Math.min(larguraJanelaCarrossel * 0.72, 320)
        );

        if (larguraJanelaCarrossel > 1100) {
            quantidadeVisivelDepoimentos = 4;
        } else if (larguraJanelaCarrossel > 820) {
            quantidadeVisivelDepoimentos = 3;
        } else if (larguraJanelaCarrossel > 560) {
            quantidadeVisivelDepoimentos = 2;
        }

        if (quantidadeVisivelDepoimentos > 1) {
            larguraCard =
                (larguraJanelaCarrossel -
                    espacoEntreCards * (quantidadeVisivelDepoimentos - 1)) /
                quantidadeVisivelDepoimentos;
        }

        carrosselDepoimentos.style.setProperty(
            "--largura-card-depoimento",
            `${larguraCard}px`
        );

        requestAnimationFrame(() => {
            const primeiroClone = carrosselDepoimentos.querySelector(
                ".depoimento-clone"
            );

            if (!primeiroClone) {
                return;
            }

            distanciaLoopDepoimentos = primeiroClone.offsetLeft;
            posicaoDepoimentos = normalizarPosicaoDepoimentos(
                posicaoDepoimentos
            );
            renderizarCarrosselDepoimentos();
        });
    };

    const prepararLoopCarrosselDepoimentos = () => {
        const depoimentosOriginais = obterDepoimentosOriginais();
        const fragmentoClones = document.createDocumentFragment();

        carrosselDepoimentos
            .querySelectorAll(".depoimento-clone")
            .forEach((clone) => clone.remove());

        quantidadeDepoimentosOriginais = depoimentosOriginais.length;

        depoimentosOriginais.forEach((depoimento) => {
            const clone = depoimento.cloneNode(true);

            clone.setAttribute("aria-hidden", "true");
            clone.classList.add("depoimento-clone");
            clone.querySelectorAll("img").forEach((imagem) => {
                imagem.draggable = false;
            });
            fragmentoClones.appendChild(clone);
        });

        carrosselDepoimentos.appendChild(fragmentoClones);
        atualizarMedidasCarrosselDepoimentos();
    };

    prepararLoopCarrosselDepoimentos();

    window.addEventListener("resize", () => {
        cancelAnimationFrame(frameRedimensionamento);
        frameRedimensionamento = requestAnimationFrame(
            atualizarMedidasCarrosselDepoimentos
        );
    });

    const observerNovosDepoimentos = new MutationObserver(() => {
        const totalAtual = obterDepoimentosOriginais().length;

        if (totalAtual !== quantidadeDepoimentosOriginais) {
            prepararLoopCarrosselDepoimentos();
        }
    });

    observerNovosDepoimentos.observe(carrosselDepoimentos, {
        childList: true,
    });

    const limitarVelocidade = (velocidade) =>
        Math.max(
            -velocidadeMaximaArraste,
            Math.min(velocidadeMaximaArraste, velocidade)
        );

    const liberarPonteiroDepoimentos = (evento) => {
        if (
            evento &&
            janelaDepoimentos.hasPointerCapture?.(evento.pointerId)
        ) {
            janelaDepoimentos.releasePointerCapture(evento.pointerId);
        }
    };

    const finalizarArrasteDepoimentos = (evento, manterInercia = true) => {
        if (!arrastandoDepoimentos || evento.pointerId !== ponteiroAtivo) {
            return;
        }

        arrastandoDepoimentos = false;
        ponteiroAtivo = null;
        janelaDepoimentos.classList.remove("arrastando");

        if (!manterInercia || reduzirMovimento.matches) {
            velocidadeInercia = 0;
        }

        liberarPonteiroDepoimentos(evento);
    };

    janelaDepoimentos.addEventListener("pointerdown", (evento) => {
        if (!evento.isPrimary || (evento.pointerType === "mouse" && evento.button !== 0)) {
            return;
        }

        arrastandoDepoimentos = true;
        ponteiroAtivo = evento.pointerId;
        ultimaPosicaoPonteiro = evento.clientX;
        ultimoTempoPonteiro = evento.timeStamp;
        velocidadeInercia = 0;
        janelaDepoimentos.classList.add("arrastando");
        janelaDepoimentos.setPointerCapture?.(evento.pointerId);
    });

    janelaDepoimentos.addEventListener("pointermove", (evento) => {
        if (!arrastandoDepoimentos || evento.pointerId !== ponteiroAtivo) {
            return;
        }

        const deslocamento = evento.clientX - ultimaPosicaoPonteiro;
        const tempoDecorrido = Math.max(evento.timeStamp - ultimoTempoPonteiro, 8);
        const velocidadeInstantanea = (deslocamento / tempoDecorrido) * 1000;

        velocidadeInercia = limitarVelocidade(
            velocidadeInercia * 0.65 + velocidadeInstantanea * 0.35
        );
        posicaoDepoimentos = normalizarPosicaoDepoimentos(
            posicaoDepoimentos + deslocamento
        );
        ultimaPosicaoPonteiro = evento.clientX;
        ultimoTempoPonteiro = evento.timeStamp;
        renderizarCarrosselDepoimentos();
    });

    janelaDepoimentos.addEventListener("pointerup", (evento) => {
        finalizarArrasteDepoimentos(evento);
    });
    janelaDepoimentos.addEventListener("pointercancel", (evento) => {
        finalizarArrasteDepoimentos(evento, false);
    });
    janelaDepoimentos.addEventListener("dragstart", (evento) => {
        evento.preventDefault();
    });
    janelaDepoimentos.addEventListener("mouseenter", () => {
        mouseSobreCarrossel = true;
    });
    janelaDepoimentos.addEventListener("mouseleave", () => {
        mouseSobreCarrossel = false;
    });

    const animarCarrosselDepoimentos = (tempoAtual) => {
        const tempoDecorrido = Math.min(
            (tempoAtual - ultimoTempoAnimacao) / 1000,
            0.05
        );

        ultimoTempoAnimacao = tempoAtual;

        if (!arrastandoDepoimentos && distanciaLoopDepoimentos) {
            if (Math.abs(velocidadeInercia) > 1) {
                posicaoDepoimentos += velocidadeInercia * tempoDecorrido;
                velocidadeInercia *= Math.pow(0.045, tempoDecorrido);
            } else {
                velocidadeInercia = 0;

                if (!mouseSobreCarrossel && !reduzirMovimento.matches) {
                    posicaoDepoimentos +=
                        direcaoAutomatica * velocidadeAutomatica * tempoDecorrido;
                }
            }

            posicaoDepoimentos = normalizarPosicaoDepoimentos(
                posicaoDepoimentos
            );
            renderizarCarrosselDepoimentos();
        }

        requestAnimationFrame(animarCarrosselDepoimentos);
    };

    requestAnimationFrame(animarCarrosselDepoimentos);
});

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
