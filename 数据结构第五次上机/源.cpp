#include<iostream>
#include<vector>
#include <stdio.h>  
#include <conio.h>  
#include <malloc.h>

using namespace std;

#define MAX_NUM 20  

typedef struct ArcNode
{
    int adjvex;
    struct ArcNode* nextarc;
}ArcNode; //��ڵ�

typedef int VertexType; //����Ԫ������

typedef struct VNode
{
    VertexType data;
    ArcNode* firstarc;
}VNode/*ͷ�ڵ�*/, AdjList[MAX_NUM];

typedef int DataType;

#define MAX_VERTEX 4  //4�������ͼ

typedef struct
{
    DataType vertexArr[MAX_VERTEX];       //����Ԫ������	 
    int edgeArr[MAX_VERTEX][MAX_VERTEX]; //�߾����ά���� 
}ArrayGraph;

//��С������
typedef struct Tree 
{
    int vexa;
    int vexb;
    int edge;
};

vector<Tree> tree;

//�����ڽӱ�
void createDgraph(AdjList& g, int n)
{
    ArcNode* p, * q;
    int i, j;
    for (i = 1; i <= n; i++)
    {
        g[i].data = i;
        g[i].firstarc = NULL;
    }
    cout << "����ߵ���Ϣ����A B��ʾA B֮���бߣ�" << endl;
    cin >> i >> j;
    while (i != -1)
    {
        p = (ArcNode*)malloc(sizeof(ArcNode));
        q = (ArcNode*)malloc(sizeof(ArcNode));
        p->adjvex = j;
        p->nextarc = g[i].firstarc;
        g[i].firstarc = p;
        q->adjvex = i;
        q->nextarc = g[j].firstarc;
        g[j].firstarc = q;
        cin >> i >> j;
    }
}

int visited[MAX_NUM] = { 0 };

void DFS(AdjList G, int v)
{
    ArcNode* p;
    visited[v] = 1;
    //printf("%d ", v);
    cout << v<<" ";
    p = G[v].firstarc;
    while (p != NULL)
    {
        if (visited[p->adjvex] == 0)
        {
            //��w=p->adjvex ����δ����,������
            DFS(G, p->adjvex);
        }
        p = p->nextarc;//pָ�򶥵�v����һ���ڽӵ�
    }
}

void BFS(AdjList G, int v)
{
    ArcNode* p;
    int Qu[20], front, rear;//����ѭ������
    int visited[20] = { 0 };
    int w;
    front = rear = 0;//��ʼ������
    //printf("%d ", v);
    cout << v << " ";
    visited[v] = 1;
    rear = (rear + 1) % 20;
    Qu[rear] = v;//v����
    while (front != rear) 
    {
        front = (front + 1) % 20;
        w = Qu[front];//���Ӳ�����w
        p = G[w].firstarc;//���붥��w�ڽӵĵ�һ������
        while (p) {
            if (visited[p->adjvex] == 0)
            {
                //��ǰ����δ������
                printf("%d ", p->adjvex);//�����ڽӶ���
                visited[p->adjvex] = 1;
                rear = (rear + 1) % 20;//�ö������
                Qu[rear] = p->adjvex;
            }
            p = p->nextarc;
        }
    }
}

//����ڽӱ�
void printDgraph(AdjList g, int n)
{
    ArcNode* p;
    int i;
    for (i = 1; i <= n; i++)
    {
        cout << g[i].data << ":";
        p = g[i].firstarc;
        while (p)
        {
            cout << "->" << p->adjvex ;
            p = p->nextarc;
        }
        cout << endl;
    }
}

//��ʼ��Ϊһ����Ȧͼ ��Ҳ���Ǳ߾����У����Խ���Ԫ�ض���0
void ArrayGraph_init(ArrayGraph  &pGraph)
{
    for (int i = 0; i < MAX_VERTEX; i++)
    {
        pGraph.edgeArr[i][i] = 0;
    }
}

