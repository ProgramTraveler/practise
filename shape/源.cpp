#include <iostream>
#include <cstdio>
#include <conio.h>

#include <graphics.h>

using namespace std;
class shape {
public:
	shape(int xx, int yy) :x(xx), y(yy) {}
	void draw() {}
	void move(int offset_x, int offset_y) {}
	int getX() { return x; }
	int getY() { return y; }
	void setX(int xx) { x = xx; }
	void setY(int yy) { y = yy; }
private:
	int x, y;
};
class Circle :public shape {
public:
	Circle(int r, int xx, int yy) :shape(xx, yy), radius(r) {}
	void draw()
	{
		setcolor(WHITE); //��ͼǰ��ɫΪ��ɫ
		setfillstyle(BS_SOLID);//�����ʽΪ��ʵ���
		setfillcolor(BLUE);//�����ɫΪ��ɫ
		fillcircle(shape::getX(), shape::getY(), radius); //���б߿�����Բ
	}
	void move(int offset_x, int offset_y)
	{
		//setcolor(BLACK);
		//setfillcolor(BLACK);
		//fillcircle(shape::getX(), shape::getY(), radius);
		cleardevice();  //�����Ļ����
		setfillstyle(BS_SOLID);//�����ʽΪ��ʵ���
		setfillcolor(BLUE);
		fillcircle(shape::getX() + offset_x, shape::getY() + offset_y, radius);
		shape::setX(shape::getX() + offset_x);
		shape::setY(shape::getY() + offset_y);
	}
private:
	int radius;
};

class Crectangle :public shape {
public:
	Crectangle(int l, int w, int xx, int yy) :shape(xx, yy), length(l), width(w) {}
	void draw()
	{
		setcolor(WHITE);//��ͼǰ��ɫΪ��ɫ
		setfillstyle(BS_HATCHED, HS_BDIAGONAL);//�����ʽ
		setfillcolor(RED);
		fillrectangle(shape::getX(), shape::getY() - width, shape::getX() + length, shape::getY());
	}
	void move(int offset_x, int offset_y)
	{
		setfillcolor(RED);
		setfillstyle(BS_HATCHED, HS_BDIAGONAL);//�����ʽ
		fillrectangle(shape::getX() + offset_x, shape::getY() - width + offset_y, shape::getX() + length + offset_x, shape::getY() + offset_y);
		shape::setX(shape::getX() + offset_x);
		shape::setY(shape::getY() + offset_y);
	}
private:
	int length, width;
};
//ʹ��EasyX�ڿ���̨�����л���ͼ��
int main()
{
	initgraph(640, 480);//��ͼ����640*480

	Circle cir(50, 100, 100);
	cir.draw();
	Crectangle rect(50, 70, 100, 200);
	rect.draw();
	bool returnKey = false;
	while (1)
	{
		switch (_getch())
		{
		case 'z':
			cir.move(0, 50);
			rect.move(0, 50);
			break;
		case 'w':
			cir.move(0, -50);
			rect.move(0, -50);
			break;
		case 'a':
			cir.move(-50, 0);
			rect.move(-50, 0);
			break;
		case 's':
			cir.move(50, 0);
			rect.move(50, 0);
			break;
		default:
			returnKey = true;
		}
		if (returnKey)
			break;
	}
	closegraph();//�ر�ͼ�λ���
	return 0;
}