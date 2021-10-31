# MyBatis SQL Mapping 을 위한 Configuration

## SqlSession, SqlSessionFactory
* SqlSession 을 생성하기 위해 SqlSessionFactory 를 사용
* 세션을 한번 생성하면 매핑구문을 실행하거나 커밋 또는 롤백을 하기 위해 세션을 사용할 수 있다.
* MyBatis - Spring 연동 모듈을 사용하면 SqlSessionFactory 를 직접 사용할 필요가 없다.
* 스프링 트랜잭션 설정에 따라 자동으로 커밋 혹은 롤백을 수행하고 닫혀지는, 쓰레드에 안전한 SqlSession 개체가 스프링 빈에 주입될 수 있기 때문에

## SqlSessionTemplate
* MyBatis - Spring 연동 모듈의 핵심
* SqlSessionTemplate 은 SqlSession 을 구현하고 코드에서 SqlSession 을 대체하는 역할을 한다.
* SqlSessionTemplate 은 쓰레드에 안전하고 여러개의 DAO 나 Mapper 에 공유할 수 있다.
* getMapper() 에 의해 리턴 된 매퍼가 가진 메서드를 포함해서 SQL 을 처리하는 MyBatis 메서드 를 호출 할 때, SqlSessionTemplate 은 SqlSession 이 현재의 스프링 트랜잭션에서 사용 될 수 있도록 보장한다.
* 세션의 생명주기 관리
* MyBatis 예외를 스프링의 DataAccessException 으로 변환하는 작업 처리

## SqlSessionFactoryBean
* MyBatis 만 사용하면, SqlSessionFactory는 SqlSessionFactoryBuilder 를 사용해서 생성한다.
* MyBatis - Spring 연동 모듈에서는 SqlSessionFactoryBean 이 대신 사용된다.

## 매퍼 주입
