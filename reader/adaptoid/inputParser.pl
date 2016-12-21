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
    jogadaBot(jogo(A,B,Tab),Jogador,jogo(A1,B1,T1),M,E),
    M =.. MovTemp, E =.. EvoTemp,
    parseMovimento(MovTemp,Movimento), parseEvolucao(EvoTemp,Evolucao),
    corInv(Jogador,Cor), getDiffIds(Tab,Cor,T1,Diff),
    Resultado = [A1,B1,Movimento,Evolucao,Diff], !.


parse_input(getMoves(X,Y,Pernas),Pos).

parse_input(isGameOver(A,B,Tab),[Jogador]) :- ganhou(Jogador,jogo(A,B,Tab)) , !.
parse_input(isGameOver(_,_,_),no).

%ATENCAO! ENVIAR RESPOSTAS EM VETORES -> [] PARA FACILITAR JAVASCRIPT
test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

parseMovimento([mover,X,Y,Oris],[1,X,Y,Xf,Yf]):-
    sumOrisToPos(X,Y,Oris,Xf,Yf), !.

parseMovimento([capturar,X,Y,Ori],[2,X,Y,Xf,Yf]) :-
    sumOriToPos(X,Y,Ori,Xf,Yf), !.

parseMovimento([s],[0]) :- !.

parseEvolucao([aC,X,Y,Ori],[3,X,Y,Xf,Yf]) :-
    sumOriToPos(X,Y,Ori,Xf,Yf), !.

parseEvolucao([aP,X,Y],[5,X,Y]) :- !.

parseEvolucao([aG,X,Y],[4,X,Y]) :- !.

parseEvolucao([s],[0]) :- !.

doAction(mover(X,Y,Npernas,Xf,Yf),Jogador,jogo(A,B,Tab),jogo(A1,B1,T1)) :-
    listaOriToPos(Tab,X,Y,Oris,Npernas,Xf,Yf), !,
    lerRegraM(Jogador,mover(X,Y,Oris),jogo(A,B,Tab),jogo(A1,B1,T1)).

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

listaOriToPos(_,X,Y,[],0,X,Y).
listaOriToPos(Tab,Xi,Yi,[Ori|Os],Npernas,Xf,Yf) :-
    oriDic(Ori,IncX,IncY),
    N1 is Npernas - 1,
    N1 >= 0,
    X1 is Xi + IncX,
    Y1 is Yi + IncY,
    getSimboloXY(Tab,vazio,X1,Y1),
    listaOriToPos(Tab,X1,Y1,Os,N1,Xf,Yf).

sumOrisToPos(X,Y,[],X,Y) :- !.
sumOrisToPos(Xi,Yi,[Ori|Os],Xf,Yf) :-
    sumOriToPos(Xi,Yi,Ori,X1,Y1),
    sumOrisToPos(X1,Y1,Os,Xf,Yf).

sumOriToPos(Xi,Yi,Ori,Xf,Yf) :-
    oriDic(Ori,IncX,IncY),
    Xf is Xi + IncX,
    Yf is Yi + IncY, !.


tabuleiro4( [
            [zero,um,dois,tres,quatro],
            [a,vazio,vazio,vazio,[3,preto,0,0],cinco],
    		[b,vazio,vazio,vazio,vazio,vazio,seis],
    		[c,vazio,vazio,vazio,vazio,vazio,vazio,sete],
    		[d,vazio,[0,branco,0,0],vazio,vazio,vazio,[0,preto,0,0],vazio],
			[e,ht,vazio,vazio,vazio,vazio,[1,preto,0,0],vazio],
    		[f,ht,ht,vazio,vazio,vazio,vazio,vazio],
    	    [g,ht,ht,ht,vazio,vazio,[2,preto,0,0],vazio]
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

tabuleiro6( [
            [zero,um,dois,tres,quatro],
            [a,vazio,vazio,vazio,vazio,cinco],
    		[b,vazio,vazio,vazio,vazio,vazio,seis],
    		[c,vazio,vazio,vazio,vazio,vazio,vazio,sete],
    		[d,vazio,vazio,vazio,vazio,obstaculo,vazio,vazio],
			[e,ht,vazio,vazio,vazio,vazio,vazio,vazio],
    		[f,ht,ht,vazio,vazio,vazio,vazio,vazio],
    	    [g,ht,ht,ht,vazio,vazio,vazio,vazio]
         ]
        ).
