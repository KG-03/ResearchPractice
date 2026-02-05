#include <iostream>
using namespace std;

int main() {
    int a = 0;
    int b = 0;

    cin >> a >> b;

    while (a+b != 0) {
        cout << a + b << endl;
        cin >> a >> b;
    }

    return 0;
}