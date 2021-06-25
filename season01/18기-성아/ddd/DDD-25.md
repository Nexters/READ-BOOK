## SPECIFICATION 패턴

  업무 규칙이 ENTITY나 VALUE OBJECT가 맡고 있는 책임과 맞지 않고 규칙의 다양성과 조합이 도메인 객체의 기본 의미를 압도할 때가 있다. 그렇다고 규칙을 도메인 계층으로 분리하여 응용 계층에 둔다면 도메인 코드가 모델을 표현할 수 없어 상황이 악화된다.

  논리 프로그래밍에서 술어를 통해 구현했던 규칙을 객체로 대신 한다. 규칙을 가지고 있는 객체를 SPECFICATION이라고 한다. 논리 프로그래밍에서 술어를 조합했듯이 SPECFICIATION도 조합할 수 있다. 규칙을 도메인 계층에 유지한다. 

  SPECFICIATION 패턴은 세 가지 목적이 있다. 첫 번째 검증, 두 번째 (Collection에서)선택, 세 번쨰 생성이다. 

  검증은 SPECIFICATION의 가장 다순한 용도이고 개념을 직관적으로 설명해주는 방식이다.

  선택은 SPECFICIATION의 명시된 조건에 따라 Collection에서 일치하는 객체들만 선택하는 방식이다. 

  가장 간단한 선택 구현 방식은 SPECFICATION에서 명시된 Collection을 조회할 수 있는 SQL을 가지고 있고 REPOSITORY에 요청하는 방식이다. 이 방식은 도메인 레이어에 테이블 구조가 노출되는 문제가 있다. 

  다른 구현 방식은 DOUBLE DISPATCH 패턴을 사용하는 방식이다. 실제 Repository에 조회하는 메소드(A)가 있고 SPECFICIATION을 입력받는 메소드(B)가 있다. SPECFICIATION 내부에 A를 호출하는 메소드 (C)가 있다. B가 호출되면 C가 호출되고, C에서 A가 호출되므로 결과적으로는 A가 호출된 결과가 C의 결과값으로 반환된다.
