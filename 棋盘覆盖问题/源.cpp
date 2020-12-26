#include<iostream>

#define MAX 100

int k;
int x, y;
//求解问题的表示
int board[MAX][MAX];
//L形骨牌的编号，从1开始
int tile = 1;

using namespace std;

//(tr,tc)表示一个象限左上角方格的坐标，(dr,dc)表示特殊方格的坐标
void ChessBoard(int tr, int tc, int dr, int dc,int size)
{
	if (size == 1)
	{
		//递归出口
		return;
	}
	//取出一个L形骨牌，赋予一个编号
	int t = tile++;
	//分割棋盘，size是棋盘的行数和列数
	int s = size / 2;
	//考虑左上角象限并判断特殊方格是否在此象限
	if (dr < tr + s && dc < tc + s)
	{
		ChessBoard(tr, tc, dr, dc, s);
	}
	//如果没有特殊方格，则用在其右下角放一个方格作为特殊方格
	else
	{
		board[tr + s - 1][tc + s - 1] = t;
		//将右下角的方格作为特殊方格继续处理该象限
		ChessBoard(tr, tc, tr + s - 1, tc + s - 1, s);
	}
	//考虑右上角象限并判断特殊方格是否在此象限
	if (dr < tr + s && dc >= tc + s)
	{
		ChessBoard(tr, tc + s, dr, dc, s);
	}
	else
	{
		board[tr + s - 1][tc + s] = t;
		ChessBoard(tr, tc + s, tr + s - 1, tc + s, s);
	}
	//考虑左下角象限并判断特殊方格是否在此象限
	if (dr >=tr + s && dc <tc + s)
	{
		ChessBoard(tr+s, tc, dr, dc, s);
	}
	else
	{
		board[tr + s][tc + s-1] = t;
		ChessBoard(tr+s, tc, tr + s, tc + s-1, s);
	}
	//考虑右下角象限并判断特殊方格是否在此象限
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
