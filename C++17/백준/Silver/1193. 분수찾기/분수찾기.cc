#include <iostream>
using namespace std;

int main() {
    int x = 0;
    int line = 1;

    cin >> x;
    
    while(x - line > 0) {
        x -= line;
        line++;
    }

    if(line % 2) {
        cout << line + 1 - x << '/' << x << endl;
    }
    else {
        cout << x << '/' << line + 1 - x << endl;
    }
    
    return 0;
}