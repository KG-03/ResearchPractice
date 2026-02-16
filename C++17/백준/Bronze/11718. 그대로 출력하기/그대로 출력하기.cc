#include <iostream>
using namespace std;

int main() {
    string S;

    while(1) {
        getline(cin, S);
        cout << S << endl;
        
        if(cin.eof()) break;
    }

    return 0;
}