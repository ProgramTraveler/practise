#include <stdio.h>
int c[10], n = 7, tot = 0, arrange[10][10] = {0}, flag;
void print(int a)
{
    char date[10][10] = {"����һ", "���ڶ�", "������", "������", "������", "������", "������"};
    printf("%s\t", date[a]);
}
void search(int cur)
{
    int i = 0;
    if (cur == n)
    {
        printf("\n��\tǮ\t��\t��\t��\t��\t��\n");
        for (int j = 0; j < 7; j++)
        {
            print(c[j]-1);
        }
        tot++;
    }
    else
    {
        i = 0;
        for (i = 0; i < n; i++)
        {
            if (arrange[cur][i] > 0)
            {
                flag = 1;
                c[cur] = arrange[cur][i];
                for (int j = 0; j < cur; j++)
                {
                    if (c[cur] == c[j])
                    {
                        flag = 0;
                        break;
                    }
                }
                if (flag)
                {
                    search(cur + 1);
                }
            }
        }
    }
}
int main()
{
    printf("������Ϣ������\n");
    printf("���������ֱ�ʾ\n");
    printf("����0���س�����������һ����\n");
    for (int i = 0; i < 7; i++)
    {
         int j=0;
        printf("�����%d����\n",i+1);
        for(j=0;j<7;j++)
        {
            scanf("%d",&arrange[i][j]);
            if(arrange[i][j]==0)
            {
                break;
            }
        }
    }
    search(0);
    printf("\n%d", tot);
    return 0;
}
