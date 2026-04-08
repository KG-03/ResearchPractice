#include <iostream>
using namespace std;

int main() {
    int n = 0;
    cin >> n;

    int sum = 0;
    int tmp = 0;
    
    for(int i = 1; i <= n; i++) {
        sum = i;
        tmp = i;
        //sum을 i로 초기화한 건 분해합의 수식, '1+2+3+123' 중에 123을 미리 더한 것과 동일한 역할.
        //각 자릿수를 확인하기 위해 tmp을 i로 초기화.
        
        while(tmp > 0) {
            sum += tmp % 10;
            tmp /= 10;
        }
        //분해합의 수식, '1+2+3+123'중에 '1+2+3'을 시행한 것.

        if(sum == n) {
            cout << i << endl;
            return 0;
        }
        //만약 '1+2+3+123'이 입력된 n과 같은 경우, 더 진행할 필요가 없음.
    }

    cout << 0 << endl;
    
	return 0;
}