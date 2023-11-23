The approach for finding perfect games of Pack it! is divided into two stages.

1) We must find an area decomposition for NxN, that is, we want a sequence of pairs (a_i, b_i) with the following properties:

- (sum over i of a_i * b_i) == N*N 
- For every i we have 1 <= a_i, b_i <= N 
- For every i we have a_i*b_i is either i or i + 1.

2) Once an area decomposition is found, we attempt to place it without overlap by using the idea of Marijn's Order Interval encoding, which is implemented in my eznf personal library.
