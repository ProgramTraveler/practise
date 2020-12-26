#include<iostream>
#include<windows.h>
#include<fstream>
#include<cstdlib>
#include<cstdio>
#include<cmath>
#include<iomanip>
using namespace std;
unsigned char* pBmpBuf;//����ͼ�����ݵ�ָ��

int bmpWidth;//ͼ��Ŀ�
int bmpHeight;//ͼ��ĸ�
RGBQUAD* pColorTable;//��ɫ��ָ��
int biBitCount;//ͼ�����ͣ�ÿ����λ��

//-----------------------------------------------------------------------------------------
//����һ��ͼ��λͼ���ݡ����ߡ���ɫ��ָ�뼰ÿ������ռ��λ������Ϣ,����д��ָ���ļ���
bool readBmp(char* bmpName)
{
    FILE* fp;
    fopen_s(&fp, bmpName, "rb");//�����ƶ���ʽ��ָ����ͼ���ļ�
    if (fp == 0)
        return 0;
    //����λͼ�ļ�ͷ�ṹBITMAPFILEHEADER
    fseek(fp, sizeof(BITMAPFILEHEADER), 0);//fseek�������ǽ��ļ�ָ��fp���ļ�ͷ��ʼ(��Ϊ������0)��ƫ��sizeof(BITMAPFILEHEADER)
    //����λͼ��Ϣͷ�ṹ��������ȡλͼ��Ϣͷ���ڴ棬����ڱ���head��
    BITMAPINFOHEADER head;
    fread(&head, sizeof(BITMAPINFOHEADER), 1, fp); //��ȡͼ����ߡ�ÿ������ռλ������Ϣ
    bmpWidth = head.biWidth;//λͼ�Ŀ�ȣ�ÿ���ж��ٸ����ؿ�
    bmpHeight = head.biHeight;
    biBitCount = head.biBitCount;//�������������ͼ��ÿ��������ռ���ֽ�����������4�ı�����
    cout << "biBitCount " << biBitCount << endl;
    int lineByte = (bmpWidth * biBitCount / 8 + 3) / 4 * 4;//�Ҷ�ͼ������ɫ������ɫ�����Ϊ256
    /*bmpWidth * biBitCount����λͼÿ�ж��ٸ��ֽ�
    +3�²�����4�ı���
    /4*4��ת����4�ı���
    */
    if (biBitCount == 8)
    {
        //������ɫ������Ҫ�Ŀռ䣬����ɫ����ڴ�
        pColorTable = new RGBQUAD[256];
        fread(pColorTable, sizeof(RGBQUAD), 256, fp);//fread����������ǽ�fpָ���bmp�ļ��������ɫ��Ϣ���뵽pColorTable��
    }
    //����λͼ��������Ҫ�Ŀռ䣬��λͼ���ݽ��ڴ�
    pBmpBuf = new unsigned char[lineByte * bmpHeight];
    fread(pBmpBuf, 1, lineByte * bmpHeight, fp);
    fclose(fp);//�ر��ļ�
    return 1;//��ȡ�ļ��ɹ�
}

bool saveBmp(char* bmpName, unsigned char* imgBuf, int width, int height, int biBitCount, RGBQUAD* pColorTable)
{
    //���λͼ����ָ��Ϊ0����û�����ݴ��룬��������
    if (!imgBuf)
        return 0;
    //��ɫ���С�����ֽ�Ϊ��λ���Ҷ�ͼ����ɫ��Ϊ1024�ֽڣ���ɫͼ����ɫ���СΪ0
    int colorTablesize = 0;
    if (biBitCount == 8)
        colorTablesize = 1024;
    //���洢ͼ������ÿ���ֽ���Ϊ4�ı���
    int lineByte = (width * biBitCount / 8 + 3) / 4 * 4;
    //�Զ�����д�ķ�ʽ���ļ�
    FILE* fp;
    fopen_s(&fp, bmpName, "wb");
    if (fp == 0)
        return 0;
    //����λͼ�ļ�ͷ�ṹ��������д�ļ�ͷ��Ϣ
    BITMAPFILEHEADER fileHead;
    fileHead.bfType = 0x4D42;//bmp����
    //bfSize��ͼ���ļ�4����ɲ���֮��
    fileHead.bfSize = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER) + colorTablesize + lineByte * height;
    fileHead.bfReserved1 = 0;
    fileHead.bfReserved2 = 0;
    //bfOffBits��ͼ���ļ�ǰ3����������ռ�֮��
    fileHead.bfOffBits = 54 + colorTablesize;//ͷ������54bit
    //д�ļ�ͷ���ļ�
    fwrite(&fileHead, sizeof(BITMAPFILEHEADER), 1, fp);
    //����λͼ��Ϣͷ�ṹ��������д��Ϣͷ��Ϣ
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
    //дλͼ��Ϣͷ���ڴ�
    fwrite(&head, sizeof(BITMAPINFOHEADER), 1, fp);
    //����Ҷ�ͼ������ɫ��д���ļ� 
    if (biBitCount == 8)
        fwrite(pColorTable, sizeof(RGBQUAD), 256, fp);
    //дλͼ���ݽ��ļ�
    fwrite(imgBuf, height * lineByte, 1, fp);
    //�ر��ļ�
    fclose(fp);
    return 1;
}

