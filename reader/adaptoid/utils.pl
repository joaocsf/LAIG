/*---------------------------------------------*/
/*Predicados para traduzir a orientacao para offsets*/
oriDic(0,0,-1).
oriDic(1,1,0).
oriDic(2,1,1).
oriDic(3,0,1).
oriDic(4,-1,0).
oriDic(5,-1,-1).
/*---------------------------------------------*/
/*Predicados para traduzir um caracter para o seu index correspondente*/
charDic('A',1).
charDic('B',2).
charDic('C',3).
charDic('D',4).
charDic('E',5).
charDic('F',6).
charDic('G',7).
charDic('a',1).
charDic('b',2).
charDic('c',3).
charDic('d',4).
charDic('e',5).
charDic('f',6).
charDic('g',7).
charDic('0',0).
charDic('1',1).
charDic('2',2).
charDic('3',3).
charDic('4',4).
charDic('5',5).
charDic('6',6).
charDic('7',7).
charDic('8',8).
charDic('9',9).

charDic(_,_) :- invalido.

/*---------------------------------------------*/
/*Predicado para inverter a cor*/
corInv(preto,branco).
corInv(branco,preto).
/*---------------------------------------------*/
/*Predicado indicativo de espacos vazios*/
isVazio(vazio,1) :- !.
isVazio(_,0).
/*---------------------------------------------*/
/*Predicado que valida o adaptoid (Numero de membros nao pode ser superior a 6)*/
validaPeca([_,_,B,C]):- A is B + C, A < 7.
validaPeca(B,C):- A is B + C,A < 7.
/*---------------------------------------------*/
/*Predicado para obter ou o Simbolo ou as coordenadas do tabuleiro*/
getSimboloXY(T,Simbolo,X,Y) :- nth0(Y,T,L) , nth0(X,L,Simbolo).
/*---------------------------------------------*/
/*Predicado para somar uma lista de inteiros*/
somarLista([],0).
somarLista([Head|Tail],Result) :-
    somarLista(Tail,SumOfTail),
    Result is Head + SumOfTail.
/*---------------------------------------------*/
/*Predicado para obter um index inexistente no tabuleiro*/
getNewIndex(Tab,Cor,CurrID,NextID) :-   getSimboloXY(Tab,[CurrID,Cor,_,_],_,_), NID is CurrID + 1, !,
                                        getNewIndex(Tab,Cor,NID,NextID).
getNewIndex(_,_,ID,ID).
/*---------------------------------------------*/
/*Predicados de verificacao do vencedor*/
ganhou(Jogador,jogo(A,B,Tab)) :- ganhou(Jogador,A,B,Tab).
ganhou(Jogador,A,B,_) :-    A >= 5, B < 5, !, Jogador = branco.
ganhou(Jogador,A,B,_) :-    B >= 5, A < 5, !, Jogador = preto.
ganhou(Jogador,A,B,_) :-    A >= 5, B >= 5, Jogador = empate.
ganhou(Jogador,A,B,Tab) :-    \+ getSimboloXY(Tab,[_,preto,_,_],_,_), \+ getSimboloXY(Tab,[_,branco,_,_],_,_), A > B, Jogador = branco.
ganhou(Jogador,A,B,Tab) :-    \+ getSimboloXY(Tab,[_,preto,_,_],_,_), \+ getSimboloXY(Tab,[_,branco,_,_],_,_), A < B, Jogador = preto.
ganhou(Jogador,A,B,Tab) :-    \+ getSimboloXY(Tab,[_,preto,_,_],_,_), \+ getSimboloXY(Tab,[_,branco,_,_],_,_), A is B, Jogador = empate.
ganhou(Jogador,_,_,Tab):-   \+ getSimboloXY(Tab,[_,preto,_,_],_,_), Jogador = branco.
ganhou(Jogador,_,_,Tab):-   \+ getSimboloXY(Tab,[_,branco,_,_],_,_), Jogador = preto.
ganhou(_,_,_,_) :- fail.
/*---------------------------------------------*/
/*Predicado Somador de pontos*/
somarPontos(branco,A,B,A1,B,N) :- A1 is A + N.
somarPontos(preto,A,B,A,B1,N) :- B1 is B + N.
/*---------------------------------------------*/
/*Predicado para obter o numero de Pecas de uma determinada cor existentes no tabuleiro*/
getPecasByCor(jogo(_,_,Tab),Cor,NPecas) :-  findall(ID,getSimboloXY(Tab,[ID,Cor,_,_],_,_),Elementos),
                                            length(Elementos,NPecas).
/*---------------------------------------------*/
/*Predicado para obter o numero de pecas com garras e numero total de garras*/
getGarraNum(jogo(_,_,Tab), Cor, N, Total):-findall(Ng, (getSimboloXY(Tab,[_,Cor,Ng,_],_,_), Ng > 0) , Elementos),
                                    length(Elementos,N), somarLista(Elementos,Total).
/*---------------------------------------------*/
/*Predicado para obter o numero de pecas com pernas e o numero total de pernas*/
getPernaNum(jogo(_,_,Tab), Cor, N, Total):-findall(Np, (getSimboloXY(Tab,[_,Cor,_,Np],_,_), Np > 0) , Elementos),
                                    length(Elementos,N), somarLista(Elementos,Total).
/*---------------------------------------------*/
/*Predicado que determina se determinada peca esta a morrer a fome*/
starving(Tab,ID,Cor) :- getSimboloXY(Tab,[ID,Cor,G,P],X,Y), M is G + P, !,
                        contaVazios(Tab,X,Y,Vazios), Res is Vazios - M, Res < 0.
/*---------------------------------------------*/
/*Predicado para obter o numero de pecas a morrer a fome*/
getStarvingNum(jogo(_,_,Tab),Cor,Res):- findall(ID,starving(Tab,ID,Cor),Elementos),
                                        length(Elementos,Res).
/*---------------------------------------------*/
/*Predicado que determina se um adaptoid de determinada cor mudou de posicao*/
getMoveu(T1,T2,Cor, Res):-findall(ID,(getSimboloXY(T1,[ID,Cor,_,_],X,Y), getSimboloXY(T2, vazio, X,Y) ), Elementos),
                          length(Elementos,Res).
/*---------------------------------------------*/
/*Predicados que valida uma lista de orientacoes*/
validarOri(OriList,P) :- validarOriAux(OriList,P,0).
validarOriAux([O|[]],P,N):- N < P, oriDic(O,_,_).
validarOriAux([Ori|Os],P,Natual):- Natual >= 0, Natual < P,oriDic(Ori,_,_), N1 is Natual + 1, validarOriAux(Os,P,N1).
/*---------------------------------------------*/
/*Predicados que calcula a distancia quadratica entre dois pontos*/
dist(X1,Y1,X,Y,Dist) :- S1 is X1 - X, S2 is Y1 - Y, Q1 is S1 * S1, Q2 is S2 * S2, Dist is Q1 + Q2.
