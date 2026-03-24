#include <iostream>
using namespace std;

int main() {
    int angle_1 = 0;
    int angle_2 = 0;
    int angle_3 = 0;

    cin >> angle_1 >> angle_2 >> angle_3;

    if (angle_1 == 60 && angle_2 == 60 && angle_3 == 60) {
        cout << "Equilateral" << endl;
    }
    else if (angle_1 + angle_2 + angle_3 == 180) {
        if(angle_1 == angle_2 || angle_2 == angle_3 || angle_1 == angle_3) {
            cout << "Isosceles" << endl;
        }
        else {
            cout << "Scalene" << endl;
        }
    }
    else {
        cout << "Error" << endl;
    }

    
    return 0;
}