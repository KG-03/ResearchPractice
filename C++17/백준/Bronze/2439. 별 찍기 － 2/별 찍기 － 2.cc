#include <iostream>
using namespace std;

int main() {
    int N = 0;
    cin >> N;

    char star[N];

    for(int i = 0; i < N; i++) {
        star[i] = ' ';
    }

    for(int i = 0; i < N; i++) {
        star[N-(i+1)] = '*';

        for(int i = 0; i < N; i++) {
        cout << star[i];
        }
        cout << endl;
    }

    return 0;
}