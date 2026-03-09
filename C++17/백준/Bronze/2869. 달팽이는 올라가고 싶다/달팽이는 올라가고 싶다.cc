#include <iostream>
using namespace std;

int main() {
    
    int a = 0;
    int b = 0;
    int v = 0;

    cin >> a >> b >> v;
    
    int day = 1;
    day += (v - a) / (a - b);

    if((v - a) % (a - b) != 0) {
        day++;
    }
    
    if(a >= v) {
        cout << "1" << endl;
    }
    else {
        cout << day << endl;
    }
    
    return 0;
}