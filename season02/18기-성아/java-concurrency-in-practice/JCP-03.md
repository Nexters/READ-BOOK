## 제공하는 동기화된 요소들

### 동기화된 컬렉션 클래스 (Synchronized Collection)

단일 연산은 동기화가 되어있어 스레드 안전하다.

단일 연산을 조합하는 경우 스레드 안전하지 않다.

- 반복 (iteration)
- 이동 (navigation)
- 없을 때 추가하는 경우

컬렉션 클래스가 사용하는 락을 함께 사용하면 새로 추가하는 기능을 컬렉션 클래스의 다른 메소드와 같은 수준으로 동기화할 수 있다.

- 성능 측면에서 문제가 발생할 수 있다

### Iterator와 ConcurrentModificationException

  동기화된 컬렉션 클래스에서 만들어낸 Iterator를 사용하더라도 변경 작업이 동시에 일어나는 걸 막을 수 없다. 대신 즉시 멈춘다. (fail-fast)

  값 변경 회수를 카운트하는 변수가 있고, 반복문이 실행하는 동안 변경 횟수가 바뀌면  이 발생한다.

  컬렉션 클래스의 hashCode나 equals, toString은 내부적으로 iterator를 사용한다.

### 병렬 컬렉션 (Concurrent Collection)

동기화된 컬렉션 클래스는 연산을 수행하는 시간 동안 항상 락을 확보해야 한다. 하지만 병렬 컬렉션에서는 모든 연산에서 하나의 락을 사용하지 않고 락 스트라이핑 (lock striping) 이라는 세밀한 동기화 방법을 사용한다. 아래와 같은 장점이 있다.

- 값을 읽는 연산은 많은 스레드에서 동시에 처리할 수 있다.
- 읽기 연산과 쓰기 연산을 동시에 처리할 수 있다.
- 쓰기 연산을 동시에 정해진 개수만큼 처리할 수 있다.
- 단일 스레드 환경에서 성능상의 단점을 찾아볼 수 없다.

아래와 같이 신경써야 하는 부분도 생겼다.

- 독점적으로 사용할 수 있는 락이 없어서 클라이언트 락 기법을 활용할 수 없다.

### CocurrentHashMap

  해시를 기반으로 하는 모든 컬렉션 클래스는 담고 있는 객체들의 hashCode 값이 고르게 분포되어 있지 않다면 내부 해시 테이블에 한쪽이 치우친 상태로 저장된다. 치우쳐 있으면 매번 equals를 사용해 연결 리스트와 동일하게 동작한다. 동기화 맵이라면 equals를 호출하는 동안 다른 스레드가 값을 변경할 수 없다.

  병렬 맵에서는 이 문제를 해결하여 동시에 여러 연산을 수행할 수 있다. 하지만 그 대신 `isEmpty`, `size` 같은 연산이 정확한 값이 아닌 추정치 값을 얻어온다는 단점이 있다. 독점적인 락을 제공하지 않기 때문에 연산을 추가하기 어렵다는 단점도 있다.
