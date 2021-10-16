# 실무에서 바로 쓰는 FE Clean Code

> Toss 컨퍼런스 - '진유림' 님 발표를 보고 정리한 내용 입니다.

## 1. 실무에서 클린 코드의 의의

### 1) 클린 코드가 의미 있는 이유

- 지뢰 코드 (‘그 코드는 안만지는게 좋아요;’)

- - 흐름 파악이 어렵다.
  - 도메인 맥락 표현이 안되어 있다.
  - 동료에게 물어봐야 알 수 있는 코드다.

- 실무에서 클린 코드의 의의

- - 유지보수 시간의 단축
  - 코드 파악 / 디버깅 / 리뷰 작업이 수월하고 쉽다.
  - 시간 = 자원 = 돈

### 2) 안일한 코드 추가의 함정

#### 안일한 코드의 특징

- 동일한 목적의 코드가 흩뿌려져 있다. ('script', 'html' 등으로 분산된 것을 의미 하는 듯)
- 하나의 함수가 여러가지 일을 하고 있다.
- 함수의 세부 구현 단계가 제각각이다.

#### 안일 하지 않은 코드를 작성하기 위한 방법

- 함수의 세부 구현 단계를 맞춘다.

- 클린 코드

- - 원하는 코드를 빠르게 찾을 수 있다.

#### 원하는 로직을 빠르게 찾는 코드를 작성하는 방법

- 응집도 : 하나의 목적을 가진 코드가 흩뿌려져 있으면 안된다.
- 단일 책임 : 함수가 여러 가지 일을 하면 안된다.
- 추상화 : 함수의 세부 구현 단계가 제각각이면 안된다.

### 3) 로직을 빠르게 찾을 수 있는 코드

#### 응집도

: 같은 목적의 코드는 뭉쳐두자

\```

// Regacy Code

function QuestionPage() {

​ const [popupOpened, setPopupOpened] = useState(false);

​ async function handleClick() {

​ setPopupOpened(true);

​ }

​ function handlePopupSubmit() {

​ await 질문전송(연결전문가.id);

​ alert(“질문을 전송했습니다.”)

​ }

​ return {

​ <>

​ <button onClick={handleClick}>질문하기</button>

​ <Popup title=“보험 질문하기” open={popupOpened}>

    		<div>전문가가 설명드려요</div>

​ <button onClick={handlePopupSubmit}>확인</button>

​ </Popup>

​ </>

​ };

}

\```

\```

// Custom Hook? 을 사용하여 팝업 관련 코드를 한군데로 모은다.

function QuestionPage() {

​ const [openPopup] = useMyExpertPopup(연결전문가.id);

​ function handleClick() {

​ openPopup();

​ }

​ return <button onClick={handleClick}>질문하기</button>;

}

\```

\### ‘openPopup’ 함수만 호출하면 커스텀 팝업을 열 수 있게 되었다.

- 하지만 오히려 코드 파악이 어려워 졌다.
- 어떤 내용의 팝업을 띄우는지, 팝업에서 버튼을 눌렀을 때 어떤 액션을 하는지가 포인트인데 훅 속에 가려졌다.
- 커스텀 훅의 대표적인 안티패턴

\### 무엇을 뭉쳐야 하는가?

- 당장 몰라도 되는 디테일 (뭉치면 쾌적)

- - 짧은 코드만 보고도 빠르게 코드의 목저을 파악하기 쉬움

- 코드 파악에 필수적인 핵심 정보 (뭉치면 답답)

- - 이를 분리해 놓으면 여러 모듈을 넘나들며 흐름을 따라가야 하는 참사

\### 클린 코드는 짧은 코드가 아니다.

- 찾고 싶은 로직을 빠르게 찾을 수 있는 코드.
- 읽기 좋게 응집한 코드

\### 어떻게 하면 읽기 좋게 응집 할 수 있을까?

\#### 핵심 데이터와 세부 구현 나누기

위 코드에서의 핵심 로직은 ‘팝업 버튼 클릭 시 액션’ 코드와 ‘제목, 내용’ 이 되는 HTML

1.핵심 데이터

\```

// 팝업 버튼 클릭 시 액션

function handlePopupSubmit() {

​ await 질문전송(연결전문가.id);

​ alert(“질문을 전송했습니다”);

}

// 제목 내용

return {

​ …

​ …

​ <Popup title=“보험\_질문하기” …>

    		<div>전문가가 설명드려요</div>

​ …

​ …

}

\```

2.세부 구현

\```

// 열고 닫을 때 사용하는 형태

function QuestionPage() {

​ const [popupOpened, setPopupOpened] = useState(false);

​ …

​ …

​ …

​ return {

​ …

​ …

​ // 컴포넌트 마크업 - 버튼 클릭 시 함수를 호출해야 한다. (바인딩)

​ <Popup title="보험_질문하기" open={popupOpend}>

    			<div>전문가가 설명드려요</div>

​ <button onClick={handlePopupSubmit}>확인</button>

​ </Popup>

…

​ …

​ };

}

\```

\#### 핵심 데이터는 밖에서 전달, 나머지는 뭉친다.

\```

function QuestionPage() {

​ const [openPopup] = usePopup();

​ async function handleClick() {

​ const confirmed = await openPopup({

​ // 팝업 제목, 내용

​ title: “보험\_질문하기”,

​ contents: <div>전문가가 설명드려요</div>,

​ });

​ if (confirmed) {

​ // 팝업 버튼 Action

​ await submitQuestion();

​ }

​ }

​ async function submitQuestion(연결전문가) {

​ await 질문전송(연결전문가.id);

​ alert(“질문을 전송했습니다.”);

​ }

​ return <button onClick={handleClick}>질문하기</button>;

}

\```

- 세부 구현만 openPopup에서 숨겨 놓고 핵심 데이터만 바깥에서 넘긴다.

\#### 선언적 프로그래밍

핵심 데이터만 전달받고, 세부 구현은 뭉쳐 숨겨 두는 개발 스타일

A. 핵심 데이터

: `제목: 보험 질문하기` / `내용: 전문가가 설명드려요` / `확인 버튼: 질문 제출`

B. 세부 구현

C. 결과물 (팝업)

- 무엇을 해야할지만 알려줘, 세부 구현은 미리 해놨거든

  1)’무엇’을 하는 함수인지 빠른 이해 가능

\```

<Popup

​ onSubmit=**{질문전송}**

​ onSuccess=**{홈으로이동}**

/>

\```

2)세부 구현은 내부에 뭉쳐둠

\```

<Popup

​ **onSubmit**={질문전송}

​ **onSuccess**={홈으로이동}

/>

\```

3)’무엇’만 바꿔서 쉽게 재사용 가능

\```

<Popup

​ onSubmit=**{회원가입}**

​ onSuccess=**{프로필로이동}**

/>

\```

\#### 명령형 프로그래밍

: 뭉치지 않은 것, 선언적 프로그래밍 내부도 명령형으로 되어있다.

: 명령형 프로그래밍은 읽는데 오래 걸리고(파악이 어렵고), 재사용하기 어려운 단점이 있다.

\```

// ‘어떻게’ 해야 할지, 하나 하나 명령하기

<Popup>

​ <button onClick={async () => {

​ const res = await 회원가입();

​ if (res.success) {

​ 프로필로이동();

​ }

​ }}>전송</button>

</Popup>

\```

\### 단일 책임

: 하나의 일을 하는 뚜렷한 이름의 함수를 만들자

\```

// Bad

function 질문 제출() {

​ 약관 체크();

​ 질문 제출();

\```

- 두가지 일을 하는 함수.
- 함수명은 한가지 일만 명시하고 있다.
- 함수명에 신뢰도 하락으로 이어지고, 동료가 해당 코드를 믿지 못하는 결과를 초래.
- 동료가 코드 내용까지 파악을 해야하고, 시간이 오래 걸리게 된다.

\```

// Good

function 약관체크() {

​ …

}

function 질문제출() {

​ …

}

\```

**한글 변수명 사용 고려**

**### 추상화**

**핵심 개념을 뽑아내자**

**1.컴포넌트**

**```**

**// 팝업 코드 제로부터 구현**

<div style={팝업스타일}>

​ **<button onClick={async () => {**

​ **const res = await 회원가입();**

​ **if (res.success) {**

​ **프로필로이동();**

​ **}**

​ **}}>전송</button>**

**</div>**

**```**

**```**

**// 중요 개념만 남기고 추상화**

**<Popup**

​ **onSubmit={회원가입}**

​ **onSuccess={프로필로이동}**

**/>**

**```**

**2.함수**

**```**

**// 설계사 라벨을 얻는 코드 세부 구현**

**const planner = await fetchPlanner(plannerId)**

**const label = planner.new ? ‘새로운 상담사’ : ‘연결중인 상담사’**

**```**

**```**

**// 중요 개념을 함수 이름에 담아 추상화**

**const label = await getPlannerLabel(plannerId)**

**```**

**추상화 ‘수준(레벨)’ 이 섞여 있으면 코드 파악이 어렵다.**

**```**

**// 높은 추상화**

**<Title>별점을 매겨주세요</Title>**

**// 낯은 추상화**

<div>

​ **{STARS.map(() => <Star />)}**

**</div>**

**// 높은 추상화**

**<Reviews />**

**// 중간 추상화**

**{rating !== 0 && (**

​ **<>**

​ **<Agreement />**

​ **<Button rating={rating} />**

​ **</>**

**)}**

**```**

- 전체적인 코드가 어느 수준으로 구체적으로 기술 된지 파악할 수 없다.

\```

**<Title>별점을 매겨주세요</Title>**

<Stars />

<Reviews />

<AgreementButton

​ show={rating !== 0}

/>

\```

- 추상화 단계를 비슷하게 정리 (높은 것 끼리 혹은 낮은 것 끼리)

\## 4. 액션 아이템

- 기존 코드 수정하기

- - 리펙톺링 PR 새로 파기(file changed 수줄이기)

- 큰 그림 보기

- 팀과 함께 공감대 형성

- 문서로 적어보기
