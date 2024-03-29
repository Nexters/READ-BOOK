# AMI 

- [AMI](#ami)
  - [인스턴스 루트 볼륨 `Instance Root Volume`](#인스턴스-루트-볼륨-instance-root-volume)
    - [AMI 가상화](#ami-가상화)

AMI는 AWS에서 실행되는 서버에 대한 모든 소프트웨어 환경설정 정보를 포함한 기본 설계도 또는 청사진과 같다.

AMI는 다음을 포함한다.

- 1개 이상의 Amazon Elastic Block Store `EBS` 스냅샷 또는, 인스턴스 스토어 기반 AMI의 경우, 인스턴스의 루트 볼륨에 대한 템플릿 `운영 체제, 애플리케이션 서버, 애플리케이션`
- AMI를 사용하여 인스턴스를 시작할 수 있는 AWS 계정을 제어하는 시작 권한 `launch permission`

    시작 권한으로 퍼블릭 `Public`, 명시적 `Explicit`, 암묵적 `Implicit`으로 분류된다.

- 시작될 때 인스턴스에 연결할 볼륨을 지정하는 블록 디바이스 매핑

    즉, 실행할 인스턴스에 어떤 볼륨 타입을 부착할지를 정의한 블록 디바이스 매핑 정보가 포함되어있다.

## 인스턴스 루트 볼륨 `Instance Root Volume`

모든 AMI는 Amazon EBS 기반 AMI와 인스턴스 스토어 기반 AMI로 분류된다. Amazon EBS 기반 AMI는 루트 디바이스가 Amazon EBS 스냅샷에서 생성된 EBS 볼륨이라는 것을 의미하는 반면 인스턴스 스토어 기반 AMI는 루트 디바이스가 Amazon S3에 저장된 템플릿에서 생성된 인스턴스 스토어 볼륨이라는 것을 의미한다.

AMI에는 AMI의 유형이 포함되는데 이때 루트 디바이스가 `ebs`나 `instance store`로 언급될 수 있다.

특성 | EBS 기반 AMI | 인스턴스 스토어 기반 AMI
:--: | :--: | :--:
인스턴스의 부팅 시간 | 일반적으로 1분 이하 | 일반적으로 5분 이하
루트 디바이스의 크기 제한 | 16TiB | 10GiB
루트 디바이스 볼륨 | EBS 볼륨 | 인스턴스 스토어 볼륨
데이터 지속성 | 기본적으로 인스턴스가 종료되면 루트 볼륨이 삭제됩니다. 다른 EBS 볼륨의 데이터는 기본적으로 인스턴스 종료 후에도 유지됩니다. | 모든 인스턴스 스토어의 데이터는 인스턴스 수명 주기 동안만 유지됩니다.
수정 | 인스턴스 유형, 커널 RAM 디스크 및 사용자 데이터는 인스턴스가 중지된 동안에 변경될 수 있습니다. | 인스턴스 속성은 인스턴스 수명 주기 동안 고정됩니다.
요금 | 인스턴스 사용량, EBS 볼륨 사용량 및 AMI를 EBS 스냅샷으로 저장하는 것에 대한 비용이 청구됩니다. | 인스턴스 사용량 및 Amazon S3에 AMI를 저장하는 것에 대한 비용이 청구됩니다.
AMI 생성/번들링 | 단일 명령/호출을 사용합니다 | AMI 도구를 설치 및 사용해야 합니다
중지 상태 | 중지 상태일 수 있습니다. 인스턴스가 중지되고 실행 중이지 않은 경우에도 루트 볼륨은 Amazon EBS에 유지됩니다. | 중지 상태가 될 수 없습니다. 인스턴스가 실행 중이거나 종료되었습니다

> 참고로 EBS 루트 볼륨의 `DeleteOnTermination` 값은 true로 설정되어있다.

### AMI 가상화

Linux AMI는 HVM `하드웨어 가상머신` 방식과 PV `반가상화` 방식을 사용한다.

> 현 세대 인스턴스는 모두 HVM을 지원한다. PV는 이전 세대 인스턴스에서 지원.

- HVM AMI

    HVM은 루트 블록 디바이스의 부트 마스터 레코드를 실행한 후 운영체제에 하드웨어의 모든 설정 내용을 가상화한다. 즉, 운영체제는 VM 바로 위에서 실행하는 상태가 된다. 이를 통해 별다른  수정 작업 없이 가상 머신 위에서 직접 운영체제를 실행하므로 베어 메탈 하드웨어에서 실행하는 것과 유사하다.

    현 세대 인스턴스 타입은 HVM AMI를 지원한다.

- PV AMI

    PV는 PV-GRUB라고 부르는 부트로더를 통해 부팅하며 부트 사이클을 실행한 뒤 머신 이미지에 있는 menu.lst 파일에 정의된 커널을 로딩한다.

    PV는 반가상화 방식이므로 HVM에서 제공하는 강화 네트워킹이나 GPU 프로세싱 등의 기능을 활용할 수 없다.

    PV는 현 세대 인스턴스 타입에서는 지원하지 않으며 이전 세대 인스턴스에서 지원한다.

\ | HVM | PV
:--: | :--: | :--:
설명 | HVM AMIs는 이미지 루트 블록 디바이스의 마스터 부트 레코드를 실행하여 완벽하게 가상화된 하드웨어 및 부트 세트를 함께 제공합니다. 이 가상화 유형은 운영 체제 미설치 하드웨어에서 실행될 때처럼 가상 머신에서 운영 체제를 수정하지 않고 실행할 수 있습니다. Amazon EC2 호스트 시스템은 게스트에게 제공되는 기본 하드웨어의 일부 또는 모두를 에뮬레이트합니다. | PV AMIs는 PV-GRUB라는 특수 부트 로더를 통해 부팅되며, 이 로더는 부팅 주기를 시작한 후 사용자 이미지의 menu.lst 파일에 지정된 커널을 체인 로드합니다. 반가상화 게스트는 가상화를 명시적으로 지원하지 않는 하드웨어에서 실행할 수 있습니다. 이전에는 대부분의 경우 PV 게스트가 HVM 게스트보다 더 나은 성능을 제공했지만, HVM 가상화 기능이 향상되고 HVM AMI용 PV 드라이버가 제공되는 현재는 더 이상 그렇지 않습니다. PV-GRUB 및 Amazon EC2에서의 사용에 대한 자세한 내용은 자체 Linux 커널 활성화 단원을 참조하십시오.
하드웨어 확장 지원 | 예. PV 게스트와 달리 HVM 게스트는 하드웨어 확장을 활용하여 호스트 시스템의 기본 하드웨어에 빠르게 액세스할 수 있습니다. Amazon EC2에서 제공되는 CPU 가상화 확장에 대한 자세한 내용은 Intel 웹 사이트의 Intel Virtualization Technology를 참조하십시오. 향상된 네트워킹 및 GPU 처리를 활용하려면 HVM AMI가 필요합니다. 특수 네트워크 및 GPU 디바이스에 대한 명령을 통과하기 위해 OS는 기본 하드웨어 플랫폼에 액세스할 수 있어야 하고, HVM 가상화는 이 액세스 기능을 제공합니다. 자세한 내용은 Linux에서 향상된 네트워킹 및 Linux 액셀러레이티드 컴퓨팅 인스턴스 섹션을 참조하세요. | 아니요. 향상된 네트워킹 또는 GPU 처리와 같은 특수 하드웨어 확장을 활용할 수 없습니다.
지원되는 인스턴스 유형 | 모든 최신 인스턴스 유형은 HVM AMI를 지원합니다. | C1, C3, HS1, M1, M3, M2, T1 등과 같은 전 세대 인스턴스 유형은 PV AMI를 지원합니다. 최신 세대 인스턴스 유형은 PV AMI를 지원하지 않습니다.
지원하는 리전 | 모든 리전은 HVM 인스턴스를 지원합니다. | 아시아 태평양(도쿄), 아시아 태평양(싱가포르), 아시아 태평양(시드니), 유럽(프랑크푸르트), 유럽(아일랜드), 남아메리카(상파울루), 미국 동부(버지니아 북부), 미국 서부(캘리포니아 북부 지역) 및 미국 서부(오레곤)
검색 방법 | 콘솔 또는 describe-images 명령을 사용하여 AMI의 가상화 유형이 hvm로 설정되어 있는지 확인합니다. | 콘솔 또는 describe-images 명령을 사용하여 AMI의 가상화 유형이 paravirtual로 설정되어 있는지 확인합니다.
