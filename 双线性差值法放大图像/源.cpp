#include<iostream>
#include<windows.h>
#include<fstream>
#include<cstdlib>
#include<cstdio>
#include<cmath>
#include<iomanip>
using namespace std;
unsigned char* pBmpBuf;//读入图像数据的指针

int bmpWidth;//图像的宽
int bmpHeight;//图像的高
RGBQUAD* pColorTable;//颜色表指针
int biBitCount;//图像类型，每像素位数

//-----------------------------------------------------------------------------------------
//给定一个图像位图数据、宽、高、颜色表指针及每像素所占的位数等信息,将其写到指定文件中
bool readBmp(char* bmpName)
{
    FILE* fp;
    fopen_s(&fp, bmpName, "rb");//二进制读方式打开指定的图像文件
    if (fp == 0)
        return 0;
    //跳过位图文件头结构BITMAPFILEHEADER
    fseek(fp, sizeof(BITMAPFILEHEADER), 0);//fseek的作用是将文件指针fp从文件头开始(因为这里是0)，偏移sizeof(BITMAPFILEHEADER)
    //定义位图信息头结构变量，读取位图信息头进内存，存放在变量head中
    BITMAPINFOHEADER head;
    fread(&head, sizeof(BITMAPINFOHEADER), 1, fp); //获取图像宽、高、每像素所占位数等信息
    bmpWidth = head.biWidth;//位图的宽度，每行有多少个像素块
    bmpHeight = head.biHeight;
    biBitCount = head.biBitCount;//定义变量，计算图像每行像素所占的字节数（必须是4的倍数）
    cout << "biBitCount " << biBitCount << endl;
    int lineByte = (bmpWidth * biBitCount / 8 + 3) / 4 * 4;//灰度图像有颜色表，且颜色表表项为256
    /*bmpWidth * biBitCount计算位图每行多少个字节
    +3怕不满足4的倍数
    /4*4是转换成4的倍数
    */
    if (biBitCount == 8)
    {
        //申请颜色表所需要的空间，读颜色表进内存
        pColorTable = new RGBQUAD[256];
        fread(pColorTable, sizeof(RGBQUAD), 256, fp);//fread这里的作用是将fp指向的bmp文件后面的颜色信息读入到pColorTable中
    }
    //申请位图数据所需要的空间，读位图数据进内存
    pBmpBuf = new unsigned char[lineByte * bmpHeight];
    fread(pBmpBuf, 1, lineByte * bmpHeight, fp);
    fclose(fp);//关闭文件
    return 1;//读取文件成功
}

bool saveBmp(char* bmpName, unsigned char* imgBuf, int width, int height, int biBitCount, RGBQUAD* pColorTable)
{
    //如果位图数据指针为0，则没有数据传入，函数返回
    if (!imgBuf)
        return 0;
    //颜色表大小，以字节为单位，灰度图像颜色表为1024字节，彩色图像颜色表大小为0
    int colorTablesize = 0;
    if (biBitCount == 8)
        colorTablesize = 1024;
    //待存储图像数据每行字节数为4的倍数
    int lineByte = (width * biBitCount / 8 + 3) / 4 * 4;
    //以二进制写的方式打开文件
    FILE* fp;
    fopen_s(&fp, bmpName, "wb");
    if (fp == 0)
        return 0;
    //申请位图文件头结构变量，填写文件头信息
    BITMAPFILEHEADER fileHead;
    fileHead.bfType = 0x4D42;//bmp类型
    //bfSize是图像文件4个组成部分之和
    fileHead.bfSize = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER) + colorTablesize + lineByte * height;
    fileHead.bfReserved1 = 0;
    fileHead.bfReserved2 = 0;
    //bfOffBits是图像文件前3个部分所需空间之和
    fileHead.bfOffBits = 54 + colorTablesize;//头好像是54bit
    //写文件头进文件
    fwrite(&fileHead, sizeof(BITMAPFILEHEADER), 1, fp);
    //申请位图信息头结构变量，填写信息头信息
    BITMAPINFOHEADER head;
    head.biBitCount = biBitCount;
    head.biClrImportant = 0;
    head.biClrUsed = 0;
    head.biCompression = 0;
    head.biHeight = height;
    head.biPlanes = 1;
    head.biSize = 40;
    head.biSizeImage = lineByte * height;
    head.biWidth = width;
    head.biXPelsPerMeter = 0;
    head.biYPelsPerMeter = 0;
    //写位图信息头进内存
    fwrite(&head, sizeof(BITMAPINFOHEADER), 1, fp);
    //如果灰度图像，有颜色表，写入文件 
    if (biBitCount == 8)
        fwrite(pColorTable, sizeof(RGBQUAD), 256, fp);
    //写位图数据进文件
    fwrite(imgBuf, height * lineByte, 1, fp);
    //关闭文件
    fclose(fp);
    return 1;
}

