#include "calculator.h"
#include <stdio.h>
using namespace std;

Calculator calc;
int main(void)
{
double num1;
double num2;
char op;
printf("Enter first number: ");
scanf("%lf",&num1);
printf("Enter second number: ");
scanf("%lf",&num2);
printf("Operation ( + or - ): ");
while ((op = getchar()) != EOF)
{
if (op == '+')
{
printf("%6.2lf\n", calc.Add(num1, num2));
break;
}
else if(op == '-')
{
printf("%6.2lf\n", calc.Sub(num1, num2));
break;
}
}
return 0;
}
