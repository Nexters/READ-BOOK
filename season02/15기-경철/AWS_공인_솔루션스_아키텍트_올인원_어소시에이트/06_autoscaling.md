# AWS Auto Scaling

- [AWS Auto Scaling](#aws-auto-scaling)
  - [Auto Scaling?](#auto-scaling)
    - [Auto Scaling 작동 방식](#auto-scaling-작동-방식)
  - [AutoScaling 시작하기](#autoscaling-시작하기)
    - [시작 템플릿 `Launch Template` 만들기](#시작-템플릿-launch-template-만들기)
      - [시작 템플릿 정의하기](#시작-템플릿-정의하기)
    - [Auto Scaling Group `ASG, 오토 스케일링 그룹` 만들기](#auto-scaling-group-asg-오토-스케일링-그룹-만들기)
      - [Auto Scaling Group 정의하기](#auto-scaling-group-정의하기)
  - [Auto Scaling 동적 조정 정책](#auto-scaling-동적-조정-정책)
    - [동적 조정 정책 유형](#동적-조정-정책-유형)
      - [대상 추적 조정 `Target tracking scaling`](#대상-추적-조정-target-tracking-scaling)
      - [단계 조정 `Step scaling`와 간편 조정 `Simple scaling`](#단계-조정-step-scaling와-간편-조정-simple-scaling)

## Auto Scaling?

오토 스케일링은 미리 정해놓은 규칙에 따라 워크로드를 자동으로 확대 또는 축소할 수 있는 기술로 클라우드가 제공하는 탄력성에 의해 만들어지고, 사용자의 요구 수준을 세심하게 반영할 수 있는 혁신적인 기술이다.

오토 스케일링을 통해 TPS가 급등하더라도 그에 맞춰 자동으로 추가해주며 TPS가 줄어들면 자동으로 리소스를 감소시킨다.

오토 스케일링은 EC2에서 주로 사용하지만 AWS의 다른 서비스들의 스케일 조정에도 활용된다.

- EC2 스팟 인스턴스
- ECS
- EMR 클러스터
- AppStream 2.0 인스턴스
- DynamoDB

### Auto Scaling 작동 방식

![](https://user-images.githubusercontent.com/30178507/124680783-175f9200-df02-11eb-8cfe-8da7d7713eb7.png)

Auto Scaling Group은 논리적 단위로 처리되는 Amazon EC2 인스턴스의 모음이다. 그룹 및 해당 인스턴스에 대한 설정을 구성하고, 그룹의 최소, 최대 및 원하는 용량을 정의하여 애플리케이션의 로드가 수요에 따라 크게 높아지거나 낮아질 때 그룹을 조정할 수 있다. Auto Scaling 그룹을 조정하려면 원하는 용량을 수동으로 조정하거나 Amazon EC2 Auto Scaling에서 수요의 변화를 충족하도록 용량을 자동으로 추가 및 제거할 수 있도록 한다.

인스턴스 플릿을 시작할 때 온디맨드 인스턴스가 충족해야 하는 용량의 비율과 스팟 인스턴스가 충족해야 하는 비율을 지정하여 EC2 비용을 최대 90% 절감할 수 있다. Amazon EC2 Auto Scaling을 사용하면 가용 영역에서 용량을 프로비저닝하고 조정하여 가용성을 최적화할 수 있으며 수명 주기 후크, 인스턴스 상태 확인 및 예약된 조정 기능을 통해 용량 관리를 자동화할 수 있다.

## AutoScaling 시작하기

### 시작 템플릿 `Launch Template` 만들기

Auto Scaling을 사용하기 위해서는 먼저 시작 템플릿 `Launch Template`을 작성해야한다. 시작 템플릿이란 AMI 상세정보, 인스턴스 타입, 키 페어, 시큐리티 그룹, IAM 인스턴스 프로파일, 유저 데이터, 부착 스토리지 등 인스턴스에 대한 설정을 담은 템플릿으로 시작 템플릿을 활용하여 EC2를 실행하면 시작 템플릿에 설정한 정보를 기반으로 인스턴스가 실행된다.

#### 시작 템플릿 정의하기

시작 템플릿은 EC2 > 인스턴스 > 시작 템플릿 탭에서 생성/설정 할 수 있다.

![](https://user-images.githubusercontent.com/30178507/124680786-19295580-df02-11eb-9508-e5d0ce5655cb.png)

위 캡처는 시작 탬플릿 생성 캡처이다.

- 시작 템플릿 이름 및 설명

    ![](https://user-images.githubusercontent.com/30178507/124680788-19c1ec00-df02-11eb-9cc0-5b4053f09b97.png)

    말 그대로 정의하고자 하는 시작 템플릿의 이름과 설명을 작성하는 칸이다. 그외 해당 템플릿의 태그를 지정할 수 있으며 기준이 될 원본 템플릿 설정도 가능하다.

    특이점은 AutoScaling 지침이 있는데 이를 활성화하면 Auto Scaling 용에 최적화하여 설정할 수 있도록 도와준다.

- 시작 템플릿 세부 정보 지정

    ![](https://user-images.githubusercontent.com/30178507/124680791-1af31900-df02-11eb-8bca-25e6598a372e.png)

    해당 시작 템플릿으로 생성하는 EC2 인스턴스의 AMI와 인스턴스의 유형, 키페어를 설정한다.

    AMI는 AWS에서 기본 제공하는 AMI, 마켓플레이스의 AMI 그리고 커스텀하게 설정한 AMI를 사용할 수 있다.

    > 위 예시에서는 직접 커스텀해서 만든 AMI를 설정하였다.

    ![](https://user-images.githubusercontent.com/30178507/124680795-1c244600-df02-11eb-9867-4d297b1daf71.png)

    다음으로 네트워크 설정과 스토리지 설정을 할 수 있다.

    스토리지는 위 예시에서 `Dokcer Installed AMI`가 범용 SSD `gp2` 8GiB의 EBS를 사용하도록 설정되어 있기 때문에 자동으로 설정되었다.

    ![](https://user-images.githubusercontent.com/30178507/124680801-1e86a000-df02-11eb-8f87-98e17bb1bc26.png)

    그리고 그 아래에 EC2에 설정할 태그와 네트워크 인터페이스를 설정할 수 있는 칸과 함께 각종 고급 세부 정보를 설정할 수 있는 칸이 있다.

![](https://user-images.githubusercontent.com/30178507/124680803-1fb7cd00-df02-11eb-9b17-006c89b53db1.png)

위 소개된 폼을 작성하여 템플릿을 생성하면 다음과 같은 시작 템플릿이 생성된 것을 알 수 있다.

### Auto Scaling Group `ASG, 오토 스케일링 그룹` 만들기

오토 스케일링 그룹이란 scale up 및 scale down 규칙의 모음이며, EC2 인스턴스의 시작부터 삭제까지의 모든 동작에 대한 규칙과 정책을 담고 있다. 오토 스케일링 그룹은 EC2 서버가 하나의 그룹으로 작동하는 방법과 사용자 정의에 따라 동적으로 그룹화하는 방법을 정의한다.

#### Auto Scaling Group 정의하기

Auto Scaling Group은 EC2 > Auto Scaling 탭에서 생성/설정 할 수 있다.

시작 템플릿 또는 구성 선택 - 설정 구성 - 고급 옵션 구성 - 그룹 크기 및 조정 정책 구성 - 알림 추가 - 태그 추가 - 완료의 총 7단계로 이뤄진다.

1. 시작 템플릿 또는 구성 선택

    ![](https://user-images.githubusercontent.com/30178507/124680806-20e8fa00-df02-11eb-8659-0e778e745e2b.png)

    1단계인 시작 템플릿 또는 구성 선택에서는 Auto Scaling Group의 이름과 시작 템플릿을 설정할 수 있다.

    여기서 Auto Scaling Group의 이름과 시작 템플릿은 필수값이므로 반드시 설정해야한다.

    ![](https://user-images.githubusercontent.com/30178507/124680807-221a2700-df02-11eb-8417-acf2ff7ace74.png)

2. 설정 구성

    ![](https://user-images.githubusercontent.com/30178507/124680809-234b5400-df02-11eb-9f9d-56d2ebf7a861.png)

    설정 구성 단계는 인스턴스의 구매 옵션과 VPC를 설정하는 단계이다.

    여기서 기존 시작 템플릿의 설정과는 다르게 구매 옵션과 인스턴스 유형을 조합하여 인스턴스를 띄울 수 있도록 설정할 수 있다.

    ![](https://user-images.githubusercontent.com/30178507/124680811-247c8100-df02-11eb-9054-b94eb35bde05.png)

    네트워크에서는 아래와 같이 서브넷을 반드시 지정해야한다. 이때 아래 예시에서는 서울 리전의 A존과 C존으로 서브넷을 설정했는데 이 경우 위 Auto Scaling Group에서는 A존과 C존에서만 인스턴스가 띄워진다.

    ![](https://user-images.githubusercontent.com/30178507/124680814-26464480-df02-11eb-9516-fab8ef206450.png)

3. 고급 옵션 구성

    ![](https://user-images.githubusercontent.com/30178507/124680819-27777180-df02-11eb-9527-7985e3c9fc34.png)

    3단계 고급 옵션 구성에서는 로드밸런싱과 헬스체크에 대한 설정이다.

    기존 로드밸런서에 연결을 선택하면 기존에 만들어진 로드밸런서에 연결할 수 있도록 선택할 수 있다.

    ![](https://user-images.githubusercontent.com/30178507/124680822-28100800-df02-11eb-8b41-30330a121f3c.png)

    또한 새롭게 만들수도 있는데 다음과 같이 설정 가능하다.

    ![](https://user-images.githubusercontent.com/30178507/124680825-29413500-df02-11eb-899b-e7998930de97.png)

4. 그룹 크기 및 조정 정책 구성

    ![](https://user-images.githubusercontent.com/30178507/124680827-2a726200-df02-11eb-89cf-37fd7ef01395.png)

    그룹 크기 및 조정 정책 구성 단계는 Auto Scaling의 크기와 어떻게 Auto Scaling을 할지 조정 정책을 정의할 수 있는 단계이다. 참고로 원하는 용량만큼 인스턴스가 생성된다.

    조정 정책으로는 평균 CPU 사용률, 평균 네트워크 입출력, 요청 수로 인스턴스를 어떻게 늘릴지 설정할 수 있다.

    ![](https://user-images.githubusercontent.com/30178507/124680830-2ba38f00-df02-11eb-9ed1-e89666792f37.png)

5. 알림 추가

    ![](https://user-images.githubusercontent.com/30178507/124680831-2cd4bc00-df02-11eb-9582-2ccaf84aa3cf.png)

    해당 Auto Scaling Group의 EC2 인스턴스가 시작하거나 종료할 때 알림을 보내주기 위한 설정 단계이다. SNS topic을 생성하여 알림을 설정할 수 있다.

6. 태그 추가

    ![](https://user-images.githubusercontent.com/30178507/124680834-2e05e900-df02-11eb-9bc7-2abde078c6ba.png)

    Auto Scaling Group으로 띄우는 인스턴스의 태그를 설정하는 단계이다. 단, 시작 템플릿에 태그를 지정하여 인스턴스 및 연결된 EBS 볼륨에 태그를 추가할 수도 있는데 이 경우 Auto Scaling 그룹에 대해 중복된 키가 지정되어 있는 경우 시작 템플릿의 인스턴스 태그 값이 덮어 씌워지기 때문에 주의해야한다.

    > 즉, Auto Scaling의 태그가 더 우선한 것으로 보인다.

7. 완료

    ![](https://user-images.githubusercontent.com/30178507/124680837-2f371600-df02-11eb-8a80-afdaddf1af2c.png)

    전체 설정을 확인하고 Auto Scaling Group을 생성하는 단계이다.

## Auto Scaling 동적 조정 정책

Auto Scaling 동적 조정이란 수요 변화에 따라 Auto Scaling Group의 용량을 조정하는 방법을 의미한다. 동적 조정 정책은 Auto Scaling Group이 특정 CloudWatch 지표를 추적하여 연결된 CloudWatch 알림이 경보 상태에 있을 때 수행할 작업을 정의하는 것을 의미한다. 이때 경보를 울리는데 사용하는 지표는 Auto Scaling Group에 연결된 모든 인스턴스의 지표를 집계한 것이다.

### 동적 조정 정책 유형

동적 조정 정책에는 대상 추적 조정 `Target tracking scaling`, 단계 조정 `Step scaling`, 간편 조정 `Simple scaling`이 있다.

#### 대상 추적 조정 `Target tracking scaling`

대상 추적 조정 정책은 조정 측정 단위를 선택하여 Auto Scaling Group을 확장/축소하도록 만드는 정책이다.

대상 추적 조정 정책은 다음과 같은 특성으로 동작한다.

- 대상 추적 조정 정책은 **지정한 측정치가 목표 값을 초과할 때 Auto Scaling Group을 확장**하도록 되어 있다. 즉, 대상 추적 조정 정책을 사용하여 지정된 측정치가 목표 값보다 작을 때 Auto Scaling Group을 확장할 수 없습니다.
- 대상 값과 실제 지표 데이터 포인트 사이에는 차이가 발생할 수 있다. 추가하거나 제거할 인스턴스 수를 결정할 때마다 **항상 반올림 또는 내림을 통해 어림짐작으로 동작**하기 때문인데 이는 인스턴스를 부족하게 추가하거나 너무 많이 제거하는 일을 방지하기 위해서이다.

    이때 하지만 인스턴스가 줄어서 Auto Scaling Group이 작아지는 경우에는 그룹의 사용량이 목표 값에서 멀어질 수도 있다. 예를 들어 CPU 사용률 목표값을 50% 로 설정한 후 Auto Scaling Group이 목표값을 초과한다고 가정할 때 1.5개의 인스턴스를 추가하면 CPU 활용률이 50% 가까이 감소할 것을 알 수 있다. 하지만 1.5개의 인스턴스를 추가할 수 없기 때문에 반올림을 통해 인스턴스 2개를 추가하게 되는데 그러면 CPU 사용량이 50% 아래로 떨어지는 동시에 애플리케이션은 리소스를 충분히 확보하게 된다. 마찬가지로 인스턴스를 1.5개 제거하면 CPU 사용량이 증가하여 50%를 상회한다고 판단할 경우에는 인스턴스를 1개만 제거하게된다.

- 인스턴스가 더 많고 크기가 큰 Auto Scaling Group의 경우 사용률이 더 많은 수의 인스턴스에 분산되므로 인스턴스를 추가 또는 제거하면 대상 값과 실제 지표 데이터 포인트 간에 차이가 줄어든다.
- 애플리케이션 가용성을 보장하기 위해 Auto Scaling Group은 측정치에 비례하여 가능한 신속하게 확장되지만, 축소는 점진적으로 이루어진다.
- 각각 다른 측정치를 사용한다는 전제 하에 **Auto Scaling Group에 대해 다수의 대상 추적 조정 정책을 보유할 수 있다**. Auto Scaling의 목적은 항상 가용성을 우선시하므로, 대상 추적 정책이 확장 또는 축소를 허용하는지에 따라 그 동작이 달라지는데 대상 추적 정책 중 하나라도 확장을 허용할 경우 Auto Scaling Group을 확장하지만 모든 대상 추적 정책이 축소를 허용하는 경우에만 그룹을 축소하게된다.

    [다중 동적 조정 정책 제공](https://docs.aws.amazon.com/ko_kr/autoscaling/ec2/userguide/as-scale-based-on-demand.html#multiple-scaling-policy-resolution) 섹션을 참고

- **대상 추적 조정 정책에서 축소 부분을 비활성화할 수 있다**. 이 기능은 Auto Scaling Group의 크기를 다른 방법으로 조정할 수 있는 유연성을 제공한다.
- 대상 추적 조정 정책을 위해 구성된 CloudWatch 경보는 편집하거나 삭제하면 안된다. 대상 추적 조정 정책과 연결된 CloudWatch 경보는AWS이며 더 이상 필요하지 않을 때 자동으로 삭제된다.

기본적으로 Auto Scaling Group 평균 CPU 사용률 `ASGAverageCPUUtilization`,  Auto Scaling Group 별 모든 네트워크 인터페이스에서 수신한 평균 바이트 수 `ASGAverageNetworkIn`,  Auto Scaling Group 별 모든 네트워크 인터페이스에서 송신한 평균 바이트 수 `ASGAverageNetworkOut`, ALB Target Group에서 Target 별 요청 수 `ALBRequestCountPerTarget`를 사용하여 동적 조정 정책을 설정할 수 있으며 필요에 따라 직접 지정하여 정책 설정을 할 수 있다.

#### 단계 조정 `Step scaling`와 간편 조정 `Simple scaling`

단계 조정 정책과 간편 조정 정책은 CloudWatch 경보에 대한 조정 지표와 임계값을 선택하여 지정한 기간 동안 임계값을 위반했을때 Auto Scaling Group을 어떻게 조정할 지 정의하는 방법이다.

따라서 두 정책 모두 조정 정책에 대한 CloudWatch 알림을 생성해야한다. 모두 인스턴스를 추가 또는 제거할 지에 대한 여부와 추가/제거할 인스턴스 대수를 정의해야한다.

두 정책의 차이는 단계 조정 정책을 통해 단계 조절이 가능한지 불가능한지로 나뉜다. 가능하다면 단계 조정, 불가능하다면 간편 조정이 된다.

단순 조정 정책은 확장/축소가 시작된 후에 조정 활동이나 상태 확인 대체가 완료되고 휴지 기간이 만료될 때까지 기다린 후에 추가 알림에 응답해야한다는 문제가 있다. 반면 단계 조정에서는 조정 활동 또는 상태 확인 대체가 진행 중일때에도 정책이 추가 알림에 응답할 수 있다.

> 휴지 기간이란 이전 조정 활동이 적용되기 전에 인스턴스를 추가로 시작하거나 종료하지 않도록 대기하는 시간이다. 이를 통해 만약 인스턴스가 비정상적 상태인 경우 휴지 기간이 완료될 때까지 대기하지 않고 비정상적 인스턴스를 교체한다.

따라서 대부분의 경우 단계 조정이 간편 조정보다 낫다.
