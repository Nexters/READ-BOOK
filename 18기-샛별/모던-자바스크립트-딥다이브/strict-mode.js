// 암묵적 전역

(function () {
  "use strict";

  x = 1;
  console.log(x);
})();

// 변수, 함수, 매개변수 삭제

(function () {
  "use strict";

  var x = 1;
  delete x;
  console.log(x);
})();

// 매개변수 이름 중복
(function () {
  "use strict";

  function foo(x, x) {
    return x + x;
  }
  console.log(foo(1, 2));
})();

// with 문 사용
(function () {
  "use strict";

  with ({ x: 1 }) {
    console.log(x);
  }
})();