void doIt()
{
    char readPath[] = "D:\\test.bmp";
    readBmp(readPath);
    // 输出整体图像信息
    cout << "width=" << bmpWidth << "height=" << bmpHeight << "biBitCount=" << biBitCount << endl;
    // 图像的字节数
    int linebyte1 = (bmpWidth * biBitCount / 8 + 3) / 4 * 4;
    int n = 0, m = 0, count_xiang_su = 0;
    //ofstream outfile("图像像素.txt",ios::in|ios::trunc);//将像素数据存入TXT文件。
   //初始化原始像素的数组。
    if (biBitCount == 8)
    {
        for (int i = 0; i < bmpHeight / 2; i++)
        {
            for (int j = 0; j < bmpWidth / 2; i++)
                *(pBmpBuf + i * linebyte1 + j) = 0;
        }
    }
    if (biBitCount == 24)
    {
        //cout << "BitCount " << biBitCount << endl;
        for (int i = 0; i < bmpHeight; i++)
        {
            for (int j = 0; j < bmpWidth; j++)
            {
                for (int k = 0; k < 3; k++)//每像素RGB三个分量分别置0才变成黑色
                {
                    m = *(pBmpBuf + i * linebyte1 + j * 3 + k);
                    //cout << m << " ";
                    count_xiang_su++;
                }
                n++;
                //cout << endl;
            }
        }
        cout << "总的像素个素为:" << n << endl;
        cout << "----------------------------------------------------" << endl;
    }
    // jiang tuxiang shuju cunpan .
    char writePath[] = "necpy.BMP";
    saveBmp(writePath, pBmpBuf, bmpWidth, bmpHeight, biBitCount, pColorTable);
    //清除缓冲区，pBmpBuf和pColorTable是全局变量，在文件读入时申请的空间

    delete[]pBmpBuf;
    if (biBitCount == 8)
        delete[]pColorTable;
}

unsigned char getNewtonValue(unsigned char* imagedata, int originHighNum, int orignWidthNum)
{
    return 0;
}

void Newton(unsigned char* imagedataScal, int ExpectNum)
{
    unsigned char* imagedata = pBmpBuf; //动态分配存储原图片的像素信息的二维数组
    int ExpectHeight = ExpectNum * bmpHeight;
    int ExpectWidth = ExpectNum * bmpWidth;
    int lineByte = (bmpWidth * biBitCount / 8 + 3) / 4 * 4;
    int lineByte2 = (ExpectWidth * biBitCount / 8 + 3) / 4 * 4;
    //imagedataScal = new unsigned char[lineByte2 * ExpectHeight];///为缩放后图像分配存储空间
    for (int i = 0; i < ExpectHeight; i++)
    {
        for (int j = 0; j < ExpectWidth; j++)
        {
            float d_original_img_hnum = i / ExpectNum;//原始图像里的近似坐标
            float d_original_img_wnum = j / ExpectNum;
            int i_original_img_hnum = d_original_img_hnum;
            int i_original_img_wnum = d_original_img_wnum;
            //cout << i_original_img_hnum << " " << i_original_img_wnum << " " << i_original_img_hnum + 1 << " " << i_original_img_wnum + 1 << " " << i_original_img_hnum + 2 << " " << i_original_img_wnum + 2 << endl;
            //cout << (int)imagedata[i_original_img_hnum * lineByte + i_original_img_wnum*3 ] << " ";
        }
        //cout << endl;
    }
}

