#include <iostream>
#include <cstring>
using namespace std;

int main() {
    int T = 0;
    char array[1001];

    cin >> T;
    for (int i = 0; i < T; i++) {
        cin >> array;

        cout << array[0] << array[strlen(array)-1] << endl;
    }
}