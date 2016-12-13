clearScreen :- consuela(60).

consuela(0).
consuela(N):- nl, N1 is N - 1, consuela(N1).
sair.

lerPosicao(X,Y) :-  write('Indique a letra '), read(Cena), charDic(Cena,Y), write('Indique o numero '), read(X), nl.

adaptoidLogo :- write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|                   _             _        _     _       |'), nl,
                write('|          /\\      | |           | |      (_)   | |      |'), nl,
                write('|         /  \\   __| | __ _ _ __ | |_ ___  _  __| |      |'), nl,
                write('|        / /\\ \\ / _` |/ _` | \'_ \\| __/ _ \\| |/ _` |      |'), nl,
                write('|       / ____ \\ (_| | (_| | |_) | || (_) | | (_| |      |'), nl,
                write('|      /_/    \\_\\__,_|\\__,_| .__/ \\__\\___/|_|\\__,_|      |'), nl,
                write('|                          | |                           |'), nl,
                write('|                          |_|                           |'), nl,
                write('|                                                        |'), nl.

adaptoid :-  clearScreen,
            write(' -------------------------------------------------------- '), nl,adaptoidLogo,
            write('|                                                        |'), nl,
            write('|                                                        |'), nl,
            write('|                                                        |'), nl,
            write('|                        WELCOME!                        |'), nl,
            write('|                                                        |'), nl,
            write('|                                                        |'), nl,
            write('| Made By:                                               |'), nl,
            write('|     David Azevedo up201405846                          |'), nl,
            write('|     Joao Ferreira up201404332                          |'), nl,
            write('|                                                        |'), nl,
            write('|                Press enter to continue!                |'), nl,
            write(' -------------------------------------------------------- '), nl,
            get_char(_), startMenu.

startMenu :-    clearScreen,
                write(' -------------------------------------------------------- '), nl,adaptoidLogo,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|   Escolha uma das seguintes opcoes :                   |'), nl,
                write('|                                                        |'), nl,
                write('|     1. Jogar                                           |'), nl,
                write('|     2. Tutorial                                        |'), nl,
                write('|     3. Sobre                                           |'), nl,
                write('|     4. Sair                                            |'), nl,
                write('|                                                        |'), nl,
                write('|                Press enter to continue!                |'), nl,
                write(' -------------------------------------------------------- '), nl,
                get_char(A), get_char(_),%How to tirar apenas um character de input
                (A = '1' -> jogarMenu;
                A = '2' -> tutorialMenu;
                A = '3' -> aboutMenu;
                A = '4' -> sair;
                startMenu).

jogarMenu :-    clearScreen,
                write(' -------------------------------------------------------- '), nl,adaptoidLogo,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|   Escolha uma das seguintes opcoes :                   |'), nl,
                write('|                                                        |'), nl,
                write('|     1. Humano vs Humano                                |'), nl,
                write('|     2. Humano vs Computador                            |'), nl,
                write('|     3. Computador vs Computador                        |'), nl,
                write('|     4. Sair                                            |'), nl,
                write('|                                                        |'), nl,
                write('|                Press enter to continue!                |'), nl,
                write(' -------------------------------------------------------- '), nl,
                get_char(A), get_char(_),%How to tirar apenas um character de input
                (A = '1' -> jogar(hh);
                A = '2' -> escolherDificuldadePC;
                A = '3' -> escolherDificuldade2PC;
                A = '4' -> startMenu;
                jogarMenu).

escolherDificuldadePC :-    clearScreen,
                write(' -------------------------------------------------------- '), nl,adaptoidLogo,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|   Escolha a dificuldade do Computador :                |'), nl,
                write('|                                                        |'), nl,
                write('|     1. Ofensivo                                        |'), nl,
                write('|     2. Defensivo                                       |'), nl,
                write('|     3. Sair                                            |'), nl,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|                Press enter to continue!                |'), nl,
                write(' -------------------------------------------------------- '), nl,
                get_char(A), get_char(_),%How to tirar apenas um character de input
                (A = '1' -> jogar(hOp);
                A = '2' -> jogar(hRe);
                A = '3' -> jogarMenu;
                escolherDificuldadePC).

escolherDificuldade2PC :-    clearScreen,
                write(' -------------------------------------------------------- '), nl,adaptoidLogo,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|   Escolha as dificuldades dos Computadores :           |'), nl,
                write('|                                                        |'), nl,
                write('|     1. Ofensivo vs Ofensivo                            |'), nl,
                write('|     2. Defensivo vs Defensivo                          |'), nl,
                write('|     3. Ofensivo vs Desenfivo                           |'), nl,
                write('|     4. Sair                                            |'), nl,
                write('|                                                        |'), nl,
                write('|                Press enter to continue!                |'), nl,
                write(' -------------------------------------------------------- '), nl,
                get_char(A), get_char(_),%How to tirar apenas um character de input
                (A = '1' -> jogar(opOp);
                A = '2' -> jogar(reRe);
                A = '3' -> jogar(opRe);
                A = '4' -> jogarMenu;
                escolherDificuldade2PC).

