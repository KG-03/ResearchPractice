#include <iostream>
#include <algorithm>
using namespace std;

bool cmp (string a, string b) {
    if (a.length() == b. length()) {
        return a < b;
    }
    else {
        return a.length() < b.length();
    }
}

string s[20000];

int main() {
    int n = 0;
    cin >> n;

    for (int i = 0; i < n; i++) {
        cin >> s[i];
    }

    sort(s, s+n, cmp);

    string tmp;
    for (int i = 0; i < n; i++) {
        if (s[i] == tmp) {
            continue;
        }
        cout << s[i] << endl;
        tmp = s[i];
    }

    return 0;
}