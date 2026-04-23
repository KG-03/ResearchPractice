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

    vector<pair<int, int>> vec;
    int x = 0;
    int y = 0;
    for(int i = 0; i < n; i++){
        cin >> x >> y;
        vec.push_back(pair<int, int>(x, y));
    }

    sort(vec.begin(), vec.end());

    for(int i = 0; i < n; i++) {
        cout << vec[i].first << " " << vec[i].second << "\n";
    }
    return 0;
}