:- use_module(library(lists)).
:- include('tabuleiro.pl').
:- include('testes.pl').
:- include('logic.pl').
:- include('utils.pl').
:- include('ai.pl').
:- include('menu.pl').

%Predicado que inicia o jogo criando um tabuleiro com as posicoes iniciais e a instancia jogo com ambos os pontos a 0 e o novo tabuleiro criado
init :- write('Comecando o jogo!'),tabuleiro(Tab), asserta(jogo(0,0,Tab)), nl.
%Predicado para terminar e eliminar a instancia de jogo
end :- retract(jogo(_,_,_)), write('Fim do Jogo!'), nl.

%Predicados de desenho do jogo
desenharJogo(A,B,Tab) :- clearScreen, write('|Pontos| Branco(X) : '), write(A), write(' | Preto(O) : '), write(B), nl, desenharTabuleiro(Tab).
desenharJogo(jogo(A,B,Tab)) :- desenharJogo(A,B,Tab).

%Predicados para imprimir o resultado do jogador
imprimeVencedor(branco):- write('Jogador Branco Ganhou! Parabens!'), nl.
imprimeVencedor(preto):- write('Jogador Preto Ganhou! Parabens!'), nl.
imprimeVencedor(empate):- write('Ninguem Ganhou! Empate!'), nl.
imprimeVez(Cor):- write('E a vez do jogador '), write(Cor), write(' jogar!'), nl.

%Predicado para a jogada do jogador branco
jogadaBranco(Jogo,Jogo) :- ganhou(_,Jogo).
jogadaBranco(jogo(A,B,Tab),jogo(A1,B1,T1)) :-   desenharJogo(A,B,Tab),
                                                write('E a vez de branco jogar!'), nl,
                                                jogada(jogo(A,B,Tab),branco,jogo(A1,B1,T1)).

%Predicado para a jogada do jogador preto
jogadaPreto(Jogo,Jogo) :- ganhou(_,Jogo).
jogadaPreto(jogo(A,B,Tab),jogo(A1,B1,T1)) :-    desenharJogo(A,B,Tab),
                                                write('E a vez de preto jogar!'), nl,
                                                jogada(jogo(A,B,Tab),preto,jogo(A1,B1,T1)).

%Predicados que representam uma ronda do jogo
jogando(hh,Jogo) :- retract(jogo(A,B,Tab)), !,
                    jogadaBranco(jogo(A,B,Tab),jogo(A1,B1,T1)), !,
                    jogadaPreto(jogo(A1,B1,T1),jogo(A2,B2,T2)),
                    asserta(jogo(A2,B2,T2)), Jogo = jogo(A2,B2,T2).
jogando(hh,_).
jogando(hOp,Jogo) :- jogando(hc,op,Jogo).
jogando(hRe,Jogo) :- jogando(hc,notOp,Jogo).
jogando(opOp,Jogo):- jogando(cc,Jogo,op,op).
jogando(opRe,Jogo):- jogando(cc,Jogo,op,notOp).
jogando(reRe,Jogo):- jogando(cc,Jogo,notOp,notOp).
jogando(hc,M,Jogo) :- retract(jogo(A,B,Tab)), !,
                    jogadaBranco(jogo(A,B,Tab),jogo(A1,B1,T1)), !,
                    jogadaComputador(preto,M,jogo(A1,B1,T1),jogo(A2,B2,T2)),
                    desenharJogo(A2,B2,T2),
                    asserta(jogo(A2,B2,T2)), Jogo = jogo(A2,B2,T2).
jogando(hc,_,_).
jogando(cc,Jogo,M1,M2) :- retract(jogo(A,B,Tab)), !,
                    jogadaComputador(branco,M1,jogo(A,B,Tab),jogo(A1,B1,T1)),
                    jogadaComputador(preto,M2,jogo(A1,B1,T1),jogo(A2,B2,T2)),
                    desenharJogo(A2,B2,T2), write('Prima /*|ENTER|*\\'), get_char(_),
                    asserta(jogo(A2,B2,T2)), Jogo = jogo(A2,B2,T2).
jogando(cc,_,_,_).

%Loop do Jogo
jogar(Modo) :- init, repeat, once(jogando(Modo,Jogo)), ganhou(Jogador,Jogo), desenharJogo(Jogo), imprimeVencedor(Jogador), end.

