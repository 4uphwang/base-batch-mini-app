# BaseCard Smart Contract Function Spec

**MVP를 위한 핵심 3가지 미션:**

1. **BaseCard NFT 민팅 기능 구현 (Base 체인에 배포)**
2. **X(트위터) 계정 연동 및 프로필 정보 표시**
3. **QR 코드를 통한 BaseCard 공유 및 Mint 2 Earn 최소 구현**

어플리케이션 요구사항

- **Mint 2 Earn:** 프로필 카드를 처음 발급받을 때 토큰을 제공합니다.
- **Link 2 Earn:** 새로운 소셜 정보를 연동할 때마다 토큰을 제공합니다.
- **List 2 Earn:** 참여했던 행사 이력을 등록할 때 토큰을 제공합니다. → 백엔드에서 검증 후 제공?
- **Search 2 Earn:** 행사에서 만난 사람들의 프로필을 열람할 때 토큰을 제공합니다. → 백엔드에서 검증 후 제공?
- **DM 2 Earn:** 프로필을 열람한 사람과 실제 커뮤니케이션을 시작할 때 토큰을 제공합니다. → 백엔드에서 검증 후 제공?

스마트컨트랙트 기능

- BaseCard Contract is ERC721 or Dynamic NFT or Other NFT spec
  - variables
    - decimal 6
    - mint2earn amount : 10.000000 CARD
    - social_index_hash(bytes32) : [”X”, “Linkined”, “Github”]
  - associated contract
    - [ERC20] CARD token
  - functions
    - Mint BaseCard : 베이스카드 민트 함수 NFT 발급 후 CARD 토큰을 10개 에어드랍 해준다.
    - LinkSocial : 유저의 nft에 링크된 소셜 정보를 추가한다. 정보 하나당 토큰을 10개를 에어드랍 해준다. 유저 정보는 nft hash로 인덱스 한다.
    - ListingMeetup 유저가 luma 혹은 KBW 같은 행사에 참여했음을 리스팅한다. 리스팅된 행사 하나당 토큰 10개를 에어드랍 해준다. (근데.. 각종 행사를 데이터를 API로 긁어오기는 힘든데 어떻게 가져올지는 의문..)
