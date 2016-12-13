/*---------------------------------------------*/
/*Predicado que realiza uma jogada do computador dependendo do seu modo de jogo*/
jogadaComputador(Cor,Modo,jogo(A,B,Tab),JogoF) :-   desenharJogo(A,B,Tab), nl,
                                                    imprimeVez(Cor), !,
                                                    escolheMelhorJogada(jogo(A,B,Tab), Cor,Modo, JogoF).
/*---------------------------------------------*/
/*Predicado que retorna um jogo para uma determinada cor*/
jogadaBot(JogoI,Cor,JogoF) :-   lerRegraM(Cor,_,JogoI,J1),
                                lerRegraE(Cor,_,J1,J2),
                                famintos(J2,Cor,JogoF).
/*---------------------------------------------*/
/*Predicado que escolhe a melhor jogada*/
escolheMelhorJogada(JogoI,Cor,Modo,JogoF):- findall(Jogo,jogadaBot(JogoI,Cor,Jogo),Possibilidades),
                                            avaliarJogada(JogoI,Cor,Possibilidades,Modo,JogoF).
/*---------------------------------------------*/
/*Predicados que avaliam a melhor jogada dependendo do modo de jogo*/
avaliarJogada(JI,C,P,op,J) :- avaliarJogadaOp(JI,C,P,_,J).
avaliarJogada(JI,C,P,notOp,J) :- avaliarJogadaNotOp(JI,C,P,_,J).
/*---------------------------------------------*/
/*Predicados que avaliam o melhor tabuleiro*/
melhorTabuleiro(J1,N1,_,N2,J1,N1) :- N1 > N2, !.
melhorTabuleiro(_,_,J2,N2,J2,N2).
/*---------------------------------------------*/
/*Predicados que devolve pontuacao dependendo do numero de pontos efectuados*/
getValueByPoints(jogo(_,_,_),branco,jogo(5,_,_),100,_).
getValueByPoints(jogo(_,_,_),preto,jogo(_,5,_),100,_).
getValueByPoints(jogo(A,B,_),branco,jogo(A1,B1,_),Value,M) :- Adif is A1 - A, Bdif is B1 - B, V1 is Adif - Bdif, Value is V1 * M.
getValueByPoints(jogo(A,B,_),preto,jogo(A1,B1,_),Value,M) :- Adif is A1 - A, Bdif is B1 - B, V1 is Bdif - Adif, Value is V1 * M.



/*---------------------------------------------*/
/*Predicados que devolve pontuacao dependendo do numero de pecas*/
getValueByPecas(_, Cor, Pos, 100,_):-  corInv(Cor, CorOponente), getPecasByCor(Pos,CorOponente,0).

getValueByPecas(JogoI, Cor, Pos, Value,M):-   getPecasByCor(JogoI,Cor,PecasInicial), !,
                                            getPecasByCor(Pos,Cor,PecasFinal), !,
                                            V1 is PecasFinal - PecasInicial,
                                            ((V1 > 0, PecasFinal == M) -> Value is 10;
                                            (V1 > 0, PecasFinal < M) -> Value is 10;
                                            (V1 < 0, PecasFinal == M) -> Value is 0;
                                            (V1 < 0, PecasFinal < M) -> Value is -5;
                                            Value is -10).
/*---------------------------------------------*/
/*Predicado que devolve pontuacao dependendo do numero de pecas a morrer a fome*/
getValueByStarving(_,Cor,Pos,Value,M):- getStarvingNum(Pos,Cor,Res),
                                        V1 is 0 - Res,
                                        Value is V1 * M.
/*---------------------------------------------*/
/*Predicado que devolve pontuacao dependendo do numero de pernas*/
getValueByPernas(_,Cor,Pos,Value,M1,M2):-   getPernaNum(Pos,Cor,V1,Res),
                                        V2 is V1 * M1, V3 is Res * M2, Value is V2 + V3.
