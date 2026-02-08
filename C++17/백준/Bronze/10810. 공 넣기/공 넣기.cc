#include <iostream>
using namespace std;

int main() {
    int N = 0;
    int M = 0;
    cin >> N >> M;
    
    int basket[N];
    for(int a = 0; a <= N; a++) {
        basket[a] = 0;
    }

    int i = 0;
    int j = 0;
    int k = 0;

    for(int a = 0; a < M; a++) {
        cin >> i >> j >> k;
        
        for(int b = i; b <= j; b++) {
            basket[b-1] = k;
        }
    }

    for(int a = 0; a < N; a++) {
        cout << basket[a] << " ";
    }
    
    return 0;
}