int main()
{
    char readPath[] = "D:\\test2.bmp";
    readBmp(readPath);
    unsigned char* imagedata = pBmpBuf; //动态分配存储原图片的像素信息的二维数组
    int ExpectNum = 3;//期望的放大倍数
    int ExpectHeight = ExpectNum * bmpHeight;
    int ExpectWidth = ExpectNum * bmpWidth;
    int lineByte = (bmpWidth * biBitCount / 8 + 3) / 4 * 4;
    int lineByte2 = (ExpectWidth * biBitCount / 8 + 3) / 4 * 4;
    unsigned char* imagedataScal;//动态分配存储缩放后的图片的像素信息的二维数组
    unsigned char* imagedataScal2 = new unsigned char[lineByte2 * ExpectHeight];//动态分配存储缩放后的图片的像素信息的二维数组
    Newton(imagedataScal2, ExpectNum);
    imagedataScal = new unsigned char[lineByte2 * ExpectHeight];///为缩放后图像分配存储空间
    for (int i = 0; i < ExpectHeight; i++)
    {
        for (int j = 0; j < ExpectWidth; j++)
        {
            float d_original_img_hnum = i / ExpectNum;
            float d_original_img_wnum = j / ExpectNum;
            int i_original_img_hnum = d_original_img_hnum;
            int i_original_img_wnum = d_original_img_wnum;
            float distance_to_a_x = d_original_img_wnum - i_original_img_wnum;//在原图像中与a点的水平距离    
            float distance_to_a_y = d_original_img_hnum - i_original_img_hnum;//在原图像中与a点的垂直距离    

            int original_point_a = i_original_img_hnum * lineByte + i_original_img_wnum * 3;//数组位置偏移量，对应于图像的各像素点RGB的起点,相当于点A      
            int original_point_b = i_original_img_hnum * lineByte + (i_original_img_wnum + 1) * 3;//数组位置偏移量，对应于图像的各像素点RGB的起点,相当于点B    
            int original_point_c = (i_original_img_hnum + 1) * lineByte + i_original_img_wnum * 3;//数组位置偏移量，对应于图像的各像素点RGB的起点,相当于点C     
            int original_point_d = (i_original_img_hnum + 1) * lineByte + (i_original_img_wnum + 1) * 3;//数组位置偏移量，对应于图像的各像素点RGB的起点,相当于点D 

            if (i_original_img_hnum == bmpHeight - 1)//处理边界
            {
                original_point_c = original_point_a;
                original_point_d = original_point_b;
            }
            if (i_original_img_wnum == bmpWidth - 1)//处理边界
            {
                original_point_b = original_point_a;
                original_point_d = original_point_c;
            }

            int pixel_point = i * lineByte2 + j * 3;//映射尺度变换图像数组位置偏移量    
            for (int k = 0; k < 3; k++)//R G B三个像素点
            {
                imagedataScal[pixel_point + k] =
                    imagedata[original_point_a + k] * (1 - distance_to_a_x) * (1 - distance_to_a_y) +
                    imagedata[original_point_b + k] * distance_to_a_x * (1 - distance_to_a_y) +
                    imagedata[original_point_c + k] * distance_to_a_y * (1 - distance_to_a_x) +
                    imagedata[original_point_d + k] * distance_to_a_y * distance_to_a_x;
            }

        }
    }
    char writePath[] = "D:\\change.bmp";
    saveBmp(writePath, imagedataScal, ExpectWidth, ExpectHeight, biBitCount, pColorTable);
    return 0;
}