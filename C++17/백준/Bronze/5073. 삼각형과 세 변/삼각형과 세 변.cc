#include <iostream>
using namespace std;

int main() {
    int side[3] = {0,};

    int max = 0;
    int sum = 0;
    
    while(1) {
        cin >> side[0] >> side[1] >> side[2];
        
        if (side[0] == 0 && side[1] == 0 && side[2] == 0) break;

        for(int i = 0; i <= 2; i++) {
            if(max < side[i]) max = side[i];
            sum += side[i];
        }
        sum -= max;
        
        if(max >= sum) {
            cout << "Invalid" << endl;
        }
        else {
            if (side[0] == side[1] && side[0] == side[2]) {
                cout << "Equilateral" << endl;
            }
            else if (side[0] == side[1] || side[1] == side[2] || side[0] == side[2]) {
                cout << "Isosceles" << endl;
            }
            else {
                cout << "Scalene" << endl;
            }
        }

        max = 0;
        sum = 0;
    }
    
    return 0;
}