/*---------------------------------------------*/
/*Predicado que devolve pontuacao dependendo do numero de garras*/
getValueByGarras(_,Cor,Pos,Value,M1,M2):-   getGarraNum(Pos,Cor,V1,Res),
                                        V2 is V1 * M1, V3 is Res * M2, Value is V2 + V3.

/*---------------------------------------------*/
/*Predicados que devolve pontuacao dependendo de movimento ocorrido*/
getValueByMovimento(jogo(_,_,T1), Cor, jogo(_,_,T2), M,M):- getMoveu(T1,T2,Cor,N), N > 0, !.
getValueByMovimento(_, _, _, -10,_).


/*---------------------------------------------*/
/*Predicados que devolve pontuacao dependendo de aproximacao ao inimigo*/
getValueByCloser(jogo(_,_,Tab),Cor,jogo(_,_,Pos),M,M):- corInv(Cor,CorInimigo), findall(IDinimigo,(getSimboloXY(Tab,[IDinimigo,CorInimigo,GI,_],XInimigo,YInimigo),
                                                        getSimboloXY(Tab,[ID,Cor,_,_],Xinicial,Yinicial), getSimboloXY(Pos,[ID,Cor,GF,_],Xfinal,Yfinal), GF >= GI,
                                                        dist(XInimigo,YInimigo,Xinicial,Yinicial,DistInicial),
                                                        dist(XInimigo,YInimigo,Xfinal,Yfinal,DistFinal), DistFinal < DistInicial),Elems),
                                                        length(Elems,Res), Res > 0.
getValueByCloser(_,_,_,-10,_).

/*---------------------------------------------*/
/*Predicados que devolvem pontuacao total do tabuleiro*/
getValue(JogoI,Cor,Pos,Value):- getValueByPoints(JogoI,Cor,Pos,V1,15),
                                getValueByPecas(JogoI,Cor,Pos,V2,3),
                                getValueByStarving(JogoI,Cor,Pos,V3,50),
                                getValueByPernas(JogoI,Cor,Pos,V4,5,10),
                                getValueByGarras(JogoI,Cor,Pos,V5,5,10),
                                getValueByMovimento(JogoI,Cor,Pos,V6,10),
                                getValueByCloser(JogoI,Cor,Pos,V7,100),
                                somarLista([V1,V2,V3,V4,V5,V6,V7],Value).

getValue2(JogoI,Cor,Pos,Value):- getValueByPoints(JogoI,Cor,Pos,V1,15),
                                getValueByPecas(JogoI,Cor,Pos,V2,5),
                                getValueByStarving(JogoI,Cor,Pos,V3,-1),
                                getValueByPernas(JogoI,Cor,Pos,V4,10,15),
                                getValueByGarras(JogoI,Cor,Pos,V5,10,15),
                                getValueByMovimento(JogoI,Cor,Pos,V6,10),
                                getValueByCloser(JogoI,Cor,Pos,V7,-20),
                                somarLista([V1,V2,V3,V4,V5,V6,V7],Value).

/*---------------------------------------------*/
/*Predicadoss que avaliam a melhor jogada no momento*/
avaliarJogadaOp(JogoI,_,[],-2000,JogoI).
avaliarJogadaOp(JogoI,Cor,[Pos|Possibilidades],N,JogoF) :-  avaliarJogadaOp(JogoI,Cor,Possibilidades,N1,J1),
                                                            getValue(JogoI,Cor,Pos,Value), melhorTabuleiro(J1,N1,Pos,Value,JogoF,N).
avaliarJogadaNotOp(JogoI,_,[],-2000,JogoI).
avaliarJogadaNotOp(JogoI,Cor,[Pos|Possibilidades],N,JogoF) :-   avaliarJogadaNotOp(JogoI,Cor,Possibilidades,N1,J1),
                                                                getValue2(JogoI,Cor,Pos,Value), melhorTabuleiro(J1,N1,Pos,Value,JogoF,N).
