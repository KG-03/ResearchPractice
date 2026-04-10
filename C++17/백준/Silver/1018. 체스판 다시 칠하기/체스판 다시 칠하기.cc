#include <iostream>
#include <algorithm>
using namespace std;

string WB[8] = {
    "WBWBWBWB",
    "BWBWBWBW",
    "WBWBWBWB",
    "BWBWBWBW",
    "WBWBWBWB",
    "BWBWBWBW",
    "WBWBWBWB",
    "BWBWBWBW"
};
string BW[8] = {
    "BWBWBWBW",
    "WBWBWBWB",
    "BWBWBWBW",
    "WBWBWBWB",
    "BWBWBWBW",
    "WBWBWBWB",
    "BWBWBWBW",
    "WBWBWBWB"
};

int WB_cnt(int x, int y, string* board) {
    int cnt = 0;
    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            if(board[x+i][y+j] != WB[i][j]) cnt++;
        }
    }
    return cnt;
}

int BW_cnt(int x, int y, string* board) {
    int cnt = 0;
    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < 8; j++) {
            if(board[x+i][y+j] != BW[i][j]) cnt++;
        }
    }
    return cnt;
}

int main() {
    int n = 0;
    int m = 0;
    cin >> n >> m;
    
    string board[50];
    int min = 99999;
    
    for (int i = 0; i < n; i++) {
        cin >> board[i];
    }

    for (int i = 0; i + 8 <= n; i++) {
        for (int j = 0; j + 8 <= m; j++) {
            int tmp = 0;
            tmp = std::min(WB_cnt(i,j,board), BW_cnt(i,j,board));
            if (tmp < min) min = tmp;
        }
    }

    cout << min << endl;
    return 0;
}