#include <iostream>
using namespace std;

int main() {
    bool student[30];

    for (int i = 0; i < 30; i++) {
        student[i] = false;
    }
    
    for (int i = 0; i < 28; i++) {
        int attendanceNumber;
        cin >> attendanceNumber;

        student[attendanceNumber-1] = true;
    }

    for (int i = 0; i < 30; i++) {
        if(student[i] != true) {
            cout << i+1 << endl;
        }
    }
    
    return 0;
}