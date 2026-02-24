#include <iostream>
using namespace std;

int main() {
    int array[9][9];

    int max = -1;
    int row = 0;
    int column = 0;

    for(int i = 0; i < 9; i++) {
        for(int j = 0; j < 9; j++) {
            cin >> array[i][j];

            if(array[i][j] > max) {
                max = array[i][j];
                row = i + 1;
                column = j + 1;
            }
        }
    }

    cout << max << endl;
    cout << row  << " " << column << endl;
    
    return 0;
}