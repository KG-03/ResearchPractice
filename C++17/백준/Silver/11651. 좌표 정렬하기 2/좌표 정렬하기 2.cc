#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);
    
    int n = 0;
    cin >> n;

    vector<pair<int, int>>vec;
    int x = 0;
    int y = 0;

    for(int i = 0; i < n; i++) {
        cin >> x;
        cin >> y;
        vec.push_back(pair<int, int>(y, x));
    }

    sort(vec.begin(), vec.end());

    for(int i = 0; i < n; i++) {
        cout << vec[i].second << " " << vec[i].first << "\n";
    }
    
    return 0;
}
