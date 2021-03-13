> '자바의 신 - 20장 가장 많이 쓰는 패키지는 자바랭' 을 읽고 정리한 내용 입니다.

# System

프로그래밍 언어를 배울 때, 많은 경우 'Hello World!' 를 모니터 화면에 출력하면서 시작한다.

```
--- START ---

public class Hello {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}

--- END ---
```

자바를 배울 때도 마찬가지인데, 'System.out.println()' 이라는 함수를 사용하여 출력하는 경험을 하게된다.

여지껏 출력하는 행위에 신이나서, 'System.out.println()' 을 무의식적으로 톺아 볼 기회가 없었다.

자바를 경험한 상태에서, 'System.out.println()' 메소드를 실행 가능하게 했던 것은 무엇일까.

패키지 import 에 익숙한 자바 유저들에게 놀랍게도, 자바에서 'System' 클래스는 어떤 것도 요구하지 않는다.

자바는 여느 스크립트 언어와 컴파일 언어와는 다르게 JRE 위에서 동작하게 된다. (JVM 은 JRE 환경 아래서 바이트 코드를 실행하는 머신)

자바는 여러 'Java API' 에 도움을 얻게 되는데, 해당 API 에 java.lang 패키지 안에 System 클래스가 존재한다.

그럼 'java.lang' 을 import 받아야 하지 않을까?

'java.lang' 패키지는 자바의 패키지 중에서 유일하게 import 를 하지 않아도 사용할 수 있다.

왜 그럴까.

JRE는 JVM 과 Java API 를 제공한다.

JVM 은 사용자가 작성 한 바이트 코드를 분석 및 실행을 담당하며, 해당 과정에서 소위 'T 메모리 구조' 라는 영역에 클래스, 메소드, 인스턴스 등이 배치하게 되는데, 클래스가 위치하는 'static 영역' 에 'java.lang' 패키지의 클래스들이 위치하게 되어 무탈하게 사용할 수 있게 된 것이다.