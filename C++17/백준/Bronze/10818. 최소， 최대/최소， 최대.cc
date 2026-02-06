#include <iostream>
using namespace std;

int main() {
    int N = 0;
    cin >> N;
    
    int array[N];
    for(int i = 0; i < N; i++) {
        cin >> array[i];
    }

    int min = array[0];
    int max = array[0];

    for (int i = 1; i < N; i++) {
        if(min > array[i]) min = array[i];
        if(max < array[i]) max = array[i];
    }

    cout << min << " " << max << endl;
}