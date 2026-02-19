#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    string croatia [8] = {"c=", "c-", "dz=", "d-", "lj", "nj", "s=", "z="};
    int index = 0;

    cin >> s;
    
    for(int i = 0; i < 8; i++) {
        while(1) {
            index = s.find(croatia[i]);
            if (index == string::npos)
                break;

            s.replace(index, croatia[i].length(), "#");            
        }
    }

    cout << s.length() << endl;

    return 0;
}