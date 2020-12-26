#include <iostream>
#include <queue>
#include <stack>
#include <stdlib.h>

using namespace std;
using namespace std;

#define Maxsize 100

int Data[Maxsize];

typedef int KeyType;

typedef int InfoType;

typedef struct
{
    KeyType key;
    InfoType info;
}Type;

typedef struct
{
    Type r[Maxsize + 1];
    int len;
}Sqlist;


void Create(Sqlist& L, int n)
{
    L.len = n;
    for (int i = 1; i <= n; i++)
    {
        cin >> L.r[i].key;
        L.r[i].info = 0;
    }
}

void Print(Sqlist L)
{
    cout << "序列为：";
    for (int i = 1; i <= L.len; i++)
        cout << L.r[i].key << ' ';
    cout << endl;
}

void Bubble_sort(Sqlist& L)
{
    Type p;
    for (int i = 1; i <= L.len; i++)
        for (int j = i + 1; j <= L.len; j++)
            if (L.r[i].key > L.r[j].key)
            {
                p = L.r[i];
                L.r[i] = L.r[j];
                L.r[j] = p;
            }
}

int Select_Min_Key(Sqlist L, int i)
{
    int k = i;
    Type minn = L.r[i];
    for (int j = i; j <= L.len; j++)
        if (L.r[j].key < minn.key)
        {
            minn = L.r[j];
            k = j;
        }
    return k;
}

void Select_Min_sort(Sqlist& L)
{
    Type p;
    for (int i = 1; i <= L.len; i++)
    {
        int j = Select_Min_Key(L, i);
        if (i != j)
        {
            p = L.r[i];
            L.r[i] = L.r[j];
            L.r[j] = p;
        }
    }
}

void Shell_pre(Sqlist& L, int d)
{
    int j;
    for (int i = d + 1; i <= L.len; i++)
        if (L.r[i].key < L.r[i - d].key)
        {
            L.r[0] = L.r[i];
            for (j = i - d; j > 0 && (L.r[0].key < L.r[j].key); j -= d)
                L.r[j + d] = L.r[j];
            L.r[j + d] = L.r[0];
        }
}

int Reverse( Sqlist L)
{
    int i = 0;
    int k = L.len / 2;
    while (k)
    {
        Data[i++] = k;
        k = k >> 1;
    }
    return i;
}

void Shell_sort(Sqlist& L, int t)
{
    for (int i = 0; i < t; i++)
        Shell_pre(L, Data[i]);
}

int QS_slove(Sqlist& L, int low, int high)
{
    int p;
    L.r[0] = L.r[low];
    p = L.r[low].key;
    while (low < high)
    {
        while (low < high && L.r[high].key >= p)
            high--;
        L.r[low] = L.r[high];
        while (low < high && L.r[high].key <= p)
            low++;
        L.r[high] = L.r[low];
    }
    L.r[low] = L.r[0];
    return low;
}

void Q_sort1(Sqlist& L, int low, int high)
{
    int p = 0;
    if (low < high)
    {
        p = QS_slove(L, low, high);
        Q_sort1(L, low, p - 1);
        Q_sort1(L, p + 1, high);
    }
}

void Q_sort2(Sqlist& L,int min,int max)
{
    int k =L.r[min].key;
    int i = min;
    int j = max;
    int temp;

    typedef struct node
    {
        int min;
        int max;
    }Node;
    Node Stack[Maxsize];
    int top = 0;
    Stack[top].min = min;
    Stack[top].max = max;
    while (top > -1)
    {
        // min max记录当前处理的这个区间的左极限和右极限
        i = min = Stack[top].min;
        j = max = Stack[top].max;
        top--;
        k = L.r[min].key;
        while (i < j)
        {
            while (i < j && k <= L.r[j].key)
            {
                j--;
            }
            if (i < j)
            {
                temp = L.r[i].key;
                L.r[i].key = L.r[j].key;
                L.r[j].key = temp;
                i++;
            }
            while (i < j && k >= L.r[i].key)
            {
                i++;
            }
            if (i < j)
            {
                temp = L.r[i].key;
                L.r[i].key = L.r[j].key;
                L.r[j].key = temp;
                j--;
            }
            if (min < i - 1)
            {
                top++;
                Stack[top].min = min;
                Stack[top].max = i - 1;
            }
            if (max > i + 1)
            {
                top++;
                Stack[top].min = i + 1;
                Stack[top].max = max;
            }
        }
    }
}

void Quick_sort1(Sqlist& L)
{
    Q_sort1(L, 1, L.len);
}

void Quick_sort2(Sqlist &L)
{
    Q_sort2(L, 1, L.len);
}

typedef Sqlist HeapType;

void Heap_adjust(HeapType& H, int s, int m)
{
    Type rc = H.r[s];
    for (int j = 2 * s; j <= m; j *= 2)
    {
        if (j < m && (H.r[j].key < H.r[j + 1].key))
            j++;
        if (rc.key >= H.r[j].key)
            break;
        H.r[s] = H.r[j];
        s = j;
    }
    H.r[s] = rc;
}

void Heap_sort(Sqlist& H)
{
    Type p;
    for (int i = H.len / 2; i > 0; i--)
        Heap_adjust(H, i, H.len);
    for (int i = H.len; i > 1; i--)
    {
        p = H.r[1];
        H.r[1] = H.r[i];
        H.r[i] = p;
        Heap_adjust(H, 1, i - 1);
    }
}

int main()
{
    Sqlist L;
    int t;
    int n;
    cout << "请输入要排序的个数n：" << endl;;
    cin >> n;
    cout << "请输入n个数，回车结束" << endl;
    Create(L, n);
    Print(L);
    cout << "创建完毕" << endl;

    cout << "冒泡排序结果：" << endl;
    Bubble_sort(L);
    Print(L);
    
    cout << "简单选择排序结果：" << endl;
    Select_Min_sort(L);
    Print(L);
    
    cout << "希尔排序结果：" << endl;
    t = Reverse( L);
    Shell_sort(L, t);
    Print(L);

    cout << "快速排序结果（递归）：" << endl;
    Quick_sort1(L);
    Print(L);

    cout << "快速排序结果（非递归）：" << endl;
    Quick_sort2(L);
    Print(L);

    cout << "堆排序结果：" << endl;
    Heap_sort(L);
    Print(L);

    return 0;
}