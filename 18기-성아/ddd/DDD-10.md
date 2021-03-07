## Factory

  Aggregate, Entity, VO를 생성하는 역할을 한다. 연관관계가 복잡하다면 생성 로직이 복잡해지는 데 이를 캡슐화하는 데 사용한다. Factory는 도메인 계층에 존재해야 한다. 클라이언트가 직접 연관관계를 설정할 경우 Aggregate의 캡슐화를 위반할 수 있다. Factory는 일반적으로 불변식 검사를 Entity에게 위임한다. Factory는 method일 수도 있으며 객체일 수도 있다.

## Repository

  Repository는 구현을 위한 도메인 모델이다. Aggregate 단위로 도메인 객체를 저장하고 조회한다. Repository 메소드는 완전한 Aggregate를 제공한다. Entity를 직접적으로 참조할 경우 Aggregate 내에 정해놓은 무결성이 깨지기 쉬운데, Repository는 Aggregate 단위로 참조하여 무결성을 지키면서 Aggregate를 조작할 수 있다. Repository를 사용하면 객체 접근을 제한하는 설계를 유지할 수 있다. DAO와는 영속성 매커니즘의 추상적 개념을 제공한다는 점에서 공통점이 있지만 DAO는 데이터베이스 테이블에 종속적이고, Repository는 도메인 객체와 종속적이라는 게 차이점이다.
