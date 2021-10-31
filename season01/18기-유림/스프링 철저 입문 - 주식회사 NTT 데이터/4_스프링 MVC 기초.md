> p178-190, 207-



###### 4.1. 스프링 MVC

Model - 애플리케이션 상태(데이터)나 비즈니스 로직을 제공하는 컴포넌트

View - 모델이 보유한 상태를 참조하고 클라이언트에 반환할 응답 데이터를 생성하는 컴포넌트

Controller - 모델과 뷰의 호출을 제어하고 요청과 응답의 처리 흐름을 제어하는 컴포넌트

스프링 MVC는 정확히 말하면 프런트 컨트롤러(Front Controller)를 채택한 것이다. 이는 MVC 패턴이 가진 약점을 개선한 아케틱처 패턴이다.



###### 4.1.1. 웹 애플리케이션 개발의 특징

```java
@Controller  // DI컨테이너와의 연계(빈 정의+DI)
public class WelcomeController { 
    // 프레임워크에서 제공하는 인터페이스 구현은 불필요(POJO)
    
    @Autowired
    MyService myService;
    
    @RequestMapping("/")
    // 애너테이션에서 정의 정보를 지정
    public String home(Model model) { // 유연한 인수 정의
        Data now = myService.getCurrentData();
        model.addAttribute("now", now);
        // 서블릿 API에 의존하지 않는 구현
        return "home";
        // 뷰 구현 기술에 의존하지 않는 뷰 이름 지정
    }
}
```



###### 4.2.2. 스프링 MVC 적용

- 라이브러리 설정 (pom.xml)

- ContextLoaderListenr 설정

  웹 애플리케이션에서 사용할 애플리케이션 컨텍스트를 만들려면 서블릿 컨테이너에 ContextLoaderListener 클래스를 등록해야 한다.

  그리고 이 클래스가 서블릿 컨테이너에 등록될 때 웹 애플리케이션용 애플리케이션 컨텍스트에 빈이 등록되게 하려면 빈을 정의한 설정이 필요하다.

- DispatcherServlet 설정

  스프링 MVC에서는 웹 애플리케이션용 애플리케이션 컨텍스트와 별개로 DispatcherServlet용 애플리케이션 컨텍스트를 별도로 만든다.

- CharacterEncodingFilter 설정

- ViewResolver 설정

- 태그 라이브러리 정의의 추가



###### 4.3.1. 프레임워크 아키텍처

프런트 컨트롤러 패턴은 