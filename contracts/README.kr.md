# 🎴 BaseCard 스마트 컨트랙트

> **EVM 보안 센티넬 & TDD 아키텍트**  
> 테스트 주도 개발로 안전하고 가스 최적화된 스마트 컨트랙트를 구축합니다.

이 프로젝트는 BaseCard MVP를 위한 스마트 컨트랙트를 구현합니다. 사용자는 자신의 프로필 카드를 나타내는 NFT를 민팅하고 특정 행동에 대해 토큰을 획득할 수 있는 시스템입니다.

[Foundry](https://book.getfoundry.sh/)로 구축되었습니다 — 이더리움 개발을 위한 빠르고 현대적인 툴킷입니다.

---

## 📋 목차

-   [핵심 기능](#-핵심-기능)
-   [컨트랙트 아키텍처](#-컨트랙트-아키텍처)
-   [시작하기](#-시작하기)
-   [개발 워크플로우](#-개발-워크플로우)
-   [배포 가이드](#-배포-가이드)
-   [컨트랙트 상호작용](#-컨트랙트-상호작용)
-   [보안 고려사항](#-보안-고려사항)

---

## 🎯 핵심 기능

| 기능              | 설명                                                                    | 보상         |
| ----------------- | ----------------------------------------------------------------------- | ------------ |
| **민팅으로 수익** | 사용자가 첫 번째 `BaseCard` NFT를 민팅할 때 `CARD` 토큰을 받습니다      | ✅ 토큰 보상 |
| **연결로 수익**   | 소셜 프로필(X/Twitter, Farcaster 등)을 연결할 때 `CARD` 토큰을 받습니다 | ✅ 토큰 보상 |
| **프로필 관리**   | 닉네임, 소개, 이미지, 베이스네임, 소셜 링크 업데이트                    | -            |
| **소셜 통합**     | 여러 소셜 계정을 BaseCard에 연결                                        | -            |

### 토큰 경제학

-   **ERC721 `BaseCard` NFT**: 사용자의 신원 카드를 나타내는 대체 불가능한 토큰
-   **ERC20 `CARD` 토큰**: 생태계 참여를 위한 대체 가능한 보상 토큰

---

## 🏗️ 컨트랙트 아키텍처

```
contracts/
├── src/
│   ├── BaseCard.sol      # 메인 ERC721 NFT 컨트랙트 (프로필 카드)
│   └── CardToken.sol     # ERC20 보상 토큰 컨트랙트
├── test/
│   └── BaseCard.t.sol    # 포괄적인 테스트 스위트 (TDD)
├── script/
│   └── DeployBaseCard.s.sol  # 배포 스크립트
└── Makefile              # 단순화된 명령어 인터페이스
```

### 보안 기능

-   ✅ **OpenZeppelin 컨트랙트**: 검증되고 감사된 구현체
-   ✅ **접근 제어**: 소유자 전용 관리 기능
-   ✅ **재진입 보호**: 안전한 상태 관리 패턴
-   ✅ **입력 검증**: 포괄적인 매개변수 검사
-   ✅ **가스 최적화**: 커스텀 에러, 불변 변수, 효율적인 데이터 구조

---

## 🚀 시작하기

### 사전 요구사항

1. **Foundry 설치**:

    ```bash
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
    ```

2. **의존성 설치**:
    ```bash
    # JSON 파싱을 위한 jq 설치 (배치 민팅에 필요)
    brew install jq  # macOS
    # 또는
    sudo apt install jq  # Linux
    ```

### 초기 설정

개발 환경을 설정하려면 다음 단계를 따르세요:

```bash
# 1. contracts 디렉토리로 이동
cd contracts

# 2. 니모닉 파일 생성 (12/24단어 시드 구문)
touch .mn
# .mn 파일에 니모닉 구문 추가

# 3. 키스토어 암호화를 위한 비밀번호 파일 생성
touch .password
# .password 파일에 비밀번호 추가

# 4. 환경 변수 복사 및 구성
cp .env.example .env
# .env를 구성으로 편집 (아래 참조)

# 5. Foundry 키스토어에 배포자 지갑 가져오기
make wallet-import

# 6. 지갑 가져오기 확인
make wallet-list
```

### 환경 구성

`.env`를 구성으로 편집하세요:

```bash
# 네트워크 RPC URL
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key_here
NETWORK=base_sepolia

# Foundry 구성
ETH_FROM=your_deployer_address          # 지갑 주소
ETH_KEYSTORE_ACCOUNT=deployer           # 키스토어 계정 이름
ETH_PASSWORD=.password                  # 비밀번호 파일 경로

# 배포된 컨트랙트 주소 (배포 후 채워짐)
CARD_TOKEN_ADDRESS=deployed_card_token_contract
BASE_CARD_ADDRESS=deployed_basecard_contract
```

---

## 🛠️ 개발 워크플로우

### 빌드

스마트 컨트랙트 컴파일:

```bash
forge build
```

### 테스트 (TDD 접근법)

포괄적인 테스트 스위트 실행:

```bash
# 모든 테스트 실행
forge test

# 상세 출력으로 실행
forge test -vvv

# 특정 테스트 실행
forge test --match-test testMintBaseCard

# 가스 리포트 생성
forge test --gas-report

# 테스트 커버리지 확인
forge coverage
```

### 포맷팅

Solidity 스타일 가이드에 따라 코드 포맷팅:

```bash
forge fmt
```

### 정적 분석

```bash
# Slither 실행 (설치: pip3 install slither-analyzer)
slither .

# Mythril 실행
myth analyze src/BaseCard.sol
```

---

## 🚀 배포 가이드

### 1단계: 컨트랙트 배포

`CardToken`과 `BaseCard` 컨트랙트 배포:

```bash
make deploy
```

**예상 출력**:

```
🚀 base_sepolia에 컨트랙트 배포 중...
✅ CardToken이 다음 주소에 배포됨: 0x...
✅ BaseCard가 다음 주소에 배포됨: 0x...
✅ 배포 성공!
```

### 2단계: 환경 변수 업데이트

성공적인 배포 후, `.env` 파일을 배포된 주소로 업데이트하세요:

```bash
CARD_TOKEN_ADDRESS=0x...  # 배포 출력에서 주소
BASE_CARD_ADDRESS=0x...   # 배포 출력에서 주소
```

### 3단계: 컨트랙트 검증 (선택사항)

```bash
# Basescan에서 검증
forge verify-contract \
    --chain-id 84532 \
    --num-of-optimizations 200 \
    --constructor-args $(cast abi-encode "constructor(address)" $CARD_TOKEN_ADDRESS) \
    $BASE_CARD_ADDRESS \
    src/BaseCard.sol:BaseCard
```

---

## 🎮 컨트랙트 상호작용

### 배치 민팅 (초기 설정 권장)

제공된 스크립트를 사용하여 템플릿에서 여러 BaseCard 민팅:

```bash
# 1. template.json에 카드 데이터 구성
# 형식은 template.json 참조

# 2. 배치 민팅 스크립트 실행
./mint_from_template.sh

# 3. 민팅된 카드 확인
cat onchain_nft_outputs.json
```

**템플릿 형식** (`template.json`):

```json
[
    {
        "address": "0x...",
        "nickname": "Alice",
        "role": "Developer",
        "bio": "미래를 구축하는 중",
        "image": "ipfs://...",
        "basename": "alice.base.eth",
        "social": {
            "x": "@alice",
            "farcaster": "alice.farcaster.eth"
        }
    }
]
```

### 개별 작업

#### 읽기 함수 (가스 불필요)

```bash
# 토큰 메타데이터 URI 가져오기
make token-uri TOKEN_ID=1

# 주소가 민팅했는지 확인
make check-has-minted ADDRESS=0x...

# 소셜 링크 값 가져오기
make get-social TOKEN_ID=1 KEY="x"

# 소셜 키가 허용되는지 확인
make is-allowed-social-key KEY="x"

# 토큰 소수점 자릿수 가져오기
make get-token-decimals
```

#### 쓰기 함수 (가스 필요)

```bash
# 소셜 계정 연결 (연결로 수익 보상)
make link-social TOKEN_ID=1 KEY="x" VALUE="@yourhandle"

# 프로필 정보 업데이트
make update-nickname TOKEN_ID=1 NICKNAME="새 이름"
make update-bio TOKEN_ID=1 BIO="업데이트된 소개 텍스트"
make update-image-uri TOKEN_ID=1 IMAGE_URI="ipfs://..."
make update-basename TOKEN_ID=1 BASENAME="newname.base.eth"
```

#### 소유자 전용 함수

```bash
# 허용된 소셜 키 관리
make set-allowed-social-key KEY="linkedin" IS_ALLOWED=true
```

---

## 🔒 보안 고려사항

### 구현된 모범 사례

1. **접근 제어**

    - 소유자 전용 함수는 `onlyOwner` 수정자로 보호
    - 주소당 한 번의 민팅 강제

2. **입력 검증**

    - 모든 사용자 입력이 처리 전에 검증됨
    - 소셜 키는 허용 목록에 있어야 함

3. **가스 최적화**

    - revert 문자열 대신 커스텀 에러 사용 (에러당 ~50 가스 절약)
    - 적용 가능한 곳에서 `immutable` 및 `constant` 변수 사용
    - 효율적인 데이터 구조 (배열 대신 매핑)

4. **재진입 보호**

    - 외부 호출 전 상태 변경 (체크-효과-상호작용 패턴)
    - 중요한 섹션에서 외부 호출 없음

5. **테스트**
    - 100% 함수 커버리지
    - 엣지 케이스 테스트
    - 중요한 함수에 대한 퍼즈 테스트

### 감사 체크리스트

-   ✅ OpenZeppelin 컨트랙트 사용
-   ✅ 사용자 제공 주소에 대한 delegatecall 없음
-   ✅ 타임스탬프 의존성 없음
-   ✅ 검증되지 않은 외부 호출 없음
-   ✅ 적절한 이벤트 발생
-   ✅ 모든 관리자 함수에 대한 접근 제어

---

## 📚 추가 자료

-   [Foundry Book](https://book.getfoundry.sh/)
-   [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
-   [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
-   [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

---

## 🤝 기여하기

스마트 컨트랙트에 기여할 때:

1. **TDD 따르기**: 먼저 실패하는 테스트를 작성한 후 구현
2. **보안 우선**: 모든 변경사항의 보안 영향을 고려
3. **가스 효율성**: 가스 비용 최적화
4. **문서화**: NatSpec 주석 사용 (내부 문서는 한국어)
5. **테스트**: 100% 테스트 커버리지 유지

---

**BaseCard 팀이 ❤️로 구축**

## 팀 👬 🇰🇷

-   리더 & UX/UI 디자이너(LuckyJerry): https://base.app/profile/0x41d1f13ea5Ce358559268c8c5D1695D8549ac37B?tab=posts
-   UX/UI 디자이너(Chorang): https://base.app/profile/0x41d1f13ea5Ce358559268c8c5D1695D8549ac37B?tab=posts
-   개발자(Jeongseup): https://base.app/profile/0x1b8902178e313aEC2Dee0e2B707de71E3B85d632?tab=posts
-   개발자(Jihwang):
