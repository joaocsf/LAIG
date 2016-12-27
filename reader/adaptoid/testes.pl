/*TESTES*/

testAddGarra :- tabuleiro(A), addGarra(A,branco,0,B), addGarra(B,preto,0,C), desenharTabuleiro(C).

testAddPerna :- tabuleiro(A), addPerna(A,branco,0,B), addPerna(B,preto,0,C), desenharTabuleiro(C).

testEsfomeados :-   tabuleiro2(A), removeEsfomeados(A,branco,Removidos,B), desenharTabuleiro(B), write('Removidos:'), write(Removidos),
                    nl, removeEsfomeados(B,preto,R2,C), desenharTabuleiro(C) , write('Removidos:'), write(R2).

testMove :- tabuleiro2(A), desenharTabuleiro(A), moverPeca(A,1,branco,2,B), desenharTabuleiro(B), nl, removeEsfomeados(B,branco,Rem,C),  desenharTabuleiro(C), write('Removidos:'), write(Rem),nl, removeEsfomeados(C,preto,Remo,D), desenharTabuleiro(D) , write('Removidos:'), write(Remo).

testCapturar :- tabuleiro2(A), moverPeca(A,1,branco,2,B), capturar(B,1,branco,1,C), desenharTabuleiro(C).

testM :- tabuleiro2(A), moverPeca(A,1,branco,2,B), moverPeca(B,1,branco,1,C), desenharTabuleiro(C).

testIDs :-  tabuleiro(A), getNewIndex(A,branco,0,X), write('Next id is : '), write(X), tabuleiro2(B),
            getNewIndex(B,preto,0,Y), write(' Next id is : '), write(Y).

testAddPeca :- tabuleiro(A), addCorpo(A,branco,2,3,B), desenharTabuleiro(B), write('Oi oi'), ! ,addCorpo(B,preto,1,3,_).

testDica :- dica.