void doIt()
{
    char readPath[] = "D:\\test.bmp";
    readBmp(readPath);
    // �������ͼ����Ϣ
    cout << "width=" << bmpWidth << "height=" << bmpHeight << "biBitCount=" << biBitCount << endl;
    // ͼ����ֽ���
    int linebyte1 = (bmpWidth * biBitCount / 8 + 3) / 4 * 4;
    int n = 0, m = 0, count_xiang_su = 0;
    //ofstream outfile("ͼ������.txt",ios::in|ios::trunc);//���������ݴ���TXT�ļ���
   //��ʼ��ԭʼ���ص����顣
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
                for (int k = 0; k < 3; k++)//ÿ����RGB���������ֱ���0�ű�ɺ�ɫ
                {
                    m = *(pBmpBuf + i * linebyte1 + j * 3 + k);
                    //cout << m << " ";
                    count_xiang_su++;
                }
                n++;
                //cout << endl;
            }
        }
        cout << "�ܵ����ظ���Ϊ:" << n << endl;
        cout << "----------------------------------------------------" << endl;
    }
    // jiang tuxiang shuju cunpan .
    char writePath[] = "necpy.BMP";
    saveBmp(writePath, pBmpBuf, bmpWidth, bmpHeight, biBitCount, pColorTable);
    //�����������pBmpBuf��pColorTable��ȫ�ֱ��������ļ�����ʱ����Ŀռ�

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
    unsigned char* imagedata = pBmpBuf; //��̬����洢ԭͼƬ��������Ϣ�Ķ�ά����
    int ExpectHeight = ExpectNum * bmpHeight;
    int ExpectWidth = ExpectNum * bmpWidth;
    int lineByte = (bmpWidth * biBitCount / 8 + 3) / 4 * 4;
    int lineByte2 = (ExpectWidth * biBitCount / 8 + 3) / 4 * 4;
    //imagedataScal = new unsigned char[lineByte2 * ExpectHeight];///Ϊ���ź�ͼ�����洢�ռ�
    for (int i = 0; i < ExpectHeight; i++)
    {
        for (int j = 0; j < ExpectWidth; j++)
        {
            float d_original_img_hnum = i / ExpectNum;//ԭʼͼ����Ľ�������
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
    unsigned char* imagedata = pBmpBuf; //��̬����洢ԭͼƬ��������Ϣ�Ķ�ά����
    int ExpectNum = 3;//�����ķŴ���
    int ExpectHeight = ExpectNum * bmpHeight;
    int ExpectWidth = ExpectNum * bmpWidth;
    int lineByte = (bmpWidth * biBitCount / 8 + 3) / 4 * 4;
    int lineByte2 = (ExpectWidth * biBitCount / 8 + 3) / 4 * 4;
    unsigned char* imagedataScal;//��̬����洢���ź��ͼƬ��������Ϣ�Ķ�ά����
    unsigned char* imagedataScal2 = new unsigned char[lineByte2 * ExpectHeight];//��̬����洢���ź��ͼƬ��������Ϣ�Ķ�ά����
    Newton(imagedataScal2, ExpectNum);
    imagedataScal = new unsigned char[lineByte2 * ExpectHeight];///Ϊ���ź�ͼ�����洢�ռ�
    for (int i = 0; i < ExpectHeight; i++)
    {
        for (int j = 0; j < ExpectWidth; j++)
        {
            float d_original_img_hnum = i / ExpectNum;
            float d_original_img_wnum = j / ExpectNum;
            int i_original_img_hnum = d_original_img_hnum;
            int i_original_img_wnum = d_original_img_wnum;
            float distance_to_a_x = d_original_img_wnum - i_original_img_wnum;//��ԭͼ������a���ˮƽ����    
            float distance_to_a_y = d_original_img_hnum - i_original_img_hnum;//��ԭͼ������a��Ĵ�ֱ����    

            int original_point_a = i_original_img_hnum * lineByte + i_original_img_wnum * 3;//����λ��ƫ��������Ӧ��ͼ��ĸ����ص�RGB�����,�൱�ڵ�A      
            int original_point_b = i_original_img_hnum * lineByte + (i_original_img_wnum + 1) * 3;//����λ��ƫ��������Ӧ��ͼ��ĸ����ص�RGB�����,�൱�ڵ�B    
            int original_point_c = (i_original_img_hnum + 1) * lineByte + i_original_img_wnum * 3;//����λ��ƫ��������Ӧ��ͼ��ĸ����ص�RGB�����,�൱�ڵ�C     
            int original_point_d = (i_original_img_hnum + 1) * lineByte + (i_original_img_wnum + 1) * 3;//����λ��ƫ��������Ӧ��ͼ��ĸ����ص�RGB�����,�൱�ڵ�D 

            if (i_original_img_hnum == bmpHeight - 1)//����߽�
            {
                original_point_c = original_point_a;
                original_point_d = original_point_b;
            }
            if (i_original_img_wnum == bmpWidth - 1)//����߽�
            {
                original_point_b = original_point_a;
                original_point_d = original_point_c;
            }

            int pixel_point = i * lineByte2 + j * 3;//ӳ��߶ȱ任ͼ������λ��ƫ����    
            for (int k = 0; k < 3; k++)//R G B�������ص�
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