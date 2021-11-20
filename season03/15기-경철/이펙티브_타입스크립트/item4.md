# item 4. 구조적 타이핑에 익숙해지기

- [item 4. 구조적 타이핑에 익숙해지기](#item-4-구조적-타이핑에-익숙해지기)
  - [구조적 타이핑](#구조적-타이핑)
    - [구조적 타이핑의 문제점](#구조적-타이핑의-문제점)
    - [테스트와 구조적 타이핑](#테스트와-구조적-타이핑)
  - [참고](#참고)

자바스크립트는 본질적으로 덕 타이핑 `duck typing` 기반이다.

> 덕 타이핑이란 객체가 어떤 타입에 부합하는 변수와 메서드를 가진 경우 객체를 해당 타입에 속하는 것으로 간주하는 방식.

타입스크립트 또한 매개변수 값이 요구사항을 만족한다면 타입이 무엇인지 신경 쓰지 않는 동작을 그대로 모델링한다. 타입 체커가 타입을 이해하고 있는 것과 개발자가 타입을 이해하는게 조금 다를 수 있기 때문에 가끔 예상치 못한 결과가 나타날때가 있다.

## 구조적 타이핑

```tsx
interface Vector2D {
    x: number;
    y: number;
}
```

위와 같이 2D 백터 타입을 표현하는 `Vector2D`가 있다고 가정한다.

```tsx
function calculateLength(v: Vector2D) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}
```

그리고 백터 길이를 계산하는 `calculateLength`가 있다. 이 상태에서 이름을 가진 `NamedVector`를 다음과 같이 정의한다.

```tsx
interface NamedVector {
    name: string;
    x: number;
    y: number;
}
```

`NamedVector`는 `Vector2D`와 마찬가지로 x, y 프로퍼티를 가지고 있다. 때문에 `calculateLength`의 인자로 `NamedVector`가 들어가더라도 호환이 되기 때문에 `calculateLength` 호출이 가능하다.

위와 같이 구조가 호환이 되면 같은 타입으로 받아들이기 때문에 **구조적 타이핑**이라는 용어가 나타난다.

### 구조적 타이핑의 문제점

이와 같은 구조적 타이핑의 특징 때문에 문제가 발생하기도 한다.

```tsx
interface Vector3D {
    x: number;
    y: number;
    z: number;
    }
```

위와 같이 3D 백터를 표현하는 `Vector3D`가 위와 같이 정의되어있다고 가정한다. 그리고 백터의 길이를 1로 만드는 정규화 함수 `normalize`를 다음과 같이 정의한다.

```tsx
function normalize(v: Vector3D) {
    const length = calculateLength(v);

    return {
        x: v.x / length,
        y: v.y / length,
        z: v.z / length,
    }
}
```

> calculateLength는 앞서 구현한 Vector2D를 인자로 받는 함수이다.
> 

여기서 calculateLength는 Vector2D를 인자로 받는다. Vector2D의 x와 y 필드만 사용하므로 Vector3D에 정의된 z는 정규화에서 무시된 채 결과가 나타난다. 구조적 타이핑에서는 Vector3D가 Vector2D에 필요한 x, y를 가지고 있기 떄문에 타입 체커가 이 문제를 잡지 못한 것이다.

구조적 타이핑은 클래스와 관련된 할당문에서도 예상치 못한 결과를 보여준다.

```tsx
class C {
    foo: string;

    constructor(foo: string) {
        this.foo = foo;
    }
}
```

위와 같이 클래스 C를 정의한다.

```tsx
const c = new C('create as constructor');
const d: C = { foo: 'create as object literal' } // not error
```

위 코드는 정상적으로 동작한다. d를 C 타입으로 정의했지만 C의 생성자를 사용하지 않고 객체 리터럴을 사용하여 C의 필드와 동일하게 정의하더라도 타입 C로 인식한다. 구조적 타이핑에서는 필요한 속성과 생성자가 존재하기 때문에 문제가 없다.

### 테스트와 구조적 타이핑

테스트를 작성할때는 구조적 타이핑이 유리하다. 구조적 타이핑을 활용하면 손쉽게 목킹 `mocking`이 가능하여 실제 로직과 테스트에 특화된 로직을 분리할 수 있다.

```tsx
interface Author {
    first: string;
    last: string;
}

function getAuthors(database: PostgresDB): Author[]{
    const authorRows = database.runQuery(`SELECT FIRST, LAST FROM AUTHORS`); 
    return authorRows.map(row => ({first: row[0], last: row[1]}});
}
```

위와 같이 database 객체를 받아 Author를 조회하는 getAuthors 메서드가 있다. 여기서 실제 로직이 들어있는 PostgresDB를 테스트에 사용할수는 없으므로 이를 목킹한 Database가 필요하다. 이를 구조적 타이핑을 통해 목킹할 수 있다.

```tsx
interface DB {
    runQuery: (sql: string) => any[];
}

function getAuthors(database: DB): Author[]{
    const authorRows = database.runQuery(`SELECT FIRST, LAST FROM AUTHORS`); 
    return authorRows.map(row => ({first: row[0], last: row[1]}});
}
```

위와 같이 DB 인터페이스를 정의하고 getAuthors에서 이를 인자로 받도록 만든다. 이를 통해 테스트에 필요한 DB 객체를 손쉽게 갈아끼워 테스트할 수 있다.

## 참고

이펙티브 타입스크립트 (댄 밴더캄 저, 장원호 역) item 4: [http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966263134](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966263134)