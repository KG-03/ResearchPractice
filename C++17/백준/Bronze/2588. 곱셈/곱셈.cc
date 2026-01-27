#include <iostream>
using namespace std;

int main() {
    int firstLine = 0;
    int secondLine = 0;

    cin >> firstLine >> secondLine;

    int one = (secondLine % 10) * firstLine;
    int ten = (((secondLine/10) % 10) * 10) * firstLine;
    int hundred = (((secondLine/100) % 10) * 100) * firstLine;
    
    cout << one << endl;
    cout << ten / 10  << endl;
    cout << hundred / 100 << endl;
    cout << one + ten + hundred << endl;
    
    return 0;
}