%Representa uma jogada individual
jogada(jogo(A,B,Tab),Cor,jogo(A3,B3,T3)):-  imprimeVez(Cor), !, repeat,
                                            movimento(jogo(A,B,Tab),Cor,jogo(A1,B1,T1)),
                                            desenharJogo(A1,B1,T1), !, repeat,
                                            evoluir(jogo(A1,B1,T1),Cor,jogo(A2,B2,T2)), !,
                                            famintos(jogo(A2,B2,T2),Cor,jogo(A3,B3,T3)).

%Predicado para ler a opcao de movimento
movimento(JI,Cor,JF) :- write('Escolha uma opcao - Mover : m | Capturar : c | Skip : s'), nl, !,
                        read(X), acao1(JI,X,Regra), !, lerRegraM(Cor,Regra,JI,JF).
lerRegraM(_,s,Jogo,Jogo).
lerRegraM(Cor,mover(X,Y,Ori),jogo(A,B,Tab),jogo(A,B,T1)) :- getSimboloXY(Tab,[ID,Cor,_,P],X,Y), P > 0,
                                                            validarOri(Ori,P),
                                                            moverPecaLista(Tab,ID,Cor,Ori,T1).
lerRegraM(Cor,capturar(X,Y,Ori), jogo(A,B,Tab), JF) :-  getSimboloXY(Tab,[ID,Cor,G,_],X,Y),
                                                        G > 0,
                                                        capturar(jogo(A,B,Tab),ID,Cor,Ori,JF).

%Predicado para ler a opcao de evolucao
evoluir(Jogo,_,Jogo):- ganhou(_,Jogo).
evoluir(JI,Cor,JF) :-   write('Escolha um opcao - Adicionar Perna : p | Adicionar Garra : g | Adicionar Corpo : c | Skip : s'), nl , !,
                        read(Acao), acao2(Acao,Regra), !, lerRegraE(Cor,Regra,JI,JF).
lerRegraE(_,s,Jogo,Jogo).
lerRegraE(Cor,aP(X,Y),jogo(A,B,Tab),jogo(A,B,T1)):- getSimboloXY(Tab,[ID,Cor,G,P],X,Y),
                                                    (P + G) < 6,
                                                    addPerna(Tab,Cor,ID,T1).
lerRegraE(Cor,aG(X,Y),jogo(A,B,Tab),jogo(A,B,T1)):- getSimboloXY(Tab,[ID,Cor,G,P],X,Y),
                                                    (P + G) < 6,
                                                    addGarra(Tab,Cor,ID,T1).
lerRegraE(Cor,aC(X,Y,Ori),jogo(A,B,Tab),jogo(A,B,T1)):- getSimboloXY(Tab,[ID,Cor,_,_],X,Y),
                                                        addCorpo(Tab,ID,Cor,Ori,T1).

%Predicado para a fase de alimentacao
famintos(Jogo,_,Jogo):- ganhou(_,Jogo).
famintos(jogo(A,B,T),Cor,jogo(A1,B1,T1)) :- corInv(Cor,CI), removeEsfomeados(T,CI,Removidos,T1), somarPontos(Cor,A,B,A1,B1,Removidos).

%Predicados que consuante as pernas da peca do jogador pede uma movimentacao individual
lerOris(0,[]).
lerOris(Npernas,OriList) :- write('Restam-lhe '), write(Npernas), write(' movimento(s), indique uma orientacao[0...5] \'s\' para sair '),
                            read(Ori), (Ori = 's' -> OriList = [];
                            (oriDic(Ori,_,_), N1 is Npernas - 1, lerOris(N1,L), OriList = [Ori|L])).

%Predicado de verificacao de uma jogada valida na fase do movimento
acao1(jogo(_,_,Tab),m,Regra):-  lerPosicao(X,Y),
                                getSimboloXY(Tab,[_,_,_,P],X,Y), lerOris(P,OriList), Regra = mover(X,Y,OriList).
acao1(_,c,Regra):-  lerPosicao(X,Y),
                    write('Indique uma orientacao [0..5]'), read(Ori), oriDic(Ori,_,_), Regra = capturar(X,Y,Ori).
acao1(_,s,s).
acao1(_,_,_) :- invalido.

%Predicado de verificacao de uma jogada valida na fase do evolucao
acao2(p,Regra) :- lerPosicao(X,Y), Regra = aP(X,Y).
acao2(g,Regra) :- acao2(p,aP(X,Y)), Regra = aG(X,Y).
acao2(c,Regra) :- acao2(p,aP(X,Y)), write('Indique uma orientacao [0..5]'),
                  read(Ori), oriDic(Ori,_,_), Regra = aC(X,Y,Ori).

acao2(s,s).
acao2(_,_) :- invalido.
invalido :- write('Opcao Invalida!'), nl, fail.
