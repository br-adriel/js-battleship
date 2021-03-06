import Gameboard from "../factories/Gameboard";
import Ship from "../factories/Ship";
import novoElemento from "../utilidades/novoElemento";
import "./telaPosicionarBarcos.scss";
import formPosicao from "./formPosicao";
import tabuleiroHtml from "./tabuleiroHtml";
import telaProxJogador from "./telaProxJogador";
import mostrarTela from "../utilidades/mostrarTela";
import Erros from "./Erros";
// eslint-disable-next-line import/no-cycle
import telaJogar from "./telaJogar";

const linhas = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function adicionarNaviosPC(navios, tabuleiro) {
  let index = 0;
  while (navios.length > index) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 2);

    try {
      tabuleiro.addShip(navios[index], [x, y], h);
      index += 1;
    } catch (err) {
      //
    }
  }
  return tabuleiro;
}

function telaPosicionarBarcos(jogadores = [], tabuleiros = []) {
  const tab1 = Gameboard();
  let tab2 = Gameboard();

  const navios = [
    Ship(5, "porta-aviões"),
    Ship(4, "navio de guerra"),
    Ship(3, "cruzador"),
    Ship(2, "destruidor"),
    Ship(1, "submarino"),
  ];
  let indexNavios = 0;

  if (jogadores[1].type === "code") {
    tab2 = adicionarNaviosPC(navios, tab2);
  }

  const idTab = "tab1";
  const t1 = tabuleiroHtml(idTab);

  // interface para adicionar barco
  const h2 = novoElemento("h2");
  h2.innerText = jogadores[0].name;

  const p = novoElemento("p");
  p.innerText = "Posicione suas embarcações";

  const mensagensErro = Erros();

  const embarcacao = novoElemento("p", "", ["embarcacao"]);
  embarcacao.innerText = `${navios[indexNavios].name.toUpperCase()} (tamanho ${
    navios[indexNavios].length
  })`;

  const form = formPosicao();
  const divForm = novoElemento("div", "", ["adicionar-barco"]);

  const btnContinuar = novoElemento("button");
  btnContinuar.innerText = "Continuar";
  btnContinuar.addEventListener("click", () => {
    if (jogadores[1].type === "code") {
      tabuleiros.push(tab1);
      tabuleiros.push(tab2);

      mostrarTela(telaJogar(jogadores, tabuleiros));
    } else {
      tabuleiros.push(tab1);

      if (tabuleiros.length === 2) {
        const proxTela = telaJogar(jogadores.reverse(), tabuleiros.reverse());
        mostrarTela(telaProxJogador(jogadores[0].name, proxTela));
      } else {
        const proxTela = telaPosicionarBarcos(jogadores.reverse(), tabuleiros);
        mostrarTela(telaProxJogador(jogadores[0].name, proxTela));
      }
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    try {
      const x = linhas.indexOf(form.linha.value.toUpperCase());
      const y = Number(form.coluna.value) - 1;
      const h = !form.vertical.checked;

      tab1.addShip(navios[indexNavios], [x, y], h);

      form.reset();
      form.linha.focus();
      for (let i = 0; i < navios[indexNavios].length; i += 1) {
        let div;
        if (h) {
          div = document.getElementById(`${idTab}-${x}-${y + i}`);
        } else {
          div = document.getElementById(`${idTab}-${x + i}-${y}`);
        }
        div.classList.add("barco");
        div.innerText = navios[indexNavios].length;
      }

      indexNavios += 1;
      // Verifica se os navios acabaram
      if (navios.length <= indexNavios) {
        divForm.removeChild(divForm.childNodes[4]);
        divForm.removeChild(divForm.childNodes[3]);
        divForm.removeChild(divForm.childNodes[2]);
        divForm.removeChild(divForm.childNodes[1]);
        divForm.appendChild(btnContinuar);
      } else {
        embarcacao.innerText = `${navios[
          indexNavios
        ].name.toUpperCase()} (tamanho ${navios[indexNavios].length})`;
      }
    } catch (err) {
      if (/exceeds the length/g.test(err)) {
        mensagensErro.novaMensagem(
          "A embarcação extrapola a largura do tabuleiro"
        );
      } else if (/exceeds the height/g.test(err)) {
        mensagensErro.novaMensagem(
          "A embarcação extrapola a altura do tabuleiro"
        );
      } else if (/already a ship/g.test(err)) {
        mensagensErro.novaMensagem(
          "Já há uma embarcação onde você está tentando posicionar"
        );
      } else {
        mensagensErro.novaMensagem("Um erro ocorreu");
      }
    }
  });

  divForm.appendChild(h2);
  divForm.appendChild(p);
  divForm.appendChild(mensagensErro.elemento);
  divForm.appendChild(embarcacao);
  divForm.appendChild(form);

  const telaPosicionar = novoElemento("section", "tela-posicionar");
  telaPosicionar.appendChild(divForm);
  telaPosicionar.appendChild(t1);

  return telaPosicionar;
}

export default telaPosicionarBarcos;
