#include<iostream>

#define MAX 100

int k;
int x, y;
//�������ı�ʾ
int board[MAX][MAX];
//L�ι��Ƶı�ţ���1��ʼ
int tile = 1;

using namespace std;

//(tr,tc)��ʾһ���������ϽǷ�������꣬(dr,dc)��ʾ���ⷽ�������
void ChessBoard(int tr, int tc, int dr, int dc,int size)
{
	if (size == 1)
	{
		//�ݹ����
		return;
	}
	//ȡ��һ��L�ι��ƣ�����һ�����
	int t = tile++;
	//�ָ����̣�size�����̵�����������
	int s = size / 2;
	//�������Ͻ����޲��ж����ⷽ���Ƿ��ڴ�����
	if (dr < tr + s && dc < tc + s)
	{
		ChessBoard(tr, tc, dr, dc, s);
	}
	//���û�����ⷽ�������������½Ƿ�һ��������Ϊ���ⷽ��
	else
	{
		board[tr + s - 1][tc + s - 1] = t;
		//�����½ǵķ�����Ϊ���ⷽ��������������
		ChessBoard(tr, tc, tr + s - 1, tc + s - 1, s);
	}
	//�������Ͻ����޲��ж����ⷽ���Ƿ��ڴ�����
	if (dr < tr + s && dc >= tc + s)
	{
		ChessBoard(tr, tc + s, dr, dc, s);
	}
	else
	{
		board[tr + s - 1][tc + s] = t;
		ChessBoard(tr, tc + s, tr + s - 1, tc + s, s);
	}
	//�������½����޲��ж����ⷽ���Ƿ��ڴ�����
	if (dr >=tr + s && dc <tc + s)
	{
		ChessBoard(tr+s, tc, dr, dc, s);
	}
	else
	{
		board[tr + s][tc + s-1] = t;
		ChessBoard(tr+s, tc, tr + s, tc + s-1, s);
	}
	//�������½����޲��ж����ⷽ���Ƿ��ڴ�����
	if (dr >= tr + s && dc >=tc + s)
	{
		ChessBoard(tr + s, tc+s, dr, dc, s);
	}
	else
	{
		board[tr + s][tc + s] = t;
		ChessBoard(tr + s, tc+s, tr + s, tc + s , s);
	}
}

int main()
{
	k = 3;
	x = 1, y = 2;
	int size = 1 << k;
	ChessBoard(0, 0, x, y, size);
	for (int i = 0; i < size; i++)
	{
		for (int j = 0; j < size; j++)
		{
			printf("%4d", board[i][j]);
		}
		cout << endl;
	}
	return 0;
}
