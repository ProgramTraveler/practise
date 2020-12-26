//使用第二种边界条件的三次样条插值函数
#include<iostream>

#define n 19     //记录总共的函数个数
#define m 6      //常数
double x[n] = { 0.520,3.1,8.0,17.95,28.65,39.62,50.65,78.0,104.6,156.6,208.6,260.7,321.5,364.4,416.3,468.0,494.0,507.0,520.0 };  //题目中函数x值的所有的点
double xx[4] = {2.30,130,350,515};      //待求的4个x的值         
double y[n] = { 5.288,9.4,13.84,20.20,24.90,28.44,31.10,35.0,36.9,36.6,34.6,31.0,26.34,20.9,14.8,7.8,3.7,1.5,0.2 };   //题目中函数y值的所有点
double x_y[2] = { 1.86548,-0.046115 };    //题目中所給的y.0和y.n的一阶导数
double yy[4];      //用来记录待求4个x的结果
double h[n - 1];   //记录三次样条函数的h值
double u[n - 2];   //记录三次样条函数的u值
double v[n - 2];   //记录三次样条函数拉姆塔的值
double f1[n-1];    //记录三次样条函数的一阶差商
double f2[n - 2];  //记录三次样条函数的二阶差商
double C[n];     //记录最后求得的C的值，也就是 A*X=d 中得d矩阵的值  
double M[n];     //记录最后求得M的值，也就是  A*X=d  中的待求矩阵X的值

using namespace std;

//函数作用：求h的值
void solve_h()
{
	for (int k = 0; k < n - 1; k++)
	{
		h[k] = x[k + 1] - x[k];
	}
}


//函数作用：求u的值和拉姆塔的值
void solve_u_v()
{
	for (int k = 0; k < n - 2; k++)
	{
		v[k] = h[k] / (h[k] + h[k + 1]);
		u[k] = 1 -v[k];
	}
}

//函数作用：求三次样条函数的一阶差商
void solve_f1()
{
	for (int k = 0; k < n - 1; k++)
	{
		//一阶差商计算公式
		f1[k] = (y[k + 1] - y[k]) / (x[k + 1] - x[k]);
	}
}

//函数作用：求三次样条函数的二阶差商
void solve_f2()
{
	for (int k = 0; k < n - 2; k++)
	{
		//二阶差商计算公式
		f2[k] = (f1[k + 1] - f1[k]) / (x[k + 2] - x[k]);
	}
}

//函数作用：计算C的值
void solve_c()
{
	for (int k = 0; k < n ; k++)
	{
		//分三种不同情况求C对应的值（第一个值和最后一个值应该使用不同方法）
		if (k ==0 )
		{

			C[k] = (m/h[k]) * (f1[k] - x_y[0]);
		}
		else
			if (k == n - 1)
			{
				C[k] = (m / h[k - 1]) * (x_y[1] - f1[k - 1]);
			}
			else
			{
				C[k] = m * f2[k-1];
			}
	}
}


//函数作用：求最后待求的M的值（由于矩阵属于三对角矩阵，所以我使用的是追赶法求M的值）  A*X=d
void solve_M()
{
	double l[n ];
	double yyy[n];

	//由于A=L*U，分为L矩阵和U矩阵，但所求矩阵不是很复杂，所以只计算β（贝塔）的值
	l[0] = 1 / 2; 
	for (int k = 1; k < n-1; k++)
	{	
		l[k ] = u[k-1] / (2 - v[k-1] * l[k-1]);
	}

	//求解y矩阵，追的过程 Ly=d
	yyy[0] = C[0]/2;
	for (int k = 1; k < n; k++)
	{
		if (k < n - 1)
		{
			yyy[k] = (C[k] - v[k - 1] * yyy[k - 1]) / (2 - v[k - 1] * l[k - 1]);
		}
		else
		{
			yyy[k] = (C[k] - 1 * yyy[k - 1]) / (2 - 1 * l[k - 1]);
		}
	}
	//求解x矩阵，赶的过程 ux=y
	M[n - 1] = yyy[n - 1];
	for (int k = n - 2; k >= 0; k--)
	{
		M[k] = yyy[k] - M[k + 1] * l[k];
	}
}


//函数作用：将所求的M的值根据情况带入样条函数
void solve_S(int k,int kk)
{
	double  s = (xx[k] - x[kk+1]);
	double ss = (xx[k] - x[kk]);
	yy[k] = (-M[kk] * s * s * s) / (6 * h[kk]) + (M[kk + 1] * ss * ss * ss) / (6 * h[kk]) - (y[kk] - (h[kk] * h[kk] * M[kk] / 6)) * (xx[k] - x[kk + 1]) / h[kk] + (y[kk + 1] -( h[kk] * h[kk] * M[kk + 1] / 6)) * (xx[k] - x[kk])/h[kk];
}

int main()
{

	solve_h();
	solve_u_v();
	solve_f1();
	solve_f2();
	solve_c();
	solve_M();


	//k记录待求函数的值，kk记录待求函数的插入位置，用来判断三次样条函数的范围
	for (int k=0; k < 4; k++)
	{
		for (int kk = 0; kk < n;kk++)
		{
			if (xx[k] >= x[kk] && xx[k] < x[kk + 1])
			{
				solve_S(k, kk);
			}
			else
			{
				continue;
			}
		}
	}

	//输出所求x的对应的y值
	for (int k = 0; k < 4; k++)
	{
		cout << "y" << k+1 << ":" << yy[k] << endl;
	}
	return 0;
}