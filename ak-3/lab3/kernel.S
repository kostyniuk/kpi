.syntax unified
.cpu cortex-m4
//.fpu softvfp
.thumb

.global vtable_kernel
.global __kernel_reset__

.type vtable_kernel, %object
.type __kernel_reset__, %function

.section .interrupt_vector
vtable_kernel:
    .word __stack_start 
    .word __kernel_reset__+1
    .size vtable_kernel, .-vtable_kernel

.section .rodata
    data: .asciz "kernel started!\n"
    final: .asciz "Value in register 4: "

.section .text
__kernel_reset__:
    ldr r0, =data
    bl dbgput_line
    
    // calculate 
        mov r0, #7 // a
        mov r1, #5 // b
        mov r2, #4 // c
        add r4, r0, r1 // a+b
        lsr r4, r4, #1 // (a+b)/2
        mov r3, #1
    factorial:
        cmp r2, #1
        beq sum
        mul r3, r2
        sub r2, #1
        b factorial
    sum:
        add r4, r3

    ldr r0, =final
    bl dbgput
    mov r0, r4
    bl dbgput_num
    
    end:
    b end
