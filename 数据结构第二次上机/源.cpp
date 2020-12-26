#include<iostream>

using namespace std;

//记录矩阵长宽
#define N 4
//初始化矩阵（记录迭代k+1次的x值）
double x0[N] = { 0,0,0,0 };
//此矩阵用来记录迭代k次的x值
double xx[N] = { 0,0,0,0 };

//sum_J函数用来计算求和后的值
double sum_J(int i,double a[N][N])
{
	double result = 0.0;
	for (int j = 0; j<N  ;j++)
	{
		if (j != i)
		{
			result += a[i][j] * x0[j]; 
		}
	}
	return  result;
}
//雅克比迭代
void Jacobi(double a[N][N],double b[N])
{
	int num = 1;
	for (int i = 0; i < N; i++)
	{
		x0[i] = (b[i] - sum_J(i, a)) / a[i][i];
	}
}
//对雅克比迭代进行判断
void judgment_J(double a[N][N],double b[N])
{
	int num = 1;
	while (abs(x0[N - 1] - xx[N - 1]) > 0.03)
	{
		for (int k = 0; k < N; k++)
		{
			xx[k] = x0[k];
		}
		Jacobi(a, b);
		num = num + 1;
	}
	cout << "Jacobi:" << endl;
	cout << "迭代" << num << "次后的结果：" << endl;
	for (int k = 0; k < N; k++)
	{
		cout << x0[k] << "   ";
	}
	cout << endl;
	cout << "------------------------------------------------" << endl; 
}


//sum_G函数依旧用来计算求和后的值
double sum_G(int i, double a[N][N],  double x0[N])
{
	double  sum = 0.0;
	for (int j = 0; j <= i - 1; j++)
	{
		sum = sum + a[i][j] * x0[j];
	}
	for (int j = i + 1; j < N; j++)
		{
		sum = sum + a[i][j] * x0[j];
		}
	return sum;

}
//高斯-赛德尔迭代
void  Gauss_Seided(double a[N][N], double b[N])
{
		for (int i = 0; i < N; i++)
		{
			x0[i]=(b[i] - sum_G(i, a, x0)) / a[i][i];
		}
}
//对高斯-赛德尔迭代进行判断
void judgment_G(double a[N][N], double b[N])
{
	int num = 1;
	while (abs(x0[N - 1] - xx[N - 1]) > 0.03)
	{
		for (int k = 0; k < N; k++)
		{
			xx[k] = x0[k];
		}
		Gauss_Seided(a, b);
		num = num + 1;
	}
	cout << "Gauss_Seided:" << endl;
	cout << "迭代" << num << "次后的结果：" << endl;
	for (int k = 0; k < N; k++)
	{
		cout << x0[k] << "   ";
	}
	cout << endl;
	cout << "------------------------------------------------" << endl;
}

//sum_S依旧进行公式中的求和
double sum_S(int i, double a[N][N], double x0[N])
{
	double sum= 0.0;
	for (int j = 0; j <= i - 1; j++)
	{
		sum = sum + a[i][j] * x0[j];
	}
	for (int j = i + 1; j < N; j++)
	{
		sum = sum + a[i][j] * x0[j];
	}
	return sum;
}
//超松弛迭代
void SOR(double a[N][N],double b[N],double w)
{
	for (int i = 0; i < N; i++)
	{
		x0[i] = w * (b[i] - sum_S(i, a, x0)) / a[i][i] + (1 - w) * x0[i];
	}
}
//对超松弛迭代进行判断
void judgment_S(double a[N][N], double b[N], double w)
{
	int num = 1;
	while (abs(x0[N - 1] - xx[N - 1]) > 0.03)
	{
		for (int k = 0; k < N; k++)
		{
			xx[k] = x0[k];
		}
		SOR(a, b, w);
		num = num + 1;
	}
	cout << "SOR:" << endl;
	cout << "迭代" << num << "次后的结果：" << endl;
	for (int k = 0; k < N; k++)
	{
		cout << x0[k] << "   ";
	}
	cout << endl;
	cout << "------------------------------------------------" << endl;
}


int main()
{
	//系数矩阵
	double A[N][N] = {5,1,-1,-2,
					  2,8,1,3,
					  1,-2,-4,-1,
					 -1,3,2,7};

	//常数矩阵
	double B[N] = {-2,-6,6,12}; 

	//定义松弛因子
	double w = 1.15;

	//jacobi迭代法

	Jacobi(A,B);
	judgment_J(A, B);

	//Gauss_seidel迭代法

    Gauss_Seided(A, B);
	judgment_G(A, B);

	//SOR迭代法

	SOR( A, B, w);
	judgment_S(A, B, w);
}