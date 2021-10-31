# item 2. 타입스크립트 설정 이해하기

- [item 2. 타입스크립트 설정 이해하기](#item-2-타입스크립트-설정-이해하기)
  - [tsconfig](#tsconfig)
    - [noImplicitAny](#noimplicitany)
    - [strictNullChecks](#strictnullchecks)
    - [strict](#strict)
  - [참고](#참고)

## tsconfig

타입스크립트 컴파일러에는 무수히 많은 설정을 할 수 있다. `noImplicitAny`, `baseUrl`, `strictNullChecks` 등의 설정이 존재하는데 컴파일시 커멘드라인 옵션으로 제공하거나 타입스크립트 설정 파일인 `tsconfig.json`에 설정을 통해 사용할 수 있다.

```bash
tsc --noImplicitAny item2.ts
```

위 명령은 `item2.ts` 파일을 noImplicitAny 옵션을 활성화하여 실행하는 옵션이다. 위 옵션을 `tsconfig.json`으로 표현하면 다음과 같다.

```json
{
    "compilerOptions": {
        "noImplicitAny": true
    }
}
```

가급적이면 `tsconfig` 파일을 사용하는 것을 추천한다. 이를 통해 함께 프로젝트를 하는 동료들이 어떤 옵션으로 타입스크립트를 활용하는지 명시적으로 확인할 수 있다. 참고로 `tsconfig` 파일은 `tsc --init` 명령으로 손쉽게 생성할 수 있다.

`tsconfig` 옵션은 어디서 소스 파일을 찾을지 어떤 종류의 출력을 생성할 지 제어하는 내용이 대부분이다. 다만, 잘 사용하지는 않지만 언어 자체의 핵심요소를 제어할 수 있는 옵션도 있다. 이들을 어떻게 사용하느냐에 따라 아예 다른 언어처럼 느껴질 수 있다.

타입스크립트를 잘 사용하기 위해서는 `noImplicitAny`와 `strictNullChecks` 옵션은 이해하고 가는 것이 좋다.

### noImplicitAny

`noImplicitAny`는 변수들이 미리 정의된 타입을 가져야 하는지 여부를 제어하는 옵션이다.

```tsx
function add(x, y) {
    return x + y
}
```

위 코드는 `noImplicitAny` 옵션이 false일 때 유효하다. 왜냐면 타입스크립트 컴파일러는 add의 인자와 반환 값이 모두 any로 추론하기 때문이다.

```tsx
function add(x: any, y: any): any {
    return x + y
}
```

즉, any를 코드에 명시하지는 않았지만 암묵적으로 타입스크립트 컴파일러는 any로 간주하기 때문에 이를 암시적 any `ImplicitAny` 라고 부른다.

`noImplicitAny`를 활성화했을때 위 코드가 정상적으로 동작하도록 만들려면 any를 명시적으로 선언하거나 타입을 분명히 선언해주면 된다.

```tsx
function add(x: number, y: number) {
    return x + y
}
```

위 경우 인자 x, y를 number 타입으로 명시하였고 x + y는 타입스크립트 컴파일러가 number로 추론이 가능하기 때문에 오류없이 컴파일이 가능하다.

타입스크립트는 타입 정보를 가질때 가장 효과적이므로 `noImplicitAny` 옵션을 활성화하는 것을 추천한다. `noImplicitAny`을 비활성화하는경우는 자바스크립트 코드를 타입스크립트로 전환하는 상황에만 필요하다.

### strictNullChecks

`strictNullChecks`는 null과 undefined가 모든 타입에서 허용되는지 확인하는 옵션이다.

```tsx
const x: number = null
```

위 코드는 `strictNullChecks` 가 비활성화되었을 때 유효하다. 그 반대로 `strictNullChecks`가 활성화 된 경우라면 오류가 발생한다. 이는 undefined를 할당하더라도 동일하다.

만약 위 x 변수에 null이 할당되어야한다면 명시적으로 드러내야한다.

```tsx
const x: number | null = null
```

`strictNullChecks`는 런타임에 null과 undefined로 인한 에러를 방지해주지만 코드 작성을 어렵게할 수 있다. 새 프로젝트라면 `strictNullChecks`를 설정하는걸 추천한다.

### strict

tsconfig에서 `strict` 옵션을 통해 대부분의 오류를 잡을 수 있다.

```json
{
    "compilerOptions": {
        // ...

        "strict": true

        // ...
    }
}
```

`strict`를 활성화하면 다음 옵션들이 활성화된다.

- noImplicitAny
- noImplicitThis
    
    `noImplicitThis` 옵션은 함수 내부에서 this를 직접적으로 사용할 수 없도록 만드는 옵션이다.
    
    ```tsx
    function a(x) {
    	console.log(this, x)
    }
    ```
    
    위 코드는 `noImplicitThis` 옵션이 활성화되었다면 타입스크립트 컴파일러는 에러를 내뿜는다. 이는 a 함수에서 사용한 `this`가 `any` 타입으로 암시적이기 때문이다. 이를 수정하기 위해서는 다믕과 같이 첫번째 인자로 `this`를 전달해야한다.
    
    ```tsx
    function a(this, x) {
    	console.log(this, x)
    }
    ```
    
    위와 같이 정의하더라도 x에 해당하는 인자 하나만 전달하면 된다.
    
    ```tsx
    a('hello world!')
    ```
    
- alwaysStrict
    
    `use strict`를 상단에 배치하는 옵션이다.
    
    use strict 참고: [https://www.educative.io/edpresso/what-is-use-strict-in-javascript?utm_term=&utm_campaign=[Test]+Dynamic+Verticals&utm_source=adwords&utm_medium=ppc&hsa_acc=5451446008&hsa_cam=14045073269&hsa_grp=128822123401&hsa_ad=535845844738&hsa_src=g&hsa_tgt=aud-1036230369051:dsa-310094130363&hsa_kw=&hsa_mt=b&hsa_net=adwords&hsa_ver=3&gclid=Cj0KCQjwtrSLBhCLARIsACh6Rmi_3nX4LqUd8IzVQyddBbJbGklERkomh2AmZjYkrzHW0tUnibQm5msaAtYVEALw_wcB](https://www.educative.io/edpresso/what-is-use-strict-in-javascript?utm_term=&utm_campaign=%5BTest%5D+Dynamic+Verticals&utm_source=adwords&utm_medium=ppc&hsa_acc=5451446008&hsa_cam=14045073269&hsa_grp=128822123401&hsa_ad=535845844738&hsa_src=g&hsa_tgt=aud-1036230369051:dsa-310094130363&hsa_kw=&hsa_mt=b&hsa_net=adwords&hsa_ver=3&gclid=Cj0KCQjwtrSLBhCLARIsACh6Rmi_3nX4LqUd8IzVQyddBbJbGklERkomh2AmZjYkrzHW0tUnibQm5msaAtYVEALw_wcB)
    
- strictBindCallApply
    
    `strictBindCallApply` 옵션이 비활성화 되어 있다면 apply 사용시 타입 체킹이 불가능하다.
    
    ```tsx
    function sum(x: number, y: string) {
    	// ...
    }
    ```
    
    위와 같이 sum 함수를 정의한다.
    
    ```tsx
    sum(1, 2)
    ```
    
    위 함수는 타입스크립트 컴파일러가 에러를 내뿜는다. y의 타입이 string이지만 number 타입의 2를 인자로 전달하기 때문이다.
    
    단, 아래 apply를 사용한 코드는 에러 없이 호출한다.
    
    ```tsx
    sum.apply(undefined, [1, 2])
    ```
    
    이를 방지하기 위해서 `strictBindCallApply` 를 활성화하면 타입스크립트의 타입 체킹을 받을 수 있다.
    
- strictNullChecks
- strictFunctionTypes
    
    자바스크립트에서는 함수의 인자는 이변성 `bivariant` 을 가지고 있는데 `strictFunctionTypes` 옵션을 활성화하여 반공변 `contravariant` 으로 바꿔줄 수 있다. 
    
- strictPropertyInitialization
    
    `strictPropertyInitialization`는 ES6의 class 문법을 위한 옵션이다. 클래스 프로퍼티에 초기값을 할당하거나 생성자에 초기값을 할당하도록 강제하는 옵션이다. 
    

## 참고

이펙티브 타입스크립트 (댄 밴더캄 저, 장원호 역) item 2: [http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966263134](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9788966263134)

What is a tsconfig.json: [https://www.typescriptlang.org/docs/handbook/tsconfig-json.html](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

strict-mode-typescript: [https://dev.to/jsdev/strict-mode-typescript-j8p](https://dev.to/jsdev/strict-mode-typescript-j8p)

Typescript의 공변과 반공변: [https://iamssen.medium.com/typescript-에서의-공변성과-반공변성-strictfunctiontypes-a82400e67f2](https://iamssen.medium.com/typescript-%EC%97%90%EC%84%9C%EC%9D%98-%EA%B3%B5%EB%B3%80%EC%84%B1%EA%B3%BC-%EB%B0%98%EA%B3%B5%EB%B3%80%EC%84%B1-strictfunctiontypes-a82400e67f2)