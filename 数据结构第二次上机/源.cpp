#include<iostream>

using namespace std;

//��¼���󳤿�
#define N 4
//��ʼ�����󣨼�¼����k+1�ε�xֵ��
double x0[N] = { 0,0,0,0 };
//�˾���������¼����k�ε�xֵ
double xx[N] = { 0,0,0,0 };

//sum_J��������������ͺ��ֵ
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
//�ſ˱ȵ���
void Jacobi(double a[N][N],double b[N])
{
	int num = 1;
	for (int i = 0; i < N; i++)
	{
		x0[i] = (b[i] - sum_J(i, a)) / a[i][i];
	}
}
//���ſ˱ȵ��������ж�
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
	cout << "����" << num << "�κ�Ľ����" << endl;
	for (int k = 0; k < N; k++)
	{
		cout << x0[k] << "   ";
	}
	cout << endl;
	cout << "------------------------------------------------" << endl; 
}


//sum_G������������������ͺ��ֵ
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
//��˹-���¶�����
void  Gauss_Seided(double a[N][N], double b[N])
{
		for (int i = 0; i < N; i++)
		{
			x0[i]=(b[i] - sum_G(i, a, x0)) / a[i][i];
		}
}
//�Ը�˹-���¶����������ж�
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
	cout << "����" << num << "�κ�Ľ����" << endl;
	for (int k = 0; k < N; k++)
	{
		cout << x0[k] << "   ";
	}
	cout << endl;
	cout << "------------------------------------------------" << endl;
}

//sum_S���ɽ��й�ʽ�е����
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
//���ɳڵ���
void SOR(double a[N][N],double b[N],double w)
{
	for (int i = 0; i < N; i++)
	{
		x0[i] = w * (b[i] - sum_S(i, a, x0)) / a[i][i] + (1 - w) * x0[i];
	}
}
//�Գ��ɳڵ��������ж�
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
	cout << "����" << num << "�κ�Ľ����" << endl;
	for (int k = 0; k < N; k++)
	{
		cout << x0[k] << "   ";
	}
	cout << endl;
	cout << "------------------------------------------------" << endl;
}


int main()
{
	//ϵ������
	double A[N][N] = {5,1,-1,-2,
					  2,8,1,3,
					  1,-2,-4,-1,
					 -1,3,2,7};

	//��������
	double B[N] = {-2,-6,6,12}; 

	//�����ɳ�����
	double w = 1.15;

	//jacobi������

	Jacobi(A,B);
	judgment_J(A, B);

	//Gauss_seidel������

    Gauss_Seided(A, B);
	judgment_G(A, B);

	//SOR������

	SOR( A, B, w);
	judgment_S(A, B, w);
}