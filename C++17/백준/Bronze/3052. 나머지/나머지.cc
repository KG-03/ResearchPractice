#include <iostream>
using namespace std;

int main() {
    bool comparison[42] = {};
    int num;
    int different = 0;

    for (int i = 0; i < 10; i++) {
        cin >> num;

        comparison[num%42] = 1;
    }

    for (int i = 0; i < 42; i++) {
        if(comparison[i] == 1) {
            different++;
        }
    }

    cout << different << endl;
    
    return 0;
}