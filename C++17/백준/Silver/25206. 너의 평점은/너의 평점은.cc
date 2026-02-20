#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    float majorGPA[9] = {4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.0};    
    float avg = 0.0;
    float unit = 0.0;
    int pass = 0;

    for(int i = 0; i < 20; i++) {
        getline(cin, s);

        int space = s.find(' ');
        
        if(s[space+5] != 'F' && s[space+5] != 'P') {
            if(s[space+6] == '+') {
                int n = (s[space+5]-65) * 2;
                int m = s[space+1]-48;
                
                avg += majorGPA[n] * m;
                unit += m;
            }
            else if(s[space+6] == '0') {
                int n = (s[space+5]-65) * 2 + 1;
                int m = s[space+1]-48;
                
                avg += majorGPA[n] * m;
                unit += m;
            }
        }

        if(s[space+5] == 'F') {
            int n = (s[space+5]-65 - 1) * 2;
            int m = s[space+1]-48;

            unit += m;
        }
    }

    cout.precision(6);
    cout << fixed;

    cout << avg / unit << endl;
    
    return 0;
}