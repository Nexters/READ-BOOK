- [AWS EBS `아마존 일래스틱 블록 스토어`](#aws-ebs-아마존-일래스틱-블록-스토어)
  - [EBS의 특징](#ebs의-특징)
  - [EBS의 주요 서비스](#ebs의-주요-서비스)
    - [볼륨 유형](#볼륨-유형)
- [AWS EFS `아마존 일래스틱 파일 시스템`](#aws-efs-아마존-일래스틱-파일-시스템)
  - [EFS의 특징](#efs의-특징)
  - [EFS의 구현 토대](#efs의-구현-토대)
  - [AWS EFS 성능 모델](#aws-efs-성능-모델)
  - [EFS 사용해보기](#efs-사용해보기)

# AWS EBS `아마존 일래스틱 블록 스토어`

AWS EBS는 EC2 인스턴스를 위한 영구 스토리지 기능을 수행한다. 영구 스토리지는 EC2 인스턴스의 수명주기를 넘어서서 존재할 수 있는 스토리지라는 의미이며 신뢰성 높은 블록 레벨의 스토리지를 제공한다.

EBS 볼륨은 네트워크에 부착되어 사용되며 때문에 인스턴스 수명에 영향을 받지 않고 존속할 수 있다. EBS 볼륨은 고가용성, 고신뢰성 스토리지 볼륨으로 EC2 인스턴스의 부트 파티션으로 사용되거나 실행 중인 EC2 인스턴스의 표준 블록 디바이스로 사용된다.

하나의 EC2 인스턴스에 여러 개의 EBS 볼륨을 부착할 수 있는데 이렇게 하면 부트 볼륨과 데이터 볼륨을 별도로 관리할 수 있다. 단, EBS 볼륨은 한 번에 하나씩 EC2에 부착가능하며, 다수에 EC2 인스턴스에 동일한 EBS 볼륨은 부착할 수 없다.

EC2 인스턴스에 부착한 EBS 볼륨은 언제든 분리 가능하며 다른 EC2에도 붙일 수 있다. 단, 동일 AZ 내에서 서로 다른 EC2 인스턴스에 EBS 볼륨 탈부착이 가능하다. 다른 AZ 간에는 EBS 볼륨 분리 및 부착이 불가능하다.

EBS 볼륨은 EC2 인스턴스에서 파일 시스템으로도 활용할 수 있고 부트 파티션으로도 활용할 수 있다. 부트 파티션으로 활용하는 경우 EC2 인스턴스가 정지한 후 재시동되어 해당 인스턴스 상태를 유지하기 위한 스토리지 리소스로서의 기능만 담당한다.

AWS EBS는 볼륨에 대한 특정 시점의 스냅샷을 지속적으로 작성하여 S3에 저장하는 방식으로 다수의 AZ에서 자동 복제 기능을 제공한다. 이렇게 생성된 스냅삿은 또 다른 EBS 볼륨 생성을 위한 시작점으로 활용 할 수 있으며 장기간 동안 서버와 관련된 데이터를 안전하게 보호할 수 있다. 스냅샷은 리전 간 복제도 가능하므로 서로 다른 리전에서 재난 복구, 데이터센터 마이그레이션, 지역 확장 등에 편리하게 사용가능하며 새로운 데이터센터에 사용할 서버 인프라 구축 시 신속하고 간편하게 프로비저닝할 수 있다.

EBS는 EC2 콘솔에서 확인할 수 있다.

![](https://user-images.githubusercontent.com/30178507/121777393-becffa00-cbcc-11eb-8382-79f6b794f104.png)

위 EC2 콘솔의 네비게이션 중 Elastic Block Store가 EBS 설정 탭이다.

## EBS의 특징

- 영구 스토리지

    아마존 EBS는 EC2 인스턴스의 수명 주기와 독립적인 생애주기를 갖는다.

- 범용성

    아마존 EBS는 특정 포뱃 형식을 따르지 않는 블록 스토리지로서 어떤 OS에서도 사 할 수 있다.

- 고가용성 및 고신뢰성

    아마존 EBS는 99.999%의 가 성을 제공하고 특정 컴포넌트가 실패할 경우 동일 AZ 내에서 자동으로 복제한다. 이 때 주의할 점은 EBS 볼륨은 서로 다른 AZ 간에 복제되지는 않다는 것이며, 동일 AZ내 다른 서버간에는 복제가 가능하다.

- 암호화 지원

    아마존 EBS는 데이터가 EC2 인스턴스와 EBS 볼륨 간을 이동할 때 그리고 저장 상태일 때 암호화를 지원한다.

- 다양한 저장 용량

    볼륨 크기는 1GB에서 16TB까지 가능하며 1GB 단위로 용량을 추가할 수 있다.

- 사용 편의성

    아미존 EBS 볼륨은 쉽게 생성, 부착, 백업, 복원, 삭제할 수 있다.

- 실패 대응성

    아마존 EBS의 연간 실패율 `AFR`은 0.1%에서 0.2%에 불과하다.

## EBS의 주요 서비스

AWS EBS는 세가지 타입 `인스턴스 스토어, SSD 타입, HDD 타입`의 블록 스토리지 서비스를 제공한다.

- AWS EC2 인스턴스 스토어

    EC2 인스턴스의 로컬 스토리지로 EBS 볼륨과는 달리 다른 인스턴스에 부착하여 사용할 수 없다. 또한 일시적인 스토리지이므로 인스턴스가 종료되면 저장된 내용도 사라진다. 복제도 불가능하고 스냅샷 생성도 불가능하다.

- AWS EBS 볼륨

    옵션으로는 부트 볼륨을 위한 고성능의 SSD와 로그 처리 등에 집중한 HDD가 있다.

- AWS EBS 일레스틱 볼륨

    일레스틱 볼륨은 AWS EBS의 특징 중 하나로 용량 증대, 성능 튜닝, 성능 저하 없이 기존의 볼륨을 변경할 수 있도록 한다.

### 볼륨 유형

- 범용 SSD(gp2)

    gp2는 EC2 인스턴스의 기본 EBS 볼륨 유형이다. SSD를 지원하는 gp2는 **개발/테스트 환경, 짧은 지연 시간의 대화형 애플리케이션 및 부트 볼륨을 비롯한 광범위한 트랜잭션 워크로드에 적합**하다.

    gp2는 10ms 미만의 지연시간을 제공하고 1GB 당 3 IOPS (최소 100 IOPS)에서  최대 16,000 IOPS의 일관된 기준 성능을 지원하며 볼륨당 최대 250MB/s의 처리량을 제공한다.

    I/O 작업은 gp2 요금에 포함되어 있기 때문에 프로비저닝한 스토리지의 GB에 대한 비용만 지불하면 된다. gp2의 요금은 **매월 GB당 0.1 달러**이다.

    gp2는 연중 99%의 시간동안 프로비저닝된 성능을 제공하도록 설계되었다. 만약 gp2가 제공하는 IOPS보다 더 높은 IOPS가 필요하거나 더 일관된 성능이 필요하다면 io1을 사용하는 것이 좋다.

    > 예를 들어 짧은 지연 시간이 매우 중요한 워크로드의 경우 gp2보다는 io1을 사용하는게 좋을 수 있다.

    gp2의 성능 극대화가 필요하다면 [EBS 최적화 EC2 인스턴스](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html)를 사용하는 것이 좋다.

- General Purpose SSD (gp3)

    gp3는 범용 SSD의 최신 버전으로 저장소 용량에 상관없이 성능을 프로비저닝하는 동시에 기존 gp2 볼륨보다 GB당 가격을 최대 20% 감축할 수 있다. gp3의 가격은 **매월 1GB당 0.08 달러**이다.

    gp3는 기본적으로 모든 볼륨 크기에서 3,000 IOPS, 125MiB/s의 성능을 제공하고 필요하다면 추가 요금을 내고 최대 16,000 IOPS, 1,000MiB/s까지 확장할 수 있다.

    gp3는 한 자리 수 밀리초 지연 시간을 제공하도록 설계되어 있어서 간 크기 단일 인스턴스 데이터베이스 (Microsoft SQL Server, Cassandra, MySQL, 그리고 Oracle DB), Hadoop 분석 클러스터, 저 지연 시간 대화형 앱, 개발 & 테스트 및 부팅 볼륨 등의 낮은 비용에 높은 성능을 필요로 하는 광범위한 애플리케이션에 이상적이다.

    gp3가 제공하는 기능보다 더 많은 IOPS가 필요하다면 io2 볼륨을 사용하는 것이 좋으며 gp3의 성능을 극대화하려면 [EBS 최적화 EC2 인스턴스](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSOptimized.html)를 고려할 수 있다.

> gp 유형은 네트워크 비용을 최적화

- 프로비저닝된 IOPS SSD(io1)

    io1은 중요한 I/O 집약적 데이터베이스 및 애플리케이션 워크로드와 처리량 집약적 데이터베이스 및 데이터 웨어하우스 워크로드(HBase, Vertica, Cassandra 등)를 위해 설계된 고성능 EBS 스토리지 옵션이다.

    io1은 지연 시간이 짧고 내구성 요구 사항이 보통 수준이거나 내장 애플리케이션 중복성을 포함하는 IOPS 집약적 및 처리량 집약적 워크로드 모두에 이상적이다.

    io1은 50IOPS/GB에서 최대 64,000 IOPS의 일관된 기준 성능을 지원하고 최대 1,000MB/s의 볼륨당 처리량을 지원한다. io1의 성능을 극대화하려면 [EBS 최적화 EC2 인스턴스](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSOptimized.html)를 고려할 수 있다.

    최고 성능인 64,000 IOPS와 초당 1,000MB의 처리량에 도달하기 위해서는 볼륨을 AWS Nitro 시스템에 구축된 EC2 인스턴스와 연결해야한다.

    io1은 **매월 1GB당 0.125 달러와 프로비저닝된 IOPS당 0.065 달러**가 과금된다.

- Provisioned IOPS SSD (io2)

    io1의 최신 버전으로 동일한 요금으로 100배 높은 내구성과 프로비저닝된 GB당 IOPS/스토리지 비율이 10배 높은 500 IOPS를 제공할 수 있도록 설계되었다. io2는 내구성 요구 사항이 높은 SAP HANA, Oracle, Microsoft SQL 서버, IBM DB2와 같이 I/O 집약적인 비즈니스 크리티컬 데이터베이스 애플리케이션을 위해 설계된 고성능 EBS 스토리지 옵션이다.

    io2는 500 IOPS/GB와 최대 64,000 IOPS의 일관된 기준 성능을 제공하고 볼륨당 최대 1,000MB의 처리속도를 지원한다.

    최고 성능인 64,000 IOPS와 초당 1,000MB의 처리량에 도달하기 위해서는 볼륨을 AWS Nitro 시스템에 구축된 EC2 인스턴스와 연결해야한다. io2의 성능을 극대화하려면 [EBS 최적화 EC2 인스턴스](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSOptimized.html)를 고려할 수 있다.

    io2의 요금은 매월 1GB당 0.125 달러와 프로비저닝된 IOPS의 요금은 32,000 IOPS 이하로는 IOPS 당 0.065 달러, 32001 ~ 64000 IOPS까지는 IOPS 당 0.046 달러의 요금이 부과된다.

---

- 콜드 HDD(sc1)

    모든 볼륨 유형중 GB당 비용이 가장 저렴한 볼륨 유형이다. **매월 1GB 당 0.015 달러**가 부과된다. **대량의 콜드 데이터 세트가 있고 액세스 빈도가 낮은 워크로드에 적합**하다. 즉, 자주 엑세스하지 않는 데이터를 관리할 때 적합하다.

    버스트 모델을 제공하며 TB당 80MB/s까지 버스트 가능하며 TB당 12MB/s의 기준 처리량과 볼륨당 250MB/s의 최대 처리량을 지원한다. 참고로 버스트 속도에서 기준 성능을 초과하는 경우 많은 양의 I/O를 버스트 하기 위해서 I/O 크래딧을 사용하며 sc1은 버스트 속도에서 전체 볼륨 스캔을 지원하기에 충분한 I/O 크래딧을 제공한다. sc1의 성능을 극대화하려면 [EBS 최적화 EC2 인스턴스](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSOptimized.html)를 고려할 수 있다.

- 처리량에 특화된 HDD(st1)

    st1은 MapReduce, Kafka, 로그 처리, 데이터 웨어하우스 및 ETL 워크로드와 같이 대규모 데이터 세트와 큰 I/O가 있는 자주 액세스하고 처리량 집약적인 워크로드에 적합하다. **매월 1GB당 0.045 달러**가 과금된다.

    st1은 처리량의 MB/s 단위로 측정된 성능을 제공하며 TB당 40MB/s의 기준 처리량과 볼륨당 500MB/s의 최대 처리량을 제공하며 TB당 최대 250MB/s까지 버스트 가능하다. st1은 버스트 속도에서 전체 볼륨 스캔을 지원하기에 충분한 I/O 크래딧을 제공한다. st1의 성능을 극대화하려면 [EBS 최적화 EC2 인스턴스](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSOptimized.html)를 고려할 수 있다.

- 마그네틱(standard)

    마그네틱은 이전세대의 볼륨 타입이며 신규 볼륨으로는 사용을 추천하지 않음.

> 참고로 io1/io2/gp2는 16K I/O 크기를 기준, st1/sc1은 1MB I/O 크기를 기준으로 한다.
볼륨 처리량은 MB = 1024 * 1024로 계산된다.

IOPS vs throughput: [https://stackoverflow.com/questions/15759571/iops-versus-throughput](https://stackoverflow.com/questions/15759571/iops-versus-throughput)
볼륨 유형 참고: [https://aws.amazon.com/ko/ebs/volume-types/](https://aws.amazon.com/ko/ebs/volume-types/)
EBS 성능 향상: [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSPerformance.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSPerformance.html)

# AWS EFS `아마존 일래스틱 파일 시스템`

EFS console: [https://ap-northeast-2.console.aws.amazon.com/efs/home?region=ap-northeast-2#/get-started](https://ap-northeast-2.console.aws.amazon.com/efs/home?region=ap-northeast-2#/get-started)

AWS EFS는 AWS EC2 인스턴스를 위한 파일 시스템 인터페이스 및 파일 시스템 시멘틱 환경을 제공한다. EC2 인스턴스에 EFS를 부착하면, EFS는 로컬 파일 시스템처럼 동작한다.

AWS EFS는 공유 파일 시스템으로서 다수의 인스턴스를 위한 공통 파일 시스템 역할을 하며 낮은 전송지연율로 인스턴스를 지원한다.

EFS는 파일 워크로드를 중심으로 병렬처리 및 고도의 처리성능이 요구되는 빅 데이터 애플리케이션에서부터 처리 지연 상황이 발생하지 말아야 할 싱글 스레드 워크로드에 이르기까지 방대한 성능 예측 자료를 제공한다.

EFS는 유전자 분석, 빅데이터 분석, 웹 서비스, 웹사이트 디렉터리, 콘텐츠 관리, 미디어 송출 등 다양한 용도로 사용된다.

요금은 Standard 기준으로 **월별 1GB당 0.33 달러**이다. EFS 라이프사이클 관리와 One Zone 스토리지를 사용한다면 요금을 더 줄일 수 있다.

Amazon EFS Infrequent Access 참고: [https://aws.amazon.com/ko/efs/features/infrequent-access/?&trk=el_a131L0000057zi2QAA&trkCampaign=CSI_Q2_2019_Storage_BizApps_EFS-IA_LP&sc_channel=el&sc_campaign=CSI_08_2019_Storage_EFS_Console&sc_outcome=CSI_Digital_Marketing](https://aws.amazon.com/ko/efs/features/infrequent-access/?&trk=el_a131L0000057zi2QAA&trkCampaign=CSI_Q2_2019_Storage_BizApps_EFS-IA_LP&sc_channel=el&sc_campaign=CSI_08_2019_Storage_EFS_Console&sc_outcome=CSI_Digital_Marketing)

## EFS의 특징

- 완전관리형

    완전관리형 서비스로 파일 시스템에 필요한 하드웨어 또는 소프트웨어를 구매하거나 관리 할 필요가 없다.

- 파일 시스템 액세스 시맨틱

    일반적인 파일 시스템과 동일하며, 읽기-후-쓰기 일관성, 파일 잠금, 계층적 디렉터리 구조, 파일 조작 명령, 세분화된 파일 명칭 부여, 파일 중간의 특정 블록에 쓰기 등 어떤 작업이든 가능하다.

- 파일 시스템 인터페이스

    표준 OS API와 호환성이 유지되는 파일 시스템 인터페이스를 제공한다. 표준 OS API를 사용하는 애플리케이션이라면 EFS를 통해 기존의 모든 파일 작업을 문제 없이 처리 할 수 있다.

- 공유 파일 시스템

    수천 개의 인스턴스와 연결할 수 있는 공유 파일 시스템이다. 다수의 EC2 인스턴스를 EFS로 연결하면, 해당 인스턴스는 동일한 데이터세트에 접근할 수 있다.

- 민접성 및 확장성

    EFS를 통해 페타바이트 규모로 민첩하게 확장할 수 있다. 프로비전량을 걱정 할 필요가 없으며, 파일 시스템을 생성해서 사용하면 데이터 크기 에 따라 자동으로 확대 및 축소된다.

- 고성능

    다양한 유형의 워크로드에 대웅하도록 설계됐다. 높은 일관성, 높은 처리 성능, 높은 IOPS, 낮은 전송지연율을 제공한다.

- 고가용성 및 고신뢰성

    EFS의 데이터는 리전 내 다수의 AZ에 자동으로 복제된다. 이를 통해 고가용성, 다중 AZ 접근성, 데이터 손실로부터의 보호를 통한 고신뢰성을 제공한다.

## EFS의 구현 토대

![](https://user-images.githubusercontent.com/30178507/121777394-c0012700-cbcc-11eb-81bc-8ca5408119b5.png)

EFS는 고가용성과 고신뢰성을 기반으로 간편성, 민첩성, 확장성을 구현한 파일 시스템이다. 데이터는 자동으로 다수의 AZ에 복제되고 일부 AZ와 연결이 중단되도 문제가 없도록 설계되어있다. 이와 같이 다수 AZ를 통한 데이터 보호 철학은 NAS에 비해 우수하다.

- 간편성

    누구든 수 초 이내에 EFS 인스턴스를 생성할 수 있으며, 관리해야 할 파일 레이어 또는 하드웨어가 없다. EFS는 지속적인 유지보수 필요성을 없애고, 업그레이드 및 갱신 사이클 관리 필요성 또한 제거한다.

    기존의 도구 및 앱과는 호환성이 유지되며, NFS 프로토콜을 사용하므로 VPC를 통해 직접 연결하면 NFS 4.1 프로토콜을 통해 온프레미스 서버에 EFS를 부착할 수 있다. 기존의 온프레미스 서버를 AWS 클라우드에 바로 연결할 수 있디는 점에서 매우 큰 편의성 요소라 할 수 있다.

- 민첩성

    파일의 추가 또는 삭제 행동에 따라 파일 시스템의 크기가 자동으로 확대 및 축소되므로, 미리 사용량 계획 을 세우거나 프로비저닝을 걱정 할 필요가 없고, 파일 시스템의 용량 제한 여부도 신경 쓸 필요가 없다. 그저 사용량에 따른 비용만 지불하면 된다.

- 확장성

    파일 시스템의 크기에 따라 처리성능과 IOPS가 자동으로 조절된다. 페타바이트 규모로 성장하더라도 리프로비전, 성능 요소 재설정 등을 신경쓸 필요가 없다.

## AWS EFS 성능 모델

AWS EFS의 기본적인 성능 모델은 **범용성 모델**로 처리지연에 민감한 애플리케이션, 범용의 파일 기반 워크로드에 적합하며, 기타 다양한 목적으로 활용될 수 있다.

**AWS EFS의 맥스 I/O 모드**는 수천, 수십만개의 EC2 인스턴스를 위한 파일 시스템이 필요한 대규모의 데이터 집약 애플리케이션에 적합하며, 범용성 모델에 비해 높은 수준의 처리 성능을 제공한다.

AWS CloudWatch 매트릭스를 이용해서 EFS의 성능을 시각화할 수 있다. AWS CloudWatch를 통해 애플리케이션에 적용된 맥스 I/O의 효과를 확인할 수 있고, 성능이 기대치에 미치지 못할 경우 범용성 모드로 전환할 수 있다.

## EFS 사용해보기

EFS 콘솔에서 파일 시스템 생성을 클릭하면 다음과 같이 서비스 권장 설정으로 EFS 파일 시스템 생성 팝업이 등장한다.

![](https://user-images.githubusercontent.com/30178507/121777395-c1325400-cbcc-11eb-9431-e9003267cf58.png)

크게 EFS의 이름, VPC, 가용성 및 내구성 설정을 하면 간단하게 AWS에서 권장하는 설정으로 EFS가 만들어진다.

만약 사용자 지정을 선택하면 일반, 네트워크, 정책으로 나눠서 세부 설정이 가능하다.

![](https://user-images.githubusercontent.com/30178507/121777396-c2638100-cbcc-11eb-93ab-a6024af1bf11.png)

세부 설정에서는 자동 백업 설정, 라이프사이클, 성능모드, 처리량모드, 암호화를 추가로 설정할 수 있다.

![](https://user-images.githubusercontent.com/30178507/121777397-c394ae00-cbcc-11eb-8805-73b2f392cf25.png)

![](https://user-images.githubusercontent.com/30178507/121777398-c4c5db00-cbcc-11eb-8609-e6aec053bb92.png)

S3와 마찬가지로 ACL과 세부 정책을 설정할 수 있는 것으로 보인다.