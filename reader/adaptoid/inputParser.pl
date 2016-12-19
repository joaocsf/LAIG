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

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).
parse_input(move(X,_,_),Res) :- move(X,Res).
parse_input(tabuleiro,T) :- tabuleiro(T).
parse_input(isTabuleiro(T),yes) :- tabuleiro(T).
parse_input(isTabuleiro(_),no).
parse_input(initGame,yes).
parse_input(gameEnd(A,B,Tab),Jogador) :- ganhou(Jogador,jogo(A,B,Tab)) , !.
parse_input(gameEnd(_,_,_),no).

%ATENCAO! ENVIAR RESPOSTAS EM VETORES -> [] PARA FACILITAR JAVASCRIPT
test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
