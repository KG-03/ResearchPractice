#include <iostream>
using namespace std;

int main() {
    int A = 0;
    int B = 0;
    int C = 0;

    cin >> A >> B >> C;

    int fullMin = 0;

    fullMin = A * 60 + B + C;

    A = (fullMin / 60) % 24;
    B = fullMin % 60;
    
    cout << A << " " << B << endl;
    
    return 0;
}