aboutMenu :-    clearScreen,
                write(' -------------------------------------------------------- '), nl,
                write('|                  |  Sobre Adaptoid  |                  |'), nl,
                write('|                                                        |'), nl,
                write('|  Adaptoid e um jogo de tabuleiro para dois jogadores,  |'), nl,
                write('|  constituido por um tabuleiro hexagonal, que contem    |'), nl,
                write('|  (37 espacos), e por um conjunto de criaturas denomi-  |'), nl,
                write('|  nadas de \'adaptoid\'. Cabe a cada jogador evoluir o    |'), nl,
                write('|  seu boneco adicionando membros, garras e pernas, ao   |'), nl,
                write('|  corpo do adaptoid. Os membros sao fatores decisivos,  |'), nl,
                write('|  pois fazem variar o comportamento do adaptoid. As ga- |'), nl,
                write('|  rras definem o dano e as pernas a capacidade de movi- |'), nl,
                write('|  mento. Cada turno divide-se em 3 fases distintas,     |'), nl,
                write('|  sendo elas, movimento, crescimento e alimentacao.     |'), nl,
                write('|  Durante a fase de movimento o jogador pode mover um   |'), nl,
                write('|  dos seus adaptoids tantas vezes quantas pernas este   |'), nl,
                write('|  possuir. Apenas pode mover a sua peca para espacos    |'), nl,
                write('|  vazios. Pode ainda capturar uma peca inimiga no caso  |'), nl,
                write('|  de encontrar ao lado deste e possuir um numero supe-  |'), nl,
                write('|  rior de garras. Se ambos possuirem o memsmo numero    |'), nl,
                write('|  ambos morrem e ambos os jogadores recebem um ponto.   |'), nl,
                write('|                                                        |'), nl,
                write('|                         (1/2)                          |'), nl,
                write('|                Press enter to continue!                |'), nl,
                write(' -------------------------------------------------------- '), nl,
                get_char(_), aboutMenu2.

aboutMenu2 :-   clearScreen,
                write(' -------------------------------------------------------- '), nl,
                write('|                  |  Sobre Adaptoid  |                  |'), nl,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|  Na fase de crescimento o jogador pode optar por um de |'), nl,
                write('|  dois casos possiveis, ou cria um novo corpo adjacente |'), nl,
                write('|  a um dos seus adaptoids existentes, ou entao adiciona |'), nl,
                write('|  uma perna, ou garra, a uma das suas pecas previamente |'), nl,
                write('|  criadas.                                              |'), nl,
                write('|  Na fase de alimentacao, e verifacada em cada peca do  |'), nl,
                write('|  inimigo se ela esta com fome, ou seja, o numero de    |'), nl,
                write('|  espacos vazios a sua volta tera que ser igual ou      |'), nl,
                write('|  maior ao numero de membros totais do adaptoid. No ca- |'), nl,
                write('|  so de fome, a peca inimiga morre, esta e removida e   |'), nl,
                write('|  e atribuido um ponto ao jogador.                      |'), nl,
                write('|  Ganha o primeiro jogador a alcancar os 5 pontos ou    |'), nl,
                write('|  se um jogadores perder todos os seus adaptoids perde  |'), nl,
                write('|  independemente dos pontos.                            |'), nl,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|                                                        |'), nl,
                write('|                         (2/2)                          |'), nl,
                write('|                Press enter to continue!                |'), nl,
                write(' -------------------------------------------------------- '), nl,
                get_char(_), startMenu.

tutorialMenu :-     clearScreen,
                write(' -------------------------------------------------------- '), nl,
                write('|                     |  Tutorial  |                     |'), nl,
                write('|                                                        |'), nl,
                write('|   Se considerar x o seu adaptoid, as orientacoes sao   |'), nl,
                write('|                     defenidas por:                     |'), nl,
                write('|                                                        |'), nl,
                write('|                       ( 5 )( 0 )                       |'), nl,
                write('|                     ( 4 )( X )( 1 )                    |'), nl,
                write('|                       ( 3 )( 2 )                       |'), nl,
                write('|                                                        |'), nl,
                write('| Na fase de movimento devera escolher qual a sua opcao: |'), nl,
                write('|                                                        |'), nl,
                write('| -Mover(m): Escolhendo as coordenadas do seu adaptoid e |'), nl,
                write('|            defenindo as sucessivas orientacoes.        |'), nl,
                write('| -Capturar(c):Escolhendo as coordenadas do seu adaptoid |'), nl,
                write('|              e defenindo a orientacao do adaptoid      |'), nl,
                write('|              inimigo                                   |'), nl,
                write('| -Skip(s): Passar a frente esta fase.                   |'), nl,
                write('|                                                        |'), nl,
                write('| Na fase de evolucao, devera escolher uma das opcoes:   |'), nl,
                write('|                                                        |'), nl,
                write('| -Adicionar Perna(p): Escolhendo as coordenadas do      |'), nl,
                write('|                      adaptoid ao qual sera adicionada  |'), nl,
                write('|                      uma perna.                        |'), nl,
                write('| -Adicionar Garra(g): Escolhendo as coordenadas do      |'), nl,
                write('|                      adaptoid ao qual sera adicionada  |'), nl,
                write('|                      uma garra.                        |'), nl,
                write('| -Adicionar Corpo(c): Escolhendo as coordenadas do      |'), nl,
                write('|                      adaptoid adjacente ao qual sera   |'), nl,
                write('|                      adicionado o corpo e a sua        |'), nl,
                write('|                      orientacao.                       |'), nl,
                write('| -Skip(s): Passar a frente esta fase.                   |'), nl,
                write('|                                                        |'), nl,
                write('|                Press enter to continue!                |'), nl,
                write(' -------------------------------------------------------- '), nl,
                get_char(_),
                startMenu.
