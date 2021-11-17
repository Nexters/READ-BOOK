# item 3. 코드 생성과 타입이 관계없음을 이해하기

- [item 3. 코드 생성과 타입이 관계없음을 이해하기](#item-3-코드-생성과-타입이-관계없음을-이해하기)
  - [타입 오류가 있는 코드 컴파일](#타입-오류가-있는-코드-컴파일)
  - [런타임에는 타입체크 불가](#런타임에는-타입체크-불가)
  - [타입 연산은 런타임에 영향을 주지 않는다.](#타입-연산은-런타임에-영향을-주지-않는다)
  - [런타임 타입은 선언된 타입과 다를 수 있다.](#런타임-타입은-선언된-타입과-다를-수-있다)
  - [타입스크립트 타입으로 함수를 오버로드할 수 없다.](#타입스크립트-타입으로-함수를-오버로드할-수-없다)
  - [타입스크립트 타입은 런타임 성능에 영향을 주지 않는다.](#타입스크립트-타입은-런타임-성능에-영향을-주지-않는다)
  - [참고](#참고)

타입스크립트는 다음과 같은 역할을 한다.

- 최신 타입스크립트 또는 자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일링
- 코드의 타입 오류 체크

여기서 유의해야할 점은 두 동작이 서로 독립적이라는 것이다. 즉, 타입스크립트가 자바스크립트로 변환될 때 코드 내의 타입에는 영향을 주지 않고 런타임에도 타입은 영향을 주지 않는다.

이 점으로 미뤄볼 때 타입스크립트가 할 수 있는 일과 없는 일을 다음과 같이 구분할 수 있다.

## 타입 오류가 있는 코드 컴파일

앞서 타입스크립트의 역할 트랜스파일링과 타입 오류 체크는 서로 독립적이라고 했다. 때문에 타입스크립트 코드에 타입오류가 존재하더라도 어떤 부분에서 오류가 발생하는지 알려주고 컴파일을 한다.

만약 오류가 있을때 컴파일을 하지 못하게 만들고 싶다면 tsconfig의 `noEmitOnError` 옵션을 활성화해야한다.

## 런타임에는 타입체크 불가

앞서 런타임에는 타입이 영향을 주지않는다고 했다. 타입스크립트는 컴파일 시에 타입체크를 하고 모든 인터페이스, 타입, 타입 구문은 제거한다.

```tsx
interface Square {
    width: number;
}

interface Rectangle extends Square {
    height: number;
}

type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
    if (shape instanceof Rectangle) {
        return shape.width * shape.height;
    }

    return shape.width * shape.width;
}
```

위와 같은 타입스크립트 코드가 있다고 가정한다. `calculateArea` 내의 instanceof 타입 체크는 런타임에 일어나지만 Rectangle은 타입이기 때문에 런타임에서는 아무런 역할을 하지 않는다.

위와 같은 경우에는 런타임에 타입 정보를 유지하는 방법이 필요하다. 먼저 필드가 존재하는지 체크해볼 수 있다.

```tsx
function calculateArea(shape: Shape) {
    if ('height' in shape) {
        return shape.width * shape.height;
    }
    return shape.width * shape.width;	
}
```

또다른 방법으로는 런타임에 접근할 수 있는 타입 정보를 남기는 방법이 있다.

```tsx
interface Square {
    kind: 'square';
    width: number;
}

interface Rectangle {
    kind: 'rectangle';
    width: number;
    height: number;
}
```

런타임에 접근 불가능한 타입과  접근 가능한 값을 둘 다 사용하는 기법도 존재한다. 타입을 클래스로 정의하면 된다. 즉, 클래스로 정의하면 `shape instanceof Rectangle` 부분에서 값으로 참조할 수 있다.

## 타입 연산은 런타임에 영향을 주지 않는다.

```tsx
function asNumber(val: number | string): number {
    return val as number
}
```

위 코드는 `as number`를 통해 항상 val을 number로 만드는 코드이다. 위 코드를 자바스크립트로 트랜스파일하면 다음과 같이 나타난다.

```tsx
function asumber(val) {
    return val;
}
```

트랜스파일된 자바스크립트 코드에는 아무런 정제 과정이 없다. 이는 `as number`가 타입 연산이고 런타임에는 아무런 영향을 주지 않기 때문이다.

만약 값을 정제해야한다면 런타임에 타입을 체크하고 자바스크립트 연산을 통해 변환해야한다.

```tsx
function asNubmer(val: number | string) {
    return typeof(val) === 'string' ? Number(val) : val;
    }
```

## 런타임 타입은 선언된 타입과 다를 수 있다.

```tsx
function setLightSwitch(value: boolean) { 
    switch (value) {
        case true: 
            turnlightOn(); 
            break;
        case false: 
            turnlightOff(); 
            break;
        default:
            console.log(‘실행되지 않을까 봐 걱정됩니다.、);
    } 
}
```

위 코드만 봤을때는 default 문의 `console.log`가 실행될 수 있을까 싶지만 위 코드가 자바스크립트로 트랜스파일하면 boolean으로 선언된 타입은 런타임에 제거된다. 즉, 런타임에서는 value가 boolean이 아닌 다른 값이 들어올 수 있다는 점이다.

만약 value에 `"ON"` 문자열이 들어온다면 default 문의 `console.log`가 실행된다. 이처럼 타입스크립트에서는 선언된 타입과 런타임의 타입이 맞지 않을 수 있음을 명심해야한다.

## 타입스크립트 타입으로 함수를 오버로드할 수 없다.

C++과 Java 같은 언어에서는 메서드 명이 같더라도 타입의 갯수, 타입의 차이를 두어 오버로드를 할 수 있다. 하지만 자바스크립트에서는 기본적으로 함수 오버로드를 지원하지 않는다. 이 말은 타입스크립트 또한 런타임에는 자바스크립트로 동작하므로 함수 오버로드는 불가능하다.

타입스크립트 코드 수준으로 함수 오버로드를 지원하기는 하지만 이는 타입 수준에서만 동작한다.

## 타입스크립트 타입은 런타임 성능에 영향을 주지 않는다.

타입과 타입 연산자는 자바스크립트 변환 시점에 제거되기 때문에, 런타임의 성능에 아무런 영향을 주지 않는다.

## 참고

이펙티브 타입스크립트 (댄 밴더캄 저, 장원호 역) item 3: [http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966263134](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966263134)