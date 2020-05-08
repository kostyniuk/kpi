.global lab1
.syntax unified
#define A #7
#define B #5
#define C #4
lab1:
push {lr}
mov r0, A
mov r1, B
mov r2, C
add r0, r1 // a+b
lsr r0, r0, #1 // (a+b)/2
mov r3, #1
factorial:
cmp r2, #1 // is done or not
beq sum
mul r3, r2
sub r2, #1 // -= 1
b factorial
sum:
add r0, r3
pop {pc}
