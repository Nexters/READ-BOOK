# VPC 기초

- [VPC 기초](#vpc-기초)
  - [VPC 주요 구성 요소](#vpc-주요-구성-요소)
    - [VPC](#vpc)
      - [VPC 생성하기](#vpc-생성하기)
    - [서브넷](#서브넷)
    - [라우트 테이블](#라우트-테이블)
    - [인터넷 게이트웨이](#인터넷-게이트웨이)
      - [인터넷 게이트웨이 VPC에 연결하기](#인터넷-게이트웨이-vpc에-연결하기)
    - [NAT `네트워크 주소 변환, Network Address Translation`](#nat-네트워크-주소-변환-network-address-translation)
      - [NAT 인스턴스](#nat-인스턴스)
      - [NAT Gateway](#nat-gateway)
    - [탄력적 네트워크 인터페이스 `ENI, 일래스틱 네트워크 인터페이스`](#탄력적-네트워크-인터페이스-eni-일래스틱-네트워크-인터페이스)
    - [탄력적 IP 주소 `EIP, 탄력적 IP 주소`](#탄력적-ip-주소-eip-탄력적-ip-주소)
    - [VPC 엔드포인트](#vpc-엔드포인트)
    - [DNS](#dns)
    - [DHCP 옵션 세트 `Dynamic Host Configuration Protocol`](#dhcp-옵션-세트-dynamic-host-configuration-protocol)

Amazon VPC는 EC2의 네트워크 레이어이다. VPC는 다음과 같은 컨셉을 따른다.

- Virtual Private Cloud

    AWS 계정 내에서 클라우드를 퍼블릭과 프라이빗으로 클라우드를 분리할 수 있다. 어떠한 리소스라도 논리적으로 분리된 영역에 격리가 가능하며 네트워크에 대한 완전한 통제권을 가질 수 있다.

- Subnet

    VPC는 IP 주소 범위로 체계로 관리한다. VPC 내에서 다수의 서브넷 설정도 가능하다. 인터넷 접근을 위한 퍼블릭 서브넷과 격리된 접근을 위한 프라이빗 서브넷을 생성할 수 있다.

- Route Table

    VPC를 통해 네트워크 트래픽의 방향을 결정하는데 사용할 수 있다.

- Internet gateway

    VPC내의 리소스들과 외부 인터넷과의 커뮤니케이션을 할 수 있도록 역할을 할 수 있다. 

- VPC endpoint

    S3와 같은 AWS 서비스와 VPC endpoint를 연결하여 프라이빗하게 리소스를 다룰 수 있도록 지원한다.

- CIDR block

    Amazon VPC는 Private IP Address 사용을 추천하고 Private Ip Address를 할당하기 위해 CIDR를 활용한다.

    > CIDR란 클래스 없는 도메인 간 라우팅 기법으로 IP 주소 할당 방법이다.
    참고: [https://dev.classmethod.jp/articles/vpc-3/](https://dev.classmethod.jp/articles/vpc-3/)

Amazon VPC 사용에 따른 추가 요금은 없다. 다만, VPC의 구성요소인 Site-to-Site 연결, PrivateLink, 트래픽 미러링, NAT Gateway 사용에 따른 요금은 부과된다.

Amazon VPC 요금 참고: [https://aws.amazon.com/ko/vpc/pricing/](https://aws.amazon.com/ko/vpc/pricing/)

## VPC 주요 구성 요소

VPC는 클라우드의 리소스를 격리시키기 위한 주요 개념이다. 수천 대의 서버를 클라우드에 배포했을때 IP 네임스페이스 관리가 정확히 되어야하며 IP 주소 간 중첩되는 부분이 없어야만 온프레미스에서 구동되는 리소스에 빈틈 없이 접근이 가능하다.

### VPC

VPC란 사용자의 AWS 계정 전용 가상 네트워크이다. VPC를 통해 AWS 클라우드의 다른 가상 네트워크와 논리적으로 분리되어 있으며 이를 통해 클라우드에 기업 전용 데이터 센터 등을 구축할 수 있다.

IP주소와 VPC 범위를 설정하고 서브넷 추가 후 보안그룹 `Security Group`을 연결한 다음 라우팅 테이블을 구성한다. 서브넷은 VPC의 IP주소 범위로 인터넷 연결이 필요한 리소스에는 퍼블릭 서브넷, 인터넷 연결이 필요하지 않은 내부망에는 프라이빗 서브넷을 사용한다.

그 밖에 IPv6 CIDR 블록을 VPC에 연결하고 IPv6 주소를 VPC의 인스턴스에 할당할 수 있다.

한번 생성된 VPC 주소 크기는 변경할 수 없다는 점을 유의해야한다. 만약 추후에 더 큰 크기의 주소 범위가 필요하다면 VPC를 새로 생성하고 마이그레이션하는 작업이 필요하다.

VPC는 리전에 제한되고 다른 리전으로 확장이 불가능하다. VPC 내에서 동일 리전의 AZ를 포함시킬수는 있다.
기본적으로 리전당 5개까지 VPC를 생성할 수 있으며 필요에 따라 지역당 100개까지 사용할 수 있다.

#### VPC 생성하기

먼저 VPC 생성의 시작은 CIDR 블록을 이용한 CIDR 범위 결정이다.

![](https://user-images.githubusercontent.com/30178507/121917260-ea3f1a00-cd6f-11eb-895c-cc16dcd5110e.png)

Amazon VPC는 IPv4와 IPv6를 모두 지원한다. 

IPv4 CIDR 범위를 선택하면 `/16` 사이의 범위 즉, 65,536 IP주소 `10.0.0.0/16`를 사용할 수 있고, `/28` 사이의 범위 즉, 16개의 IP주소를 사용할 수 있다. 반면 IPv6 CIDR 범위를 선택하면 CIDR 블록 크기는 `/56`으로 고정되며 IPv6 주소 범위는 아마존이 자동으로 할당한다. 현재는 IPv4 CIDR 블록 설정은 필수이며 IPv6는 선택사항이다. 

IPv4 CIDR 블록을 설정하면 간단하게 VPC 생성이 된다.

![](https://user-images.githubusercontent.com/30178507/121917267-ead7b080-cd6f-11eb-87fd-cc65be7a1c2f.png)

위와 같이 `/12` 블록으로 설정을 한다면 `/16` ~ `/28`까지만 설정이 가능하다고 안내가 된다.

![](https://user-images.githubusercontent.com/30178507/121917274-ec08dd80-cd6f-11eb-95c4-2a713d9abd33.png)

따라서 위와 같이 VPC 생성 가능 범위에서 IPv4 CIDR 블록을 설정하면 생성이 가능하다.

> 참고로 프라이빗 IP 주소는 다음 3가지 대역으로 고정되어있다.

Class A: 10.0.0.0 ∼ 10.255.255.255
Class B: 172.16.0.0 ∼ 172.31.255.255
Class C: 192.168.0.0 ∼ 192.168.255.255

![](https://user-images.githubusercontent.com/30178507/121917280-ed3a0a80-cd6f-11eb-8aef-1b4616de70d4.png)

다음과 같이 사설 IP 대역에 해당하지 않는 IPv4 CIDR 블록을 지정하면 에러가 발생한다.

### 서브넷

서브넷을 통해 하나의 네트워크를 여러 개로 나눌 수 있다. VPC를 활용하면 퍼블릭 서브넷, 프라이빗 서브넷, VPN only 서브넷 등 필요에 따라 다양한 서브넷을 생성할 수 있다.

서브넷은 VPC의 CIDR 블록을 이용하여 서브넷 정의가 가능하다. 서브넷 당 하나의 AZ만 설정할 수 있으며 여러개의 AZ에 연결되는 서브넷을 만들 수 없다. 반면 VPC는 여러개의 AZ에 할당할 수 있는데 이는 각각의 AZ마다 별도의 서브넷을 할당하여 가능한 것이다.

즉, 서브넷은 AZ 단위로 VPC는 리전 단위로 생성하여 활용가능하다.

참고로 AWS가 확보한 서브넷 중에 처음 네 개의 IP 주소와 마지막 IP 주소는 인터넷 네트워킹을 위해 예약되어있다. 서브넷에서 가용 IP 주소를 계산하기 위해서는 항상 이 부분을 기억해야한다. 예를 들어, `10.0.0.0/24` 체계의 CIDR 블록이 있는 서브넷에서 `10.0.0.0`, `10.0.0.1`, `10.0.0.2`, `10.0.0.3`, `10.0.0.255` 5개의 IP 주소는 예약되어 있다.

CIDR 블록의 가용 서브넷 계산기: [https://www.subnet-calculator.com/cidr.php](https://www.subnet-calculator.com/cidr.php)

![](https://user-images.githubusercontent.com/30178507/121917468-1eb2d600-cd70-11eb-8e42-aa7b95c3e144.png)

서브넷을 할당할 VPC를 설정하고 해당 VPC에서 사용할 서브넷을 여러개 생성할 수 있다.

### 라우트 테이블

라우트 테이블은 트래픽의 전송 방향을 결정하는 라우트와 관련된 규칙을 담은 테이블이다. 서브넷을 특정 라우팅 테이블과 명시적으로 연결할 수 있다. 그렇지 않으면 서브넷이 기본 라우팅 테이블과 암묵적으로 연결된다.

> `기본 라우팅 테이블`은 `메인 라우팅 테이블`이라고도 한다.

![](https://user-images.githubusercontent.com/30178507/121917476-207c9980-cd70-11eb-97e3-d4e74e854225.png)

앞서 생성한 test-vpc-1의 기본 라우팅 테이블

VPC의 기본 라우팅 테이블은 내용을 수정할 수는 없다. IPv4와 IPv6의 CIDR 블록은 다르므로 이에 대응하는 라우트 또한 별도로 관리된다. 즉, `0.0.0.0/0`의 IPv4주소는 IPv6의 주소로 사용될 수 없고 `::/0` 으로 추가해야 사용가능하다.

메인 라우팅 테이블이 필요없는 경우 직접 커스텀 라우팅 테이블을 생성하고 이를 메인 라우팅 테이블 대신 사용할 수 있다. AWS에서는 VPC의 메인 라우트 테이블은 로컬 라우트에서 원본 상태를 유지하고 각각의 서브넷에 맞는 커스텀 라우트 테이블을 생성하는 것을 권장한다.

![](https://user-images.githubusercontent.com/30178507/121917482-22465d00-cd70-11eb-8332-a328d707c39f.png)

다음과 같이 VPC에 매핑되는 라우팅 테이블을 생성할 수 있다. 생성후 `라우팅 테이블 > 서브넷 연결` 탭에서 해당 리전에서 생성된 서브넷을 연결할 수 있다.

### 인터넷 게이트웨이

인터넷 게이트웨이 `IG`는 VPC가 인터넷에 연결되도록 하는 요소이다. VPC에 IG를 붙이면 라우팅 테이블에 정의된 IG를 통해 서브넷에서 인터넷으로 바로 연결할 수 있다. 

![](https://user-images.githubusercontent.com/30178507/121917488-24102080-cd70-11eb-88f9-a2cc0f18b4ec.png)

기본 VPC

![](https://user-images.githubusercontent.com/30178507/121917498-25414d80-cd70-11eb-8c76-04c26194e0ed.png)

위와 같이 기본 VPC의 라우팅 테이블에는 IG가 기본적으로 포함되어 있다. 단, 기본이 아닌 VPC의 라우팅 테이블에는 IG 설정이 따로 없기 때문에 별도 설정 없이는 인터넷 엑세스가 불가능하다.

#### 인터넷 게이트웨이 VPC에 연결하기

1. 먼저 IG를 생성한다.

    ![](https://user-images.githubusercontent.com/30178507/121917710-5a4da000-cd70-11eb-8da9-3b8197fcb0c2.png)

    `VPC 콘솔 > 인터넷 게이트웨이` 탭에서 인터넷 게이트웨이 생성을 클릭하면 위와 같은 화면이 나온다. 간단하게 이름만 설정하면 생성된다.

2. IG를 VPC에 매핑

    생성된 IG에 들어가서 작업 셀랙트 박스를 열면 위와 같이 `VPC에 연결` 기능이 있다. 이를 통해 원하는 VPC에 연결할 수 있다. 아래는 `test-vpc-1`에 연결된 상태이다.

    ![](https://user-images.githubusercontent.com/30178507/121917716-5ae63680-cd70-11eb-91af-163719f23fa2.png)

3. 라우팅 테이블에 연결한다.

    이때 메인 라우팅 테이블에서는 생성한 IG가 인식이 안된다. 따라서 라우팅 테이블을 하나 만들어 라우팅 편집 탭에서 IG를 추가한다.

    ![](https://user-images.githubusercontent.com/30178507/121917722-5c176380-cd70-11eb-9f9b-c7f883ba3b61.png)

    이렇게 추가하면 다음과 같이 IG의 IP가 라우팅 테이블에 추가된 것을 확인할 수 있다.

    ![](https://user-images.githubusercontent.com/30178507/121917728-5d489080-cd70-11eb-9feb-fbf82b872f35.png)

    라우팅 테이블에 서브넷을 연결했다면 서브넷에서 추가가 된 것을 볼 수 있다.

    ![](https://user-images.githubusercontent.com/30178507/121917742-5e79bd80-cd70-11eb-94b3-48bc58cc12c4.png)

### NAT `네트워크 주소 변환, Network Address Translation`

VPC를 통해 내부망으로만 접근하도록 하여 외부랑 완전히 격리시킬 수 있다. 단, 만약에 펌웨어 업데이트나 패치를 다운로드 해야하는 경우에는 외부 인터넷 접근이 완전 불가능하므로 업데이트, 패치 다운로드 등이 불가능하다. 이런 문제를 해결하기 위해 NAT를 사용한다.

NAT 디바이스를 활용하면 기본적으로 인터넷 접속 불능인 프라이빗 서브넷의 서버 인스턴스를 인터넷에 연결할 수 있다. NAT 디바이스는 프라이빗 서브넷에 있는 서버 인스턴스의 트래픽을 인터넷으로 보내고 그에 따른 응답을 다시 해당 인스턴스로 받을 수 있다.

트래픽이 인터넷으로 전달되면 IPv4 주소의 소스는 NAT 기기의 주소로 대치되고 응답으로 돌아오면 NAT는 해당 주소를 인스턴스의 프라이빗 IPv4 주소로 변환한다. 때문에 NAT라고 불린다.

NAT는 IPv4 주소에서만 사용가능하며 IPv6용으로는 사용불가능하다.

#### NAT 인스턴스

NAT AMI를 통해서 생성하는 인스턴스이로 VPC의 퍼블릭 서브넷의 EC2 인스턴스에서 NAT 인스턴스로 실행하여 프라이빗 서브넷에 있는 인스턴스가 인터넷 또는 다른 AWS 서비스로의 아웃바운드 EC2 트래픽을 시작하되 인바운드 트래픽은 인스턴스가 수신하지 못하도록 막을 수 있다.

NAT 인스턴스가 프라이빗 서브넷의 인스턴스와 외부 인터넷과의 연결을 담당하므로 NAT 인스턴스는 IG에 연결이 되어있어야하며 퍼블릭 IP 주소 또는 탄력적 IP 주소가 필요하다.

만약 NAT 인스턴스가 다운되면 프라이빗 서브넷과 인터넷과의 연결은 끊어진다. 즉, NAT 인스턴스가 단일 실패 지점이 된다. 이런 문제를 피하기 위해 다른 AZ에 NAT 인스턴스를 중복 구현하거나, 서로 다른 AZ에서 엑티브 및 패시브 모드로 NAT 인스턴스를 실행하거나 NAT 인스턴스 모니터링을 하는 등의 방법이 필요하다. 이와 같은 해결책은 관리 포인트가 늘어나는 부분이므로 시간, 비용, 노력이 소모된다. 이런 불편함을 해소하기 위해 AWS에서는 NAT Gateway를 지원한다.

> NAT AMI는 2020년 12월 31일부로 표준 지원이 종료된다. 따라서 NAT AMI로 생성된 인스턴스는 최대한 빨리 NAT Gateway로 마이그레이션하거나 Amazon Linux 2에서 자체 NAT AMI 생성을 권장한다.

NAT 인스턴스: [https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/VPC_NAT_Instance.html](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/VPC_NAT_Instance.html)

#### NAT Gateway

NAT Gateway는 생성과 사용에 비용이 청구된다. 또한 NAT Gateway는 IPv4 트래픽만 지원하므로 [아웃바운드 전용 인터넷 게이트웨이](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/egress-only-internet-gateway.html)를 사용해야한다.

NAT Gateway를 사용하려면 NAT Gateway가 속할 퍼블릭 서브넷을 지정해야한다.

![](https://user-images.githubusercontent.com/30178507/121917950-8cf79880-cd70-11eb-9eda-4cd978f30aa8.png)

또한 NAT Gateway와 연결할 탄력적 IP 주소도 지정해야한다. 참고로 탄력적 IP를 지정한 후에는 변경이 불가능하다. NAT Gateway를 만든 뒤, 하나 이상의 프라이빗 서브넷과 연결된 라우팅 테이블을 업데이트하여 인터넷 바운드 트래픽이 NAT Gateway를 가리키도록 하면 프라이빗 서브넷의 인스턴스가 인터넷과 통신이 가능하다.

NAT Gateway 비용 참고: [https://aws.amazon.com/ko/vpc/pricing/](https://aws.amazon.com/ko/vpc/pricing/)

보통은 NAT 인스턴스보다 NAT Gateway를 더 선호한다. 가용성과 네트워크 대역폭이 더 높기 때문이다.

[NAT 인스턴스 vs NAT Gateway](https://www.notion.so/1beabfed69cd443aa9ae1b4e4179d6cd)

NAT 게이트웨이와 NAT 인스턴스 비교: [https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/vpc-nat-comparison.html](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/vpc-nat-comparison.html)

### 탄력적 네트워크 인터페이스 `ENI, 일래스틱 네트워크 인터페이스`

탄력적 네트워크 인터페이스는 VPC에서 가상 네트워크 카드를 나타내는 논리적 네트워킹 구성 요소이다. 하나 혹은 다수의 네트워크 인터페이스를 생성하고 인스턴스에 붙이는 역할을 한다. 그리고 필요하면 언제든지 인스턴스에서 네트워크 인터페이스를 분리해 해당 인스턴스나 다른 인스턴스에 다시 붙일 수 있다. 이를 통해 네트워크 트래픽을 전환하는데 사용할수도 있다.

아래와 같은 속성들이 포함될 수 있다.

- 기본 프라이빗 IPv4 주소
- 보조 프라이빗 IPv4 주소
- 프라이빗 IPv4 주소당 한 개의 탄력적 IP 주소
- 인스턴스를 시작할 때 eth0에 대한 네트워크 인터페이스에 자동 할당할 수 있는 퍼블릭 IPv4 주소 한 개
- 한 개 이상의 IPv6 주소
- 하나 이상의 보안 그룹
- MAC 주소
- 원본/대상 확인 플래그
- 설명

프라이머리 네트워크 `eth0, 기본 네트워크 인터페이스`는 인스턴스에서 분리하거나 변경할 수 없다. 프라이버리  네트워크에는 VPC의 IPv4 주소 범위에 속하는 프라이빗 IPv4 주소가 할당된다. 그리고 네트워크 인터페이스를 늘리더라도 이는 네트워크 대역폭과 전송용량에는 영향을 주지 않는다.

> 연결 가능한 네트워크 인터페이스의 갯수는 EC2 인스턴스 유형에 따라 달라진다.

참고: [https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/using-eni.html#AvailableIpPerENI](https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/using-eni.html#AvailableIpPerENI)

탄력적 네트워크 인터페이스는 `EC2 콘솔 > 네트워크 인터페이스`에서 관리 가능하다.

탄력적 네트워크 인터페이스: [https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/VPC_ElasticNetworkInterfaces.html](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/VPC_ElasticNetworkInterfaces.html)

### 탄력적 IP 주소 `EIP, 탄력적 IP 주소`

탄력적 IP 주소는 클라우드에서 실행되는 애플리케이션을 위한 주소 체계이다. AWS에서 인스턴스를 새로 생성할 때마다 새로운 IP 주소가 만들어진다. 단, 애플리케이션을 업데이트 할 때마다 이에 맞춰서 IP 주소를 변경하는 건 쉽지않은 일이다. 따라서 애플리케이션 업데이트마다 IP 주소를 바꾸는 대신 EIP를 받아서 해당 EC2 인스턴스와 연결하고 EIP를 애플리케이션과 연결하는 방식이 자주 사용된다. 즉, EIP를 사용하여 인스턴스의 IP 주소가 변경될 때마다 EIP가 해당 EC2를 가리키도록 하는 것이다. 애플리케이션은 같은 EIP로도 연결할 수 있다.

EIP는 고정 퍼블릭 주소로 정적 IP 주소가 필요할 경우에도 EIP를 사용할 수 있다. 현재는 IPv4 주소만 지원한다. 또한 EIP는 퍼블릭 IPv4 주소이므로 바로 인터넷에 연결할 수 있다.

### VPC 엔드포인트

S3와 같은 VPC 외부에서 실행되는 AWS 서비스 및 VPC 엔드포인트 서비스에 비공개로 연결할 수 있도록 지원한다. VPC의 인스턴스는 리소스와 통신하는데 퍼블릭 IP 주소를 필요로 하지 않으며 VPC와 기타 서비스 간의 트래픽은 Amazon 네트워크를 벗어나지 않는다.

프라이빗 서브넷에 EC2 인스턴스가 있고 S3와 연결해야 한다면, VPC 엔드포인트를 이용해 EC2와 S3를 프라이빗 서브넷에서 바로 연결할 수 있으므로 별도의 데이터 전송 비용이 들지 않는다. VPC 엔드포인트가 없다면 퍼블릭 서브넷에 있는 S3의 데이터를 EC2 인스턴스가 있는 프라이빗 서브넷에 전송해야한다. 이때 트래픽은 인터넷으로 연결된 리전별 서비스인 S3에 접속하기 위해 VPC를 벗어나야 하고, 데이터를 포함한 트래픽이 다시 VPC로 들어오는 비용이 발생하게 되는것이다.

AWS PrivateLink를 지원하는 서비스라면 VPC 엔드포인트와 연결이 가능하다.

AWS PrivateLink를 지원하는 서비스 참고: [https://docs.aws.amazon.com/ko_kr/vpc/latest/privatelink/integrated-services-vpce-list.html](https://docs.aws.amazon.com/ko_kr/vpc/latest/privatelink/integrated-services-vpce-list.html)

### DNS

Amazon DNS 서버는 VPC 내에 실행중인 모든 인스턴스의 주소를 관리하며 퍼블릭 IPv4는 인터넷을 통해 연결할 수 있고 프라이빗 IPv4는 내부 네트워크를 통해 연결할 수 있다.

기본 VPC에서 실행하는 인스턴스는 퍼블릭 IPv4에 대응하는 DNS 호스트네임과 프라이빗 IPv4에 대응하는 DNS 호스트네임을 가진다.

반면 기본이 아닌 VPC는 특정 인스턴스가 퍼블릭 DNS 호스트네임을 지니도록하는 두 개의 DNS 속성이 있으며,이들 두 속성이 모두 참으로 설정되면, 해당 인스턴스는 퍼블릭 DNS 호스트네임을 지니게된다. 만일 두 속성 중 하나라도 참이 아니면, 퍼블릭 DNS 호스트네임이 부여되지 않는다.

두 속성은 `enableDnsHostnames`와 `enableDnsSupport`이다.

- enableDnsHostnames

    VPC에서 실행된 인스턴스가 퍼블릭 DNS 호스트네임을 지닐 수 있는지 여부를 결정한다. 침이면 퍼블릭DNS 호스트네임을 지닐 수 있다.

- enableDnsSupport

    DNS 주소 변환 작업이 VPC를 지원하는지 여부를 결정한다.

위 속성 중 하나라도 false라면 VPC내의 DNS 서버는 DNS Resolution을 지원하지 않는다.

현재는 IPv6 주소를 위한 DNS 호스트네임은 제공하지 않고 있으며 기업 자체의 DNS를 사용하거나 기업 전용 VPC를 위한 DHCP 옵션 세트를 생성할 수 있다.

DNS?: [https://aws.amazon.com/ko/route53/what-is-dns/](https://aws.amazon.com/ko/route53/what-is-dns/)

### DHCP 옵션 세트 `Dynamic Host Configuration Protocol`

DHCP 옵션 세트는 기본 도메인 네입, DNS 서버 등 VPC에 있는 인스턴스의 호스트 환경 설정에 사용된다.

각 VPC는 반드시 하나의 DHCP 옵션 세트를 지녀야 하며, 일단 생성된 DHCP 옵션 세트는 수정할 수 없다. 수정이 필요하다면 새로운 DHCP 옵션 세트를 생성 후 연결해야한다.

DHCP 옵션 필드에는 다음과 같은 값들이 있다.

- **domain-name-servers**

    최대 4개 도메인 이름 서버의 IP 주소 또는 [AmazonProvidedDNS](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/VPC_DHCP_Options.html#AmazonDNS)입니다. 두 개 이상의 도메인 이름 서버를 지정할 경우 쉼표로 구분한다. 최대 4개의 도메인 이름 서버를 지정할 수 있지만 일부 운영 체제에서는 더 낮은 제한이 적용될 수 있다.
    이 옵션을 사용하려면 AmazonProvidedDNS 또는 사용자 지정 도메인 이름 서버로 설정한다. 이 옵션을 양쪽 모두로 설정하면 예기치 않은 동작이 발생할 수 있다.

    기본 DHCP 옵션 세트: AmazonProvidedDNS

- **domain-name**

    인스턴스의 도메인 이름으로 사용자 지정 도메인 이름(예: `example.com`)을 지정할 수 있습니다. 이 값은 정규화되지 않은 DNS 호스트 이름을 완성하는 데 사용된다. 사용자 지정 도메인 이름을 사용하는 경우 사용자 지정 도메인이 고객 관리 DNS 서버에서 호스팅되는 경우에만 사용자 지정 도메인 이름 서버를 지정해야 합니다. 동일한 VPC와 연결된 Amazon Route 53 프라이빗 호스팅 영역을 사용하면 [AmazonProvidedDNS](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/VPC_DHCP_Options.html#AmazonDNS)를 사용할 수 있습니다.**중요**
    일부 Linux 운영 체제에서는 공백으로 구분된 여러 도메인 이름을 허용한다. 하지만 다른 Linux 운영 체제와 Windows에서는 이 값을 단일 도메인으로 취급하므로 예기치 않은 동작이 발생한다. DHCP 옵션 세트가 여러 운영 체제를 포함한 인스턴스가 있는 VPC와 연결되는 경우 한 도메인 이름만 지정한다.

    기본 DHCP 옵션 세트: `us-east-1`의 경우 값은 `ec2.internal`이다. 다른 리전의 경우 값은 *`region`*.compute.internal(예: `ap-northeast-1.compute.internal`)이다. 기본값을 사용하려면 `domain-name-servers`를 AmazonProvidedDNS로 설정한다.

    VPC의 DNS 호스트 이름과 DNS 지원에 대한 자세한 내용은 [VPC와 함께 DNS 사용](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/vpc-dns.html)을 참고.

- **ntp-servers**

    최대 4개의 NTP(Network Time Protocol) 서버의 IP 주소이다. Amazon Time Sync Service(`169.254.169.123`)를 지정할 수 있다.

    기본 DHCP 옵션 세트: 없음

- **netbios-name-servers**

    최대 4개의 NetBIOS 이름 서버의 IP 주소이다.

    기본 DHCP 옵션 세트: 없음

- **netbios-node-type**

    NetBIOS 노드 유형(1, 2, 4 또는 8)이다. 2(지점 간 또는 P-노드)를 지정하는 것이 좋다. 브로드캐스트 및 멀티캐스트는 현재 지원되지 않는다.
    기본 DHCP 옵션 세트: 없음