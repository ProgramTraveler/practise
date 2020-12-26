#include<stdio.h>
#include<math.h>
int main()
{
    int n, a, b, i;
    printf("请输入一个正偶数:\n");
    while (scanf("%d", &n) == 1)     //循环扫描是否有键盘输入
    {
        if (n % 2 == 0 && n >= 0)      //判断输入的为正偶数
        {
            if (n != 2)                //不为2时的情况
            {
                printf("该正偶数可以拆分为:\n");
                for (a = 2; a <= n / 2; a++)            //从2开始到输入数的一般，每个都试一遍
                {
                    for (i = 2; i <= sqrt(a); i++)      //判断这个数从2开始到自己的开方，有没有能整除的
                        if (a%i == 0)                   //有则说明不是素数，跳出循环；无则说明是素数
                            break;
                    if (i == (int)sqrt(a) + 1)          //如果a为素数（sqrt()为浮点型，要转换成整形）
                    {
                        for (i = 2, b = n - a; i <= sqrt(b); i++)     //同上，判断b是否为素数
                            if (b%i == 0)
                                break;
                        if (i == (int)sqrt(b) + 1)       //b为素数则输出a和b
                            printf("%d %d\n", a, b);
                    }
                }
            }
            else                            //当键盘输入为2时
            {
                printf("2是素数不能拆分\n");
            }

        }
        else                                //当键盘输入不为正偶数时
        {
            printf("输入的数不是正偶数\n");
        }
    }

    return 0;
}