//����һ��ͼ 
void ArrayGraph_create(ArrayGraph &pGraph)
{

    for (int i = 0; i < MAX_VERTEX; ++i)    //��䶥�����飬Ҳ�������붥��Ԫ�� 
    {
        //printf("�����%d������ֵ\n", i + 1);
        cout << "�����" << i + 1 << "�������ֵ" << endl;
        //scanf(" %c", &(pGraph.vertexArr[i]));
        cin >> pGraph.vertexArr[i];

    }
    for (int j = 0; j < MAX_VERTEX; ++j)   //���߹�ϵ 
    {
        for (int i = j + 1; i < MAX_VERTEX; ++i)
        {
            //printf("��Ԫ��%c��%c�бߣ�������1����������0\t", pGraph.vertexArr[j], pGraph.vertexArr[i]);
            cout << "��Ԫ��"<< pGraph.vertexArr[j] <<"��"<< pGraph.vertexArr[i] <<"�бߣ�������1����������0" << endl;
            //scanf("%d", &(pGraph.edgeArr[j][i]));
            cin >> pGraph.edgeArr[j][i];
            pGraph.edgeArr[i][j] = pGraph.edgeArr[j][i];     //�Գ� 
        }
    }
}

void ArrayGraph_show(ArrayGraph  &pGraph)
{
    cout << "����Ԫ������" << endl;
    for (int i = 0; i < MAX_VERTEX; ++i)
    {
       cout << pGraph.vertexArr[i] << "   ";
    }
    cout << endl;
    cout << "�߾�������" << endl;
    for (int i = 0; i < MAX_VERTEX; ++i)
    {
        cout<< pGraph.vertexArr[i]<<"   " ;
    }
    cout << endl;
    for (int j = 0; j < MAX_VERTEX; ++j)
    {
        cout << pGraph.vertexArr[j] << " ";
        for (int i = 0; i < MAX_VERTEX; ++i)
        {
            cout << pGraph.edgeArr[i][j] << "    ";
        }
        cout << endl;
    }
    cout << endl;
}


int prim(vector<vector<int> >& g) 
{
    int vex = g.size() - 1;		//�������
    int cost = 0;	//����������Ȩֵ
    vector<int> mst(vex + 1);	//MST[i]��ʾ����i����MST�е��ĸ����㣬ֵ=0ʱ��ʾ��MST��
    vector<int> MINedge(vex + 1);	//����i���ڽӱ��е���Сֵ��ֵ=-1ʱ��ʾ��MST��

    mst[1] = 0;	//����1����MST
    for (int i = 1; i <= vex; i++) 
    {
        MINedge[i] = g[1][i];
        mst[i] = 1;
    }

    for (int i = 2; i <= vex; i++) 
    {
        int MINvex = 0;		//��С�߶���
        int MINcost = INT_MAX;	//��СȨֵ

        for (int j = 2; j <= vex; j++) 
        {
            if (MINedge[j] < MINcost && MINedge[j] != -1)
            {	//��С�߶��㲻��MST�У��������㲻�ܶ���MST�У�
                MINvex = j;
                MINcost = MINedge[j];
            }
        }
        Tree t;	//�������MST��
        t.vexa = mst[MINvex];
        t.vexb = MINvex;
        t.edge = MINcost;
        tree.push_back(t);
        cost += MINcost;
        MINedge[MINvex] = -1;

        //����MINedge
        for (int i = 2; i <= vex; i++) 
        {
            if (g[MINvex][i] < MINedge[i]) 
            {
                MINedge[i] = g[MINvex][i];
                mst[i] = MINvex;
            }
        }
    }
    return cost;
}

int main()
{
    AdjList g;
    int num;
    cout << "���붥����" << endl;
    cin >> num;
    createDgraph(g, num);
    printDgraph(g, num);
    cout << endl;
    cout << "�������" << endl;
    DFS(g, num);
    cout << endl;
    cout << "�������" << endl;
    BFS(g, num);

    cout << endl;
    ArrayGraph G;
    ArrayGraph_init(G);       //��ʼ��ͼ 
    ArrayGraph_create(G);     //����ͼ 
    ArrayGraph_show(G);       //��ӡͼ 

   //��ʼ��ͼ
    int vexNum, edgeNum;
    cout << "���붥�������������";
    cin >> vexNum >> edgeNum;
    vector<vector<int> > graph(vexNum + 1, vector<int>(vexNum + 1, INT_MAX));
    cout << "�����ڽӱ߼�Ȩֵa b w" << endl;
    int a, b, w;
    for (int i = 0; i < edgeNum; i++) {
        cin >> a >> b >> w;
        graph[a][b] = w;
        graph[b][a] = w;
    }
    for (int i = 1; i <= vexNum; i++)
        graph[i][i] = 0;

    int cost = prim(graph);	//prim�㷨

    cout << endl << "��С��������ɣ�" << endl;
    for (int i = 0; i < tree.size(); i++) {
        cout << tree[i].vexa << " -> " << tree[i].vexb << " = " << tree[i].edge << endl;
    }
    cout << "��ȨֵΪ��" << cost << endl;

    system("pause");


    return 0;
}