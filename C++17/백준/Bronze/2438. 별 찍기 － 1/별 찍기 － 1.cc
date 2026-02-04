#include <iostream>
using namespace std;

int main() {
    int N = 0;
    cin >> N;

    string star;

    for(int i = 0; i < N; i++) {
        star += "*";
        cout << star << endl;
    }
    
    return 0;
}