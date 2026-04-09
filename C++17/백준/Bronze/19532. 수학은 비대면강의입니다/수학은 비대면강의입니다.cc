#include <iostream>
using namespace std;

int main() {
    int a = 0;
    int b = 0;
    int c = 0;
    int d = 0;
    int e = 0;
    int f = 0;
    cin >> a >> b >> c >> d >> e >> f;

    int x = 0;
    int y = 0;

    for (int i = -999; i <= 999; i++) {
        for (int j = -999; j <= 999; j++) {
            if (a * i + b * j == c && d * i + e * j == f) {
                x = i;
                y = j;
                break;
            }
        }
    }

    cout << x << " " << y << endl;
    
    return 0;
}