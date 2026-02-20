#include <iostream>
#include <string>
using namespace std;

int main() {
    int n = 0;
    string s;
    int group = 0;

    cin >> n;

    for(int i = 0; i < n; i++) {
        int alphabet[26] = {0,};
        int twice = 0;
        int count = 0;
        
        cin >> s;

        int length = s.length();
        while(1) {
            if(count >= length - 1) break;

            if(s[count] == s[count+1])
            {
                string s_;
                s_ += s[count];

                s.replace(count,2,s_);
                
                count--;
                length--;
            }
            count++;
        }

        for(int j = 0; j < s.length(); j++) {
            if(alphabet[s[j]-97] >= 1) {
                twice++;
                break;
            }
            alphabet[s[j]-97]++;
        }

        if(twice == 0) group++;
    }
    
    cout << group << endl;
    
    return 0;
}