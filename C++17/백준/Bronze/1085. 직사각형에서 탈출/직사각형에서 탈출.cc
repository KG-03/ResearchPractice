#include <iostream>
using namespace std;

int main() {
    int x = 0;
    int y = 0;
    int w = 0;
    int h = 0;
    cin >> x >> y >> w >> h;

    int dis = 0;

    if (w-x < h-y) dis = w - x;
    else dis = h - y;

    if (x < dis) dis = x;
    if (y < dis) dis = y;

    cout << dis << endl;
    
    return 0;
}