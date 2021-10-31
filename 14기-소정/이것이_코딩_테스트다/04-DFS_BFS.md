# DFS / BFS
## 꼭 필요한 자료구조 기초

- 탐색
  - 많은 양의 데이터 중에 원하는 데이터를 찾는 과정
  - DFS, BFS는 대표적인 탐색 알고리즘이다.
  - 이 둘을 이해하려면 스택과 큐를 이해해야 한다.
- 자료구조
  - 데이터를 표현, 관리, 처리하기 위한 구조
- 오버플로
  - 자료구조가 수용할 수 있는 데이터 크기가 이미 찬 상태에서 삽입(push)을 수행할 때 발생
- 언더플로
  - 자료구조에 데이터가 전혀 있지 않은 상태에서 삭제(pop)를 수행할 때 발생

### 스택

- 선입후출
  - 박스 쌓기와 같다.
  - 아래에서 위로 쌓는다.
  - 아래에 있는 박스를 치우려면 위에 있는 박스를 먼저 내려야 한다.

```python
stack = []

stack.append(5)
stack.append(2)
stack.append(3)
stack.append(7)

stack.pop()

stack.append(1)
stack.append(4)

stack.pop()

# 최하단 원소부터 출력
# [5, 2, 3, 1]
print(stack)

# 최상단 원소부터 출력
# [1, 3, 2, 5]
print(stack[::-1])
```

- append()는 리스트의 가장 뒤쪽에 데이터를 삽입한다.
- pop()은 리스트의 가장 뒤쪽에서 데이터를 꺼낸다.

### 큐

- 선입선출
  - 대기 줄과 같다.
  - 먼저 온 사람이 먼저 들어간다.
  - 나중에 온 사람이 나중에 들어간다.

```python
# 큐 구현을 위해 deque 라이브러리를 사용한다.
from collections import deque

queue = deque()

queue.append(5)
queue.append(2)
queue.append(3)
queue.append(7)

queue.popleft()

queue.append(1)
queue.append(4)

queue.popleft()

# 먼저 들어온 순서대로 출력한다.
# deque([3, 7, 1, 4])
print(queue)

# 역순으로 바꾼다.
queue.reverse()
# deque([4, 1, 7, 3])
print(queue)
```

- 파이썬으로 큐를 구현할 때는 collections 모듈의 deque 자료구조를 활용한다.
  - 스택과 큐의 장점을 모두 채택했다.
  - 데이터를 넣고 빼는 속도가 리스트에 비해 효율적이다.
  - queue 라이브러리보다 간단하다.
  - 대부분 코딩 테스트에서는 collection 모듈 등의 사용을 허용한다.
- deque 객체를 리스트로 바꾸려면 list(queue)를 사용한다.

### 재귀 함수

- 자기 자신을 다시 호출하는 함수
- DFS, BFS를 구현하려면 재귀를 이해해야 한다.

```python
def recursive_function():
  print('재귀 함수를 호출합니다.')
  recursive_function()
  
# 호출한다.
recursive_function()
```

위 함수를 실행하면 문자열이 무한이 출력되면서 결국 오류 메시지가 나오고 멈춘다.

#### 재귀 함수의 종료 조건

- 재귀 함수는 무한히 호출되지 않도록 종료 조건을 꼭 명시해야 한다.

```python
def recursive_function(i):
  # 100번째 출력했을 때 종료되도록 한다.
  if i == 100:
    return
  
  print(i, '번째 재귀 함수에서', i+1, '번째 재귀 함수를 호출합니다.')
  recursive_function(i+1)
  print(i, '번째 재귀 함수를 종료합니다.')
  
recursive_function(1)
```

- 재귀 함수는 스택을 이용한다.
  - 함수를 계속 호출했을 때 가장 마지막에 호출한 함수가 먼저 끝내야 그 앞의 함수도 종료된다.
- 따라서 스택을 활용하는 알고리즘은 재귀를 이용하면 간편하게 구현할 수 있다.

```python
# 반복적으로 구현한 팩토리얼
def factorial_iterative(n):
  result = 1
  
  # 1부터 n까지의 수를 차례로 곱한다.
  for i in range(1, n + 1):
    result *= i
    
  return result
  
# 재귀적으로 구현한 팩토리얼
def factorial_recursive(n):
  # n이 1 이하인 경우 1을 반환한다.
  if n <= 1:
    return 1
    
  # n! = n * (n - 1)!을 그대로 구현한다.
  return n * factorial_recursive(n-1)
```

- 재귀 함수를 사용하면 코드가 더 간결해진다.
  - 특정한 함수를 자신보다 더 작은 변수에 대한 함수와의 관계로 표현한 점화식을 그대로 코드로 옮겼기 때문이다.
  - 이 개념은 다이나믹 프로그래밍으로 이어진다.
- 팩토리얼은 n이 양수일 때만 유효하기 때문에 n <= 1인 경우는 1을 반환해서 종료하도록 한다.