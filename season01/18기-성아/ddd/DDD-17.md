## AGGREGATE의 경계

  자체적인 식별성을 지니고 여러 객체 사이에서 공유될 경우 AGGEGATE ROOT가 되어야 한다. AGGREGATE 안의 객체는 ROOT가 없으면 존재하지 않을 ENTITY, VALUE OBJECT를 포함한다.

  반복 주기마다 객체의 종류가 변할 수도 있다. 처음에는 VALUE OBJECT로 설계 했다가, 다음 반복 주기에서 ENTITY가 될 수 있다.

  모든 AGGREGATE ROOT가 REPOSITORY를 가지지는 않는다. 애플리케이션의 요구사항에 따라서 REPOSITORY를 추가한다.

  VALUE OBJECT일 경우 쉽게 변경할 수 있다. ENTITY는 기존 객체로 부터 새로운 객체를 만들 때 프로토타입 패턴을 활용한다. 하지만 JAVA에서는 프로토타입 패턴이 적합하지 않다. AGGREGATE 내부에서는 변경해도 AGGREGATE 외부에는 아무런 영향을 주지 않는다.

## 객체 생성

  FACTORY가 있어도 기본 생성자는 있어야 한다. 생성자를 통해 불변식을 검사하거나 식별성을 그대로 가지는 객체를 생성해야 한다. 새로운 AGGREGATE ROOT 생성할 때 다른 AGGREGATE 내부 객체를 생성하는 로직을 포함하여 AGGREGATE 구성을 캡슐화 한다.
