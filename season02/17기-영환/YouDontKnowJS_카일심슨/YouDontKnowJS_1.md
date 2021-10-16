# You Don`t Know JS ('타입과 문법, 스코프와 클로저')

Part 1. [타입과 문법](Part-1-타입과-문법)

1. [타입](타입)

<br/>

## Part 1 타입과 문법

---

### 1. 타입

- 정적 타입형 언어(Java, ...)에 비해서 관대한 타입 체계를 가지고 있지만, 엔진에서 해석하는 42(숫자), '42(문자)' 가 다르듯이 자바스크립트에서도 이를 구분하여 연산을 수행하기 때문에 타입을 가지고 있다고 봐야한다.
- '어떤 형태로든 거의 모든 자바스크립트 프로그램에서 `강제변환`이 일어난다.'
- 내장 타입 : `null`, `undefined`, `number`, `string`, `boolean`, `object`, `symbol`
- 원시 타입 (primitive type) : `null`, `undefined`, `number`, `string`, `boolean`, `object`
- `typeof`
  - 'falsy'
  - 'object' 의 하위 타입 : `null`, `function`, `array`
  - typeof 의 반환값은 언제나 `string` (`typeof typeof 42` // return "string")
- 자바스크립트에서 타입이란 엄밀히 말해서 값에 대한 타입을 말한다.
- 'undefind'
  - 값이 없는 것과 선언되지 않은 것('not declared')의 차이
- 선언되지 않은 변수
  - 자바스크립트에서는 '선언되지 않은 변수'에 대해서 오류가 아닌 'undefind' 를 내밷는다.
