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

tabuleiro3( [
            [zero,um,dois,tres,quatro],
            [a,vazio,vazio,vazio,vazio,cinco],
    		[b,vazio,vazio,vazio,vazio,vazio,seis],
    		[c,vazio,vazio,vazio,vazio,vazio,vazio,sete],
    		[d,vazio,[0,branco,5,1],vazio,vazio,vazio,[0,preto,0,3],vazio],
			[e,#,vazio,vazio,vazio,vazio,vazio,vazio],
    		[f,#,#,vazio,vazio,vazio,vazio,vazio],
    	    [g,#,#,#,vazio,vazio,vazio,vazio]
         ]
        ).

tabuleiro2( [
            [zero,um,dois,tres,quatro],
            [a,[1,branco,3,2],vazio,vazio,vazio,cinco],
    		[b,vazio,vazio,[2,preto,3,2],vazio,vazio,seis],
    		[c,vazio,vazio,vazio,vazio,vazio,vazio,sete],
    		[d,vazio,[0,branco,0,0],vazio,vazio,vazio,[0,preto,0,0],vazio],
			[e,#,vazio,vazio,vazio,vazio,vazio,vazio],
    		[f,#,#,vazio,vazio,vazio,vazio,[1,preto,3,2]],
    		[g,#,#,#,vazio,vazio,vazio,vazio]
         ]
        ).

desenharCor(branco) :- write('X').
desenharCor(preto) :- write('O').

desenharMember(0,_):- write('').
desenharMember(N,S):- N > 0, N < 6, write(S), N1 is N - 1, desenharMember(N1,S).
desenharMember(6,S):- write(S),write(S),write(S),write(S),write(S).

desenharMemberC(6,S):- write(S).
desenharMemberC(N,_):- N < 6, write(' ').

desenharEspaco(0):- write('').
desenharEspaco(N):- N > 0, N < 6, write(' '), N1 is N - 1, desenharEspaco(N1).
desenharEspaco(_):- write('').
desenharResto(N):-  R is 5-N, desenharEspaco(R).

desenharC(a):-      write('              ').
desenharC(b):-      write('          ').
desenharC(c):-      write('       ').
desenharC(d):-      write('   ').
desenharC(e):-      write('       ').
desenharC(f):-      write('          ').
desenharC(g):-      write('              ').
desenharC(#):-      write('').
desenharC(zero):-   desenharC(a).
desenharC(vazio):-  write('/     \\ ').
desenharC([_,_,B,_]):-  write('/'),
                        desenharMember(B,'Y'),
                        desenharResto(B),
                        write('\\ ').
desenharC(_):-     write('       ').

desenharM(a):-      write('A-           |').
desenharM(b):-      write('B-       |').
desenharM(c):-      write('C-    |').
desenharM(d):-      write('D-|').
desenharM(e):-      write('E-    |').
desenharM(f):-      write('F-       |').
desenharM(g):-      write('G-           |').
desenharM(#):-      desenharC(#).
desenharM(vazio):-  write('       |').
desenharM(zero):-   desenharC(a).
desenharM([_,A,B,C]):-  write(' '),
                        desenharMemberC(B,'Y'),
                        write(' '),
                        desenharCor(A),
                        write(' '),
                        desenharMemberC(C,'L'),
                        write(' |').
desenharM(_):-      write('       ').

desenharB(a):-      desenharC(a).
desenharB(b):-      desenharC(b).
desenharB(c):-      desenharC(c).
desenharB(d):-      desenharC(d).
desenharB(e):-      desenharC(e).
desenharB(f):-      desenharC(f).
desenharB(g):-      desenharC(g).
desenharB(#):-      desenharC(#).
desenharB(zero):-   desenharC(a).
desenharB(um):-     write('       1').
desenharB(dois):-   write('       2').
desenharB(tres):-   write('       3').
desenharB(quatro):- write('       4').
desenharB(cinco):-  write('    5   ').
desenharB(seis):-   write('    6   ').
desenharB(sete):-   write('    7   ').
desenharB(vazio):-  write('\\     / ').
desenharB([_,_,_,C]):-  write('\\'),
                        desenharMember(C,'L'),
                        desenharResto(C),
                        write('/ ').

desenharS(a):-      desenharC(a).
desenharS(b):-      desenharC(b).
desenharS(c):-      desenharC(c).
desenharS(d):-      desenharC(d).
desenharS(e):-      desenharC(e).
desenharS(f):-      desenharC(f).
desenharS(g):-      desenharC(g).
desenharS(#):-      desenharC(#).
desenharS(zero):-   desenharC(a).
desenharS(vazio):-      write(' ¯¯¯¯¯  ').
desenharS([_,_,_,_]):-  write(' ¯¯¯¯¯  ').
desenharS(um):-     write('      / ').
desenharS(dois):-   write('      / ').
desenharS(tres):-   write('      / ').
desenharS(quatro):- write('      / ').
desenharS(_):-      write('   /    ').

desenharLinhaC([X|Xs]):- desenharC(X), desenharLinhaC(Xs).
desenharLinhaC([]):- nl.
desenharLinhaM([X|Xs]):- desenharM(X), desenharLinhaM(Xs).
desenharLinhaM([]):- nl.
desenharLinhaB([X|Xs]):- desenharB(X), desenharLinhaB(Xs).
desenharLinhaB([]):- nl.
desenharLinhaS([X|Xs]):- desenharS(X), desenharLinhaS(Xs).
desenharLinhaS([]):- nl.

desenharLinha(A):- desenharLinhaC(A) , desenharLinhaM(A) , desenharLinhaB(A), desenharLinhaS(A).
desenharLinha([]):- write('').

desenharTabuleiro( [ X | Xs ]) :- desenharLinha(X), desenharTabuleiro(Xs).
desenharTabuleiro([]) :- nl.
