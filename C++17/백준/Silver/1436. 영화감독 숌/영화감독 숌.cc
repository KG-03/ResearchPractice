#include <iostream>
#include <string>
using namespace std;

int main() {
    int n = 0;
    cin >> n;

    int num = 0;
    int six = 0;
    string s;

    while(1) {
        if(six == n) break;
        
        num++;
        s = to_string(num);
        if (s.find("666") != string::npos) {
            six++;
        }
    }
    
    cout << num << endl;
    
    return 0;
}