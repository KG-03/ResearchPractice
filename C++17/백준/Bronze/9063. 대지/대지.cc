#include <iostream>
using namespace std;

int main() {
    int n = 0;
    cin >> n;

    int dot[n][2];
    int maxWidth = -10000;
    int minWidth = 10000;
    int maxHeight = -10000;
    int minHeight = 10000;
    
    for(int i = 0; i < n; i++){
        for(int j = 0; j < 2; j++) {
            cin >> dot[i][j];
        }
    }

    for(int i = 0; i < n; i++) {
        if(maxWidth < dot[i][0]) maxWidth = dot[i][0];
        if(minWidth > dot[i][0]) minWidth = dot[i][0];

        if(maxHeight < dot[i][1]) maxHeight = dot[i][1];
        if(minHeight > dot[i][1]) minHeight = dot[i][1];
    }

    cout << (maxWidth - minWidth) * (maxHeight - minHeight) << endl;
    
    return 0;
}