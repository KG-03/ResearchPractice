#include <iostream>
using namespace std;

int main() {
    int n = 0;
    cin >> n;

    int location = 1;

    //honeycomb
    int before = 0;
    int after = 1;
    while(1) {
        before = after;
        after += 6 * location;
        
        if (before >= n) break;
        
        location++;
    }

    cout << location << endl;
    
    return 0;
}