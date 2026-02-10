#include <iostream>
using namespace std;

int main() {
    int N = 0;
    int M = 0;

    cin >> N;
    
    int score[N];

    for (int i = 0; i < N; i++) {
        cin >> score[i];
    }

    for(int i = 0; i < N; i++) {
        if (score[i] > M) {
            M = score[i];
        }
    }

    float newScore[N];

    for(int i = 0; i < N; i++) {
        newScore[i] = (float)score[i] / M * 100;
    }

    float avg = 0.0;

    for (int i = 0; i < N; i++) {
        avg += newScore[i];
    }
    avg = avg / N;

    cout << avg << endl;

    
    return 0;
}