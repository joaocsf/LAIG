%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here parse_input(+Request,-Response)
:- ensure_loaded('tabuleiro.pl').
:- ensure_loaded('testes.pl').
:- ensure_loaded('logic.pl').
:- ensure_loaded('utils.pl').
:- ensure_loaded('ai.pl').
:- ensure_loaded('menu.pl').
:- ensure_loaded('adaptoid.pl').

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

parse_input(beginGame,T) :- tabuleiro(T).

parse_input(play(Jogador,jogo(A,B,Tab),Action),Resultado) :-
    doAction(Action,Jogador,jogo(A,B,Tab),jogo(A1,B1,T1)).%Acrescentar o parsing dos dados

parse_input(botPlay(Jogador,Dificuldade,jogo(A,B,Tab)),Resultado) :-
    jogadaComputador(Jogador,Dificuldade,jogo(A,B,Tab),jogo(A1,B1,T1)),
    jogadaBot(jogo(A,B,Tab),Jogador,jogo(A1,B1,T1),Movimento,Evolucao),
    corInv(Jogador,Cor), getDiffIds(Tab,Cor,T1,Diff),
    Resultado = [A1,B1,Movimento,Evolucao,Diff], !.


parse_input(getMoves(X,Y,Pernas),Pos).

parse_input(isGameOver(A,B,Tab),[Jogador]) :- ganhou(Jogador,jogo(A,B,Tab)) , !.
parse_input(isGameOver(_,_,_),no).

%ATENCAO! ENVIAR RESPOSTAS EM VETORES -> [] PARA FACILITAR JAVASCRIPT
test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

doAction(mover(X,Y,Oris),Jogador,jogo(A,B,Tab),jogo(A1,B1,T1)) :-%O que fazer em relacao a lista de orientacoes?
    lerRegraM(Jogador,mover(X,Y,Ori),jogo(A,B,Tab),jogo(A1,B1,T1)).

doAction(capturar(X,Y,Ori),Jogador,jogo(A,B,Tab),jogo(A1,B1,T1)) :-
    lerRegraM(Jogador,capturar(X,Y,Ori),jogo(A,B,Tab),jogo(A1,B1,T1)).

doAction(aC(X,Y,Ori),Jogador,jogo(A,B,Tab),jogo(A1,B1,T1)) :-
    lerRegraE(Jogador,aC(X,Y,Ori),jogo(A,B,Tab),jogo(A1,B1,T1)).

doAction(aG(X,Y),Jogador,jogo(A,B,Tab),jogo(A1,B1,T1)) :-
    lerRegraE(Jogador,aG(X,Y),jogo(A,B,Tab),jogo(A1,B1,T1)).

doAction(aP(X,Y),Jogador,jogo(A,B,Tab),jogo(A1,B1,T1)) :-
    lerRegraE(Jogador,aP(X,Y),jogo(A,B,Tab),jogo(A1,B1,T1)).

getDiffIdsAux([],_,[],[]) :- !.
getDiffIdsAux([[ID,Cor,_,_]|E1s],Cor,[vazio|E2s],Res) :-
    getDiffIdsAux(E1s,Cor,E2s,R1),
    Res = [ID|R1].
getDiffIdsAux([_|E1s],Cor,[_|E2s],Res) :-
    getDiffIdsAux(E1s,Cor,E2s,Res).

getDiffIds([],_,[],[]) :- !.
getDiffIds([L1|L1s],Cor,[L2|L2s],IDs) :-
    getDiffIdsAux(L1,Cor,L2,R1),
    getDiffIds(L1s,Cor,L2s,R2),
    append(R1,R2,IDs), !.

tabuleiro4( [
            [zero,um,dois,tres,quatro],
            [a,vazio,vazio,[3,preto,6,0],vazio,cinco],
    		[b,vazio,vazio,vazio,vazio,vazio,seis],
    		[c,vazio,vazio,vazio,vazio,vazio,vazio,sete],
    		[d,vazio,[0,branco,0,1],vazio,vazio,vazio,[0,preto,1,2],vazio],
			[e,ht,vazio,vazio,vazio,vazio,vazio,vazio],
    		[f,ht,ht,vazio,vazio,[1,preto,2,1],vazio,vazio],
    	    [g,ht,ht,ht,vazio,vazio,vazio,vazio]
         ]
        ).

tabuleiro5( [
            [zero,um,dois,tres,quatro],
            [a,vazio,vazio,vazio,vazio,cinco],
    		[b,vazio,vazio,vazio,vazio,vazio,seis],
    		[c,vazio,vazio,vazio,vazio,vazio,vazio,sete],
    		[d,vazio,[0,branco,5,1],vazio,vazio,vazio,vazio,vazio],
			[e,ht,vazio,vazio,vazio,vazio,vazio,vazio],
    		[f,ht,ht,vazio,vazio,vazio,vazio,vazio],
    	    [g,ht,ht,ht,vazio,vazio,vazio,vazio]
         ]
        ).
/*
oriDic(0,0,-1).
oriDic(1,1,0).
oriDic(2,1,1).
oriDic(3,0,1).
oriDic(4,-1,0).
oriDic(5,-1,-1).
*/
