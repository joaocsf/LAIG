%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here parse_input(+Request,-Response)

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).
parse_input(move(X,_,_),Res) :- move(X,Res).
parse_input(tabuleiro,T) :- tabuleiro(T).
parse_input(isTabuleiro(T),yes) :- tabuleiro(T).
parse_input(isTabuleiro(_),no).
parse_input(initGame,yes).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

move(2,yes).
move(_,no).



tabuleiro( [
            [zero,um,dois,tres,quatro],
            [a,vazio,vazio,vazio,vazio,cinco],
      		[b,vazio,vazio,vazio,vazio,vazio,seis],
      		[c,vazio,vazio,vazio,vazio,vazio,vazio,sete],
      		[d,vazio,[0,branco,0,0],vazio,vazio,vazio,[0,preto,0,0],vazio],
			[e,#,vazio,vazio,vazio,vazio,vazio,vazio],
      		[f,#,#,vazio,vazio,vazio,vazio,vazio],
      		[g,#,#,#,vazio,vazio,vazio,vazio]
           ]
          ).
