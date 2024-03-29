## 1장 정리

  도메인 주도 설계는 모델을 동작하게 만들어 문제를 해결한다. 지식 탐구를 바탕으로 혼란스러운 정보에서 정수를 추출해 실질적인 모델로 만든다. MODEL-DRIVEN DESIGN은 모델과 구현을 매우 밀접하게 연결한다. UBIQUITOUS LANGUAGE는 개발자와 도메인 전문가, 소프트웨어 사이에 흐르는 모든 정보의 통로에 해당한다.

## 핵심 키워드

- 모델
- 지식 탐구
- 공통 언어

## 모델 주도 설계의 기본 요소

  이제 어떻게 하면 모델 주도 설계를 적용할 수 있을지에 대해서 다룬다. 모델 주도 설계는 책임 주도 설계, 계약에 의한 설계 등에 기반을 둔 설계 방법이다. 모델 주도 설계를 적용하기 위해서는 기반 설계방법에 대해서 이해할 필요가 있다. 

  모델 주도 설계에서는 도메인을 격리시키는 것이 중요하다. 소프트웨어의 각 요소들이 도메인에 종속되서는 안된다. 예를 들어, UI, 데이터베이스 등의 요소들이 도메인에 종속된다면  변경이 어려워질 것이다. 소프트웨어 각 요소를 이루는 개념과 도메인 개념이 혼동될 수도 있다.

  도메인 격리를 할 수 있는 가장 좋은 방법은 계층형 아키텍쳐를 적용하는 것이다. 소프트웨어를 사용자 인터페이스, 응용, 도메인, 인프라스트럭쳐의 계층으로 나눈다. 한 계층의 요소는 같은 계층의 다른 요소나 하위 게층에만 의존해야 한다.

  계층이 잘 나누어지면 응집력있는 설계가 가능해지고 설계를 이해하는 데에도 도움이 된다.

  계층 간 관계를 설정할 때는 설계의 의존성을 한 방향에서만 두어야 한다. 상위 계층에서 하위 계층으로의 의존성만 있어야지 하위 계층에서 상위 계층으로 의존성이 있으면 안된다. 만약 하위 계층에서 상위 계층에 통신이 필요할 경우 콜백이나 옵저버 패턴을 활용한다.
