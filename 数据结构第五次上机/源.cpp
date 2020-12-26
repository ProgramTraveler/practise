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
}ArcNode; //表节点

typedef int VertexType; //定点元素类型

typedef struct VNode
{
    VertexType data;
    ArcNode* firstarc;
}VNode/*头节点*/, AdjList[MAX_NUM];

typedef int DataType;

#define MAX_VERTEX 4  //4个顶点的图

typedef struct
{
    DataType vertexArr[MAX_VERTEX];       //顶点元素数组	 
    int edgeArr[MAX_VERTEX][MAX_VERTEX]; //边矩阵二维数组 
}ArrayGraph;

//最小生成树
typedef struct Tree 
{
    int vexa;
    int vexb;
    int edge;
};

vector<Tree> tree;

//建立邻接表
void createDgraph(AdjList& g, int n)
{
    ArcNode* p, * q;
    int i, j;
    for (i = 1; i <= n; i++)
    {
        g[i].data = i;
        g[i].firstarc = NULL;
    }
    cout << "输入边的信息（如A B表示A B之间有边）" << endl;
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
            //若w=p->adjvex 顶点未访问,访问它
            DFS(G, p->adjvex);
        }
        p = p->nextarc;//p指向顶点v的下一个邻接点
    }
}

void BFS(AdjList G, int v)
{
    ArcNode* p;
    int Qu[20], front, rear;//定义循环队列
    int visited[20] = { 0 };
    int w;
    front = rear = 0;//初始化队列
    //printf("%d ", v);
    cout << v << " ";
    visited[v] = 1;
    rear = (rear + 1) % 20;
    Qu[rear] = v;//v进队
    while (front != rear) 
    {
        front = (front + 1) % 20;
        w = Qu[front];//出队并赋给w
        p = G[w].firstarc;//找与顶点w邻接的第一个顶点
        while (p) {
            if (visited[p->adjvex] == 0)
            {
                //当前顶点未被访问
                printf("%d ", p->adjvex);//访问邻接顶点
                visited[p->adjvex] = 1;
                rear = (rear + 1) % 20;//该顶点进队
                Qu[rear] = p->adjvex;
            }
            p = p->nextarc;
        }
    }
}

//输出邻接表
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

//初始化为一个无圈图 ，也就是边矩阵中，主对角线元素都是0
void ArrayGraph_init(ArrayGraph  &pGraph)
{
    for (int i = 0; i < MAX_VERTEX; i++)
    {
        pGraph.edgeArr[i][i] = 0;
    }
}

//输入一个图 
void ArrayGraph_create(ArrayGraph &pGraph)
{

    for (int i = 0; i < MAX_VERTEX; ++i)    //填充顶点数组，也就是输入顶点元素 
    {
        //printf("输入第%d个顶点值\n", i + 1);
        cout << "输入第" << i + 1 << "个顶点的值" << endl;
        //scanf(" %c", &(pGraph.vertexArr[i]));
        cin >> pGraph.vertexArr[i];

    }
    for (int j = 0; j < MAX_VERTEX; ++j)   //填充边关系 
    {
        for (int i = j + 1; i < MAX_VERTEX; ++i)
        {
            //printf("若元素%c和%c有边，则输入1，否则输入0\t", pGraph.vertexArr[j], pGraph.vertexArr[i]);
            cout << "若元素"<< pGraph.vertexArr[j] <<"和"<< pGraph.vertexArr[i] <<"有边，则输入1，否则输入0" << endl;
            //scanf("%d", &(pGraph.edgeArr[j][i]));
            cin >> pGraph.edgeArr[j][i];
            pGraph.edgeArr[i][j] = pGraph.edgeArr[j][i];     //对称 
        }
    }
}

void ArrayGraph_show(ArrayGraph  &pGraph)
{
    cout << "顶点元素如下" << endl;
    for (int i = 0; i < MAX_VERTEX; ++i)
    {
       cout << pGraph.vertexArr[i] << "   ";
    }
    cout << endl;
    cout << "边矩阵如下" << endl;
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
    int vex = g.size() - 1;		//顶点个数
    int cost = 0;	//最终生成树权值
    vector<int> mst(vex + 1);	//MST[i]表示顶点i连到MST中的哪个顶点，值=0时表示在MST中
    vector<int> MINedge(vex + 1);	//顶点i的邻接边中的最小值，值=-1时表示在MST中

    mst[1] = 0;	//将点1放入MST
    for (int i = 1; i <= vex; i++) 
    {
        MINedge[i] = g[1][i];
        mst[i] = 1;
    }

    for (int i = 2; i <= vex; i++) 
    {
        int MINvex = 0;		//最小边顶点
        int MINcost = INT_MAX;	//最小权值

        for (int j = 2; j <= vex; j++) 
        {
            if (MINedge[j] < MINcost && MINedge[j] != -1)
            {	//最小边顶点不在MST中（两个顶点不能都在MST中）
                MINvex = j;
                MINcost = MINedge[j];
            }
        }
        Tree t;	//将点放入MST中
        t.vexa = mst[MINvex];
        t.vexb = MINvex;
        t.edge = MINcost;
        tree.push_back(t);
        cost += MINcost;
        MINedge[MINvex] = -1;

        //更新MINedge
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
    cout << "输入顶点数" << endl;
    cin >> num;
    createDgraph(g, num);
    printDgraph(g, num);
    cout << endl;
    cout << "深度优先" << endl;
    DFS(g, num);
    cout << endl;
    cout << "广度优先" << endl;
    BFS(g, num);

    cout << endl;
    ArrayGraph G;
    ArrayGraph_init(G);       //初始化图 
    ArrayGraph_create(G);     //创建图 
    ArrayGraph_show(G);       //打印图 

   //初始化图
    int vexNum, edgeNum;
    cout << "输入顶点个数、边数：";
    cin >> vexNum >> edgeNum;
    vector<vector<int> > graph(vexNum + 1, vector<int>(vexNum + 1, INT_MAX));
    cout << "输入邻接边及权值a b w" << endl;
    int a, b, w;
    for (int i = 0; i < edgeNum; i++) {
        cin >> a >> b >> w;
        graph[a][b] = w;
        graph[b][a] = w;
    }
    for (int i = 1; i <= vexNum; i++)
        graph[i][i] = 0;

    int cost = prim(graph);	//prim算法

    cout << endl << "最小生成树组成：" << endl;
    for (int i = 0; i < tree.size(); i++) {
        cout << tree[i].vexa << " -> " << tree[i].vexb << " = " << tree[i].edge << endl;
    }
    cout << "总权值为：" << cost << endl;

    system("pause");


    return 0;
}