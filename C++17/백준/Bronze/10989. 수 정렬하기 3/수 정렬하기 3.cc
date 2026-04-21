#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    int n = 0;
    cin >> n;

    int array[10001] = {0};

    for (int i = 0; i < n; i++){
        int m = 0;
        cin >> m;
        array[m] += 1;
    }

    for (int i = 1; i < 10001; i++) {
        for (int j = 0; j < array[i]; j++) {
            cout << i << "\n";
        }
    }

    return 0;
}