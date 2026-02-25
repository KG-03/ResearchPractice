#include <iostream>
using namespace std;

int main() {
    char c[5][15];

    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 15; j++) {
            c[i][j] = '\0';
        }
    }

    for (int i = 0; i < 5; i++) {
        cin >> c[i];
    }

    for(int j = 0; j < 15; j++) {
        for (int m = 0; m < 5; m++) {
            if(c[m][j] != '\0') {
                cout << c[m][j];
            }
        }
    }
    
    return 0;
}