# AWS IAM의 자격 증명

- [AWS IAM의 자격 증명](#aws-iam의-자격-증명)
  - [IAM 보안 자격 정보 유형](#iam-보안-자격-정보-유형)
    - [자주 사용하는 보안 자격 증명](#자주-사용하는-보안-자격-증명)
    - [임시 보안 자격 정보 `Temporary Security Credentials`](#임시-보안-자격-정보-temporary-security-credentials)
  - [IAM 자격 증명](#iam-자격-증명)
    - [AWS 계정 루트 사용자](#aws-계정-루트-사용자)
    - [IAM 사용자](#iam-사용자)
    - [IAM 사용자 그룹](#iam-사용자-그룹)
    - [역할](#역할)

## IAM 보안 자격 정보 유형

AWS 생태계에서는 다양한 유형의 보안 자격 정보가 사용된다. 보안 자격 정보는 사용자가 어떤 방식으로 AWS 리소스에 접근하느냐에 따라 달라진다.

### 자주 사용하는 보안 자격 증명

- IAM 유저네임과 패스워드

    AWS 콘솔 로그인시 주로 사용

- E-mail 주소와 패스워드

    루트 계정과 연동

- Access Key

    CLI, API, SDK 활용시 주로 사용

- 키페어

    EC2 서버 로그인시 사용

- 멀티 팩터 인증 `MFA`

    루트 계정 로그인시 추가 보안 인증 수단으로 활용

### 임시 보안 자격 정보 `Temporary Security Credentials`

AWS에서는 위 보안 자격 정보 이외에도 임시 보안 자격 정보를 제공한다.

AWS에서는 단기간으로 사용할 목적으로 활용되고 수분에서 수시간동안만 보안자격을 유지할 필요가 있을때를 위해 임시 보안 자격 정보를 제공한다.

AWS STS `AWS Security Token Service`를 활용하여 임시 보안 자격 증명을 지원하며 임시 보안 자격 유효 기간이 만료되면 더이상 엑세스를 허용하지 않는다.

임시 보안 자격 정보는 특유의 단기적 유효성과 자동 만료성이 나름의 장점이 되며, 제3의 유저에게 AWS ID 등을 부여하지 않고도 AWS 리소스에 접근할 수 있도록 한다. 또한 애플리케이션에 장기적 또는 영구적인 보안 자격 정보를 담지 않아도 되므로 보안성 측면에서도 우수한 기법이다.

AWS 임시 보안 자격 증명 참고: [https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/id_credentials_temp.html](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/id_credentials_temp.html)

## IAM 자격 증명

계정의 AWS 계정 루트 사용자 또는 IAM 관리자가 IAM 자격 증명을 생성할 수 있다. IAM 자격 증명은 AWS 계정에 대한 액세스를 제공한다. IAM 자격 증명은 사용자를 대표하며, 인증된 후 AWS에서 작업을 수행할 수 있는 권한을 부여받을수있다. 각 IAM 자격 증명은 하나 이상의 정책과 연결될 수 있으며 정책은 사용자, 역할 또는 사용자 그룹 멤버가 수행할 수 있는 작업, 작업의 대상 AWS 리소스 및 작업 수행 조건을 결정한다.

IAM 자격 증명에는 AWS 계정 루트 사용자, IAM 사용자, IAM 사용자 그룹, 역할과 같은 개념이 존재한다.

### AWS 계정 루트 사용자

AWS 계정을 처음 생성하는 경우에는 전체 AWS 서비스 및 계정 리소스에 대해 완전한 액세스 권한을 지닌 단일 로그인 자격 증명으로 시작하게 된다. 이 자격 증명을 AWS 계정 루트 사용자라고 하며, 계정을 생성할 때 사용한 이메일 주소와 암호로 로그인하여 엑세스한다.

루트 사용자는 처음 로그인한 경우에만 사용하며 그 이후에 일상적인 작업, 관리 작업 등에는 IAM 사용자를 생성하여 사용하는 것이 좋다.

루트 사용자를 사용하는 모범사례: [https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/best-practices.html#create-iam-users](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/best-practices.html#create-iam-users)

다음은 IAM 사용자는 할 수 없는 루트 사용자만 할 수 있는 작업이다.

- [계정 설정 변경](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/manage-account-payment.html#manage-account-payment-edit-user-name)

    계정 이름, 이메일 주소, 루트 사용자 암호 및 루트 사용자 액세스 키가 포함된다. 연락처 정보, 결제 통화 기본 설정 및 리전과 같은 기타 계정 설정에는 루트 사용자 자격 증명없이 변경가능하다.

- [IAM 사용자 권한을 복원](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-edit.html)

    IAM 관리자가 실수로 권한을 취소하면 루트 사용자로 로그인하여 정책을 편집하고 해당 권한을 복원할 수 있다.

- [Billing and Cost Management 콘솔에 대한 IAM 액세스 활성화](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/control-access-billing.html#ControllingAccessWebsite-Activate)
- 특정 세금 계산서를 조회
- [AWS 계정 탈퇴](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/close-account.html)
- [AWS 지원 플랜을 변경하거나](http://aws.amazon.com/premiumsupport/knowledge-center/change-support-plan/) [AWS 지원 플랜 취소](http://aws.amazon.com/premiumsupport/knowledge-center/cancel-support-plan/)
- 예약 인스턴스 마켓플레이스에 [판매자로 등록](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ri-market-general.html)
- [MFA (멀티 팩터 인증) 삭제를 활성화하도록 Amazon S3 버킷 구성](https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html#MultiFactorAuthenticationDelete)
- 잘못된 VPC ID 또는 VPC 엔드포인트 ID가 들어 있는 Amazon S3 버킷 정책을 편집하거나 삭제
- [GovCloud 등록](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/getting-started-sign-up.html)

루트 사용자 자격 증명이 필요한 작업:  [https://docs.aws.amazon.com/ko_kr/general/latest/gr/root-vs-iam.html#aws_tasks-that-require-root](https://docs.aws.amazon.com/ko_kr/general/latest/gr/root-vs-iam.html#aws_tasks-that-require-root)

### IAM 사용자

IAM 사용자는 AWS에서 생성하는 엔터티로서 AWS와 상호 작용하기 위해 그 엔터티를 사용하는 실제적 유저 또는 애플리케이션을 나타낸다. AWS에서 사용자는 이름과 자격 증명으로 구성된다. 즉, IAM 사용자란 AWS 생태계에 존재하는 사용자 또는 서비스를 가리키는 유일무이한 엔티티이다.

IAM 유저는 유저네임과 보안 자격 정보를 지닌다. 유저를 처음 생성하면 어드민 등 이 명시적으로 접근 권한을 승인해주지 않는 한 아무런 리소스에도 접근할 수 없다. AWS는 본인을 비롯해 다수의 관리자급 사용자를 위해서 **우선 몇 개의 유저 엔티티를 생성하고 이들에게 어드민 권한을 부여하는 방법을 권장**한다. 이렇게 생성된 유저에 대해서는 그들의 실제 업무에 맞게 권한을 세부적으로 부여하거나 박탈할 수 있다.

### IAM 사용자 그룹

IAM 사용자 그룹은 IAM 사용자들의 집합이다. IAM 사용자 그룹을 활용하면 다수 사용자들에 대한 권한을 더 쉽게 관리할 수 있다. IAM 사용자 그룹에 적용한 권한은 사용자 그룹에 속하는 모든 IAM 사용자에서 동일하게 부여된다.

IAM 사용자 그룹은 다음과 같은 특징을 가진다.

- 하나의 IAM 사용자 그룹에 여러 IAM 사용자가 포함될 수 있으며 한 IAM 사용자가 여러 IAM 사용자 그룹에 포함될 수도 있다.
- IAM 사용자 그룹은 중첩이 불가능하다. 즉, IAM 사용자 그룹에는 IAM 사용자만 포함할 수 있다.
- AWS 계정의 모든 사용자를 포함하는 기본 사용자 그룹은 없다. 필요하다면 하나 만들어서 새로운 사용자를 각각 원하는 사용자 그룹에 포함해야한다.
- [AWS 계정의 IAM 리소스 수와 크기는 제한되어있다.](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/reference_iam-quotas.html)

### 역할

IAM 역할은 특정 권한을 가진 계정에 생성할 수 있는 IAM 자격 증명이다. AWS에서 자격 증명이 할 수 있는 것과 없는 것을 결정하는 권한 정책을 가진 AWS 자격 증명이라는 점에서 IAM 사용자와 유사하다.

단, IAM 역할은 한 사용자에게만 연관된 것이 아니라 해당 역할이 필요하다면 누구든지 맡을 수 있도록 설계되었다.

IAM 사용자 그룹의 경우 IAM 역할을 활용하여 그룹 사용자가 할 수 있는 자격을 부여한다.

> IAM 사용자에게도 역할을 부여할 수 있지만 IAM 사용자는 접근 승인과 관련된 영구적인 신분을 가지고 있기 때문에 IAM 역할이 없어도 모든 업무를 처리할 수 있다.

IAM 역할은 애플리케이션이 실행될 때 혹은 런타임 시에 적용된다. 롤은 패스워드나 엑세스 키와 같은 보안 승인 정보가 없기 때문에 **사용자가 역할을 할당받았을 때 또는 애플리케이션 롤이 적용될 때 AWS에 의해 동적으로 생성**되어 제공된다.

때문에 IAM 역할은 AWS 서비스의 요청 수행을 위한 일련의 승인 규칙을 정의하는 엔티티라고 할 수 있다.

IAM 롤의 주요 활용 방식은 아래와 같다.

- 보통의 경우 AWS 리소스에 접근하지 않는 유저, 애플리케이션, 서비스의 접근 대행
- 애플리케이션 내부에 AWS 키를 임베드하길 원치 않는 경우
- 기업용 디렉터리 등을 통해 AWS 외부에서 이미 본인의 신분을 확인시켜 준 사용자에게 AWS 접근권한을 부여하려는 경우
- 외부감사인 등 제3자에게 계정에 대한 접근 권한을 부여하려는 경우
- 특정 애플리케이션이 이미 다른 AWS서비스를 사용할 수 있는 경우
- 특정 임무만을 수행하기 위해 임시 보안 승인 정보를 요청하는 경우

IAM 역할을 생성하기 위해서는 역할의 주체를 설정하는 신뢰 정책과 어떤 역할을 맡는 사용자에게 어떤 리소스 또는 액션을 접근하게 할지 결정하는 접근 승인/권한 정책을 작성해야한다.

이때 역할의 주체는 서드파티 유저, EC2 또는 DynamoDB와 같은 AWS 서비스, 보안신분 제공자 등 누구든, 어떤 개체든 될 수 있고, 심지어 다른 계정의 IAM 유저도 가능하다.