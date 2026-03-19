#include <iostream>
using namespace std;

int main() {
    int square[3][2];

    cin >> square[0][0] >> square[0][1] >>
        square[1][0] >> square[1][1] >>
        square[2][0] >> square[2][1];

    int check = square[0][0];
    bool dif = false;
    int x = 0;

    for (int i = 1; i < 3; i++) {        
        if(check != square[i][0]) {
            if (dif == false) {
                dif = true;
                x = square[i][0];
            }
            else x = check;
        }
    }

    check = square[0][1];
    dif = false;
    int y = 0;

    for (int i = 1; i < 3; i++) {
        if (check != square[i][1]) {
            if(dif == false) {
                dif = true;
                y = square[i][1];
            }
            else y = check;
        }
    }
    
    cout << x << " " << y << endl;
    
    return 0;
}