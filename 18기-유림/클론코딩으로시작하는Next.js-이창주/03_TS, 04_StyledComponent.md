Next.js를 프로젝트를 시작할 때 TS를 적용한다.

```
npm i next react react-dom
npm i -D typescript @types/react @types/node
```

타입스크립트는 빌드 과정에서 자바스크립트로 변환되기 때문에 실제 배포될 결과물에는 포함되지 않는다.

따라서 -D 또는 --save-dev를 붙여 devDependencies에 추가하여 빌드 시에 모듈이 추가되지 않도록 한다.



@types/로 시작하는 라이브러리는, 라이브러리의 타입을 나타낸다.

타입이 내장되어 있는 모듈도 있지만, 그렇지 않은 경우에는 추가적으로 설치해주어야 한다.



------

Styled-component는 CSS-in-JS의 대표적인 라이브러리이다.

Next.js에서는 기본적으로 styled-jsx를 지원하지만, Styled-component를 사용하기 위해서는 따로 설정을 해주어야한다.

```
npm i styled-components
npm i @types/styled-components -D
```



Document를 확장하고 서버사이드 렌더링 과정에서 <head>에 스타일을 추가한다.

```
pages/_documents.tsx
import Document from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
  ...
}
```

서버사이드 렌더링 과정에서 필요한 바벨 플러그인을 추가해준다.

```
.babelrc
{
  "presets": ["next/babel"],
  "plugins": [["styled-components", { "ssr": true }]]
}
```

이제 코드에서 스타일드 컴포넌트를 사용할 수 있다.

vscode에서는 vscode-styled-components 익스텐션을 설치하면 색상 하이라이트를 지원받을 수 있다.