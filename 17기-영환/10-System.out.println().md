# System.out.println() 을 쓰면 안되는 이유

</br>

> ❗️ [ *자바의 신 - 20장 가장 많이 쓰는 패키지는 자바랭* ] 을 보고 작성한 글 입니다.

</br>

주제에 대해서

* 어떻게 구현이 되어있으며
* 왜 쓰면 안되는지
* ~~그럼 어떻게 해야 하는지~~

에 대해서 알아보자

</br>

## 어떻게 구현이 되어있을까?

신기(?)하게도 자바 파일을 만들고, 클래스의 main 함수 안에서, 'System.out.println()' 을 실행하면 실행이 된다.

</br>

  ```java
// START

public class Main {
  System.out.println();
}

// END
```

</br>

분명 'System' 이라는 클래스를 사용하고 있는데, 어떠한 import 나 '~.java' 파일 내에 'System' 이라는 클래스를 찾아 볼 수 없다.

자바는 런타임 환경이라는 실행 환경 아래서 동작하는데, 이 실행 환경 안에 'java.lang' 이라는 패키지를 가지고 실행에 들어간다. 'java.lang' 패키지 안에 'System' 이라는 클래스가 존재한다. 따라서, 어떤 패키지나 클래스를 import 하지 않아도, 'System' 클래스에서 어떤 다른 클래스 타입의 'out' 이라는 변수에서 'println' 이라는 메소드를 호출 할 수 있게 된다.

</br>

>💡  'java.lang' 패키지의 주요 클래스들  
> Class / Object / Enum / System / Comparable / String / StringBuffer / StringBuilder / Boolean / Integer / Runnable / Throwabl / Exception / ... 가 존재하고, 나열하지 못한 많은 클래스를 가지고 있다.

</br>

또 다른 특징으로, 보통 클래스를 사용하기 위해서 생성자를 선언하는데 **System 클래스는 생성자가 없다. 생성자가 없는 대신에 static 변수 3개가 선언이 되어 있다.**

* err
* in
* **out**

익숙한 'out'이라는 변수가 보인다. 'out' 은 'PrintStream' 타입으로 선언 되어 있으며, 따라서 'println' 이라는 메소드는 'PrintStream' 클래스에 선언되어 있는 `static` 메소드 이다.

</br>

IDE 를 열어서, System 클래스를 파악해보면 생성자가 있긴 있다. public 으로 생성한 생성자는 해당 클래스 외부에서 접근하여 선언이 가능하다.

private 으로 생성자를 생성하면 컴파일러는 당연히 기본 생성자를 생성하지 않을 것이다. 또한, private 으로 생성했기 때문에 외부에서 인스턴스를 선언할 수 없게 된다. 생성자가 '없게' 되어 버린다. '대신에' System 클래스는 `static` 변수를 3개 선언 했다고 했다. 클래스 내부의 변수에 접근하여 관련 변수나 메소드를 사용 할 수 있게 해 놓은 것이다.

out은 'PrintStream' 타입의 변수로 null 로 초기화 되어있다. null 인 오브젝트 안의 메소드를 호출하면 에러가 발생하지만 'static' 으로 선언되어 있다면, 정상적으로 호출이 가능하다.

</br>

'PrintStream' 타입의 변수를 'static' 으로 선언했기 때문에 해당 클래스 내부의 변수나 메소드를 별다른 인스턴스를 생성하지 않고도, 메소드나 변수에 접근 할 수 있게 된다.

</br>


## 그렇다면 왜 쓰면 안된다는 것일까?

결국 우리가 사용하게 되는 'PrintStream' 클래스의 'println()' 을 살펴 볼 필요가 있다.

```java
// 'PrintStream' Class

...

public void println() { newLine(); }

public void println(boolean x) {
  synchronized (this) {
    print(x);
    newLine();
  }
}

...
```

</br>

단순히, 두번째 메소드에서는 'synchronized' 라는 키워드가 눈에 띄게 보인다. 전달하는 파라미터가 없는 경우에는 'newLine()' 만 호출하는 것을 볼 수 있다. 하지만, 'newLine()' 도 한번 찾아보자.

```java
// 'PrintStream' Class
...

private void newLine() {
  try {
    synchronized (this) {
      ensureOpen();
      textOut.newLine();
      textOut.flushBuffer();
      charOut.flushBuffer();
      if (autoFlush)
        out.flush();
    }
  }
  catch (InterruptedIOException x) {
    Thread.currentThread().interrupt();
  }
  catch (IOException x) {
    trouble = true;
  }
}

...
```

여기서도 'synchronized' 키워드를 볼 수 있다.

</br>

`synchronized` 는 자바에서 멀티 쓰레드 구조를 사용하게 되면, 기본적으로 고려해야되는 키워드로 여러 쓰레드가 공유하고 있는 하나의 자원에 접근할 때 발생할 수 있는 문제를 해결할 때 사용되는 키워드이다.

간단하게 설명하면 해당 키워드를 사용하게 되면, 쓰레드는 Block 이 된다. 어떤 I/O 간의 Block 은 CPU 를 점유한 채로 다른 일을 못하게 하기 때문에 성능에 좋지 않다.

> 다음에, 'synchronized' 가 성능에 미치는 영향에 대해서도 알아보자.
