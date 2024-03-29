## 스레드 풀 활용

- 작업 정의와 작업 실행을 분리한다.
- 독립적인 작업의 정의
    - 타이밍이나 작업 결과, 다른 작업이 실행하는 데서 발생하는 부수적인 요건에 관계없이 동작하는 작업
- 일정한 조건을 갖춘 실행 정책이 필요한 작업
    - 의존성이 있는 작업
        - 의존성이 있는 경우 보이지 않는 조건을 건다. 활동성 문제가 발생한다.
    - 스레드 한정 기법을 사용하는 작업
        - 단일 스레드로 동작해야 한다는 조건이 걸린다. 여러 스레드를 사용하면 스레드 안정성을 쉽게 잃는다.
    - 응답 시간이 민감한 작업
    - ThreadLocal을 사용하는 작업
        - 작업이 항상 동일한 스레드 내에서 이뤄져야 한다.

## 스레드 부족 데드락

- 스레드 풀에서 다른 작업에 의존성을 가지는 작업을 실행하면 데드락에 걸릴 가능성이 높다. 모든 스레드가 큐에 쌓여 아직 실행되지 않은 작업의 결과를 받으려고 대기 중이라면 스레드 부족 데드락이 발생한다.
- 스레드 풀에서 필요로 하는 자원이 제한되어 원하는 크기보다 작은 수준에서 동작할 수 있다.
- 오래 실행되는 작업
    - 특정 작업이 예상보다 긴 시간동안 종료되지 않고 실행된다면 스레드 풀의 응답 속도에 문제점이 생긴다.
    - 오래 실행되는 작업은 타임아웃을 설정하고 타임아웃이 발생하면 작업을 종료시킨 후 다음 큐의 맨뒤에 추가한다.

## 스레드 풀 크기 조절

- 스레드 풀의 이상적인 크기는 스레드 풀에서 실행할 작업의 종류와 스레드 풀을 활용할 애플리케이션의 특성에 따라 결정 된다.
- 스레드 풀의 크기를 하드코딩하는 것은 좋은 방법이 아니고 동적으로 설정해야 한다.
- CPU를 많이 사용하는 작업이라면 N 개의 CPU를 탑재하고 있는 하드웨어에서 스레드 풀을 사용할 때 N+1 개의 스레드를 가지면 최적의 성능을 발휘한다.
- I/O 작업이 많거나 블로킹 작업을 해야하는 경우라면 스레드 풀의 크기를 크게 잡아야 한다.
