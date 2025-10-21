# BaseCard Smart Contract MVP Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BaseCard
 * @author @jeongseup
 * @notice Fully onchain ERC721 Non-Fungible Token Standard implementation based on https://docs.base.org/learn/token-development/nft-guides/simple-onchain-nfts
 * @notice [EN] This contract manages the minting of 'BaseCard' NFTs.
 *         Users can mint one card to receive CARD tokens (Mint-to-Earn)
 *         and can link their social media accounts to earn more tokens (Link-to-Earn).
 * @notice [KR] 'BaseCard' NFT 민팅을 관리하는 컨트랙트입니다.
 *         유저는 카드를 민팅하여 CARD 토큰을 받을 수 있으며(Mint-to-Earn),
 *         소셜 미디어 계정을 연결하여 추가 토큰을 획득할 수 있습니다(Link-to-Earn).
 */
contract BaseCard is ERC721, Ownable {
    // tokenId를 문자열로 변환하기 위해 사용
    using Strings for uint256;

    // =============================================================
    //                          타입 정의
    // =============================================================

    /// @notice [EN] Represents the data for a user's business card.
    /// @notice [KR] 사용자의 비즈니스 명함에 담기는 데이터를 나타내는 구조체입니다.
    struct CardData {
        string nickname;
        // TODO:
        // string role;
        string bio;
        string imageURI; // IPFS URI 권장
        string basename;
    }

    // =============================================================
    //                           상태 변수
    // =============================================================

    uint256 private _nextTokenId = 1;
    mapping(uint256 => CardData) private _cardData;
    mapping(address => bool) public hasMinted;

    /// @notice [EN] A double mapping of [TokenID -> [Social Key -> Social Value]].
    /// @notice [KR] [TokenID -> [소셜 Key -> 소셜 Value]] 형태의 이중 매핑
    mapping(uint256 => mapping(string => string)) private _socials;

    /// @notice [EN] A whitelist managing the keys of social links that can be registered.
    /// @notice [KR] 등록 가능한 소셜 링크의 key들을 관리하는 허용 목록
    mapping(string => bool) private _allowedSocialKeys;

    /// @notice [EN] The address of the CARD token contract used for rewards.
    /// @notice [KR] 보상에 사용되는 CARD 토큰 컨트랙트 주소입니다.
    IERC20 public immutable cardToken;

    // =============================================================
    //                            상수
    // =============================================================

    /// @notice [EN] The number of decimals for the CARD token, used for amount calculations.
    /// @notice [KR] CARD 토큰의 소수점 자릿수. 토큰 양 계산에 사용됩니다.
    uint8 public constant CARD_DECIMALS = 18;

    /// @notice [EN] The amount of CARD tokens a user earns upon minting a BaseCard (10 CARD).
    /// @notice [KR] 유저가 BaseCard를 민팅할 때 얻는 CARD 토큰의 양입니다 (10 CARD).
    uint256 public constant MINT_2_EARN_AMOUNT = 10 * (10 ** CARD_DECIMALS);

    /// @notice [EN] The amount of CARD tokens a user earns for linking their social account (5 CARD).
    /// @notice [KR] 유저가 소셜 계정을 연결할 때 얻는 CARD 토큰의 양입니다 (5 CARD).
    uint256 public constant LINK_2_EARN_AMOUNT = 5 * (10 ** CARD_DECIMALS);

    // =============================================================
    //                             이벤트
    // =============================================================

    /// @notice [EN] Emitted when a user's social account is successfully linked.
    /// @notice [KR] 유저의 소셜 계정이 성공적으로 연결되었을 때 발생하는 이벤트입니다.
    /// @param tokenId The ID of the token.
    /// @param key The key of the social media (e.g., "X").
    /// @param value The user's ID on that social media.
    event SocialLinked(uint256 indexed tokenId, string key, string value);

    // =============================================================
    //                             에러
    // =============================================================

    /// @notice [EN] Thrown when a user who has already minted a card tries to mint again.
    /// @notice [KR] 이미 카드를 민팅한 유저가 다시 민팅을 시도할 때 발생하는 에러입니다.
    error AlreadyMinted();

    /// @notice [EN] Thrown when an action is attempted for a user who does not own a BaseCard NFT.
    /// @notice [KR] BaseCard NFT를 소유하지 않은 유저에 대해 작업을 시도할 때 발생하는 에러입니다.
    error NotNFTOwner();

    /// @notice [EN] Thrown when attempting to link a social media key that is not allowed.
    /// @notice [KR] 허용되지 않은 소셜 미디어 키를 연결하려고 할 때 발생하는 에러입니다.
    error NotAllowedSocialKey();

    /// @notice [EN] Thrown when attempting to deploy the contract with a zero address for the token.
    /// @notice [KR] 토큰 주소로 0번 주소를 사용하여 컨트랙트 배포를 시도할 때 발생하는 에러입니다.
    error InvalidCardTokenAddress();

    /// @notice [EN] Thrown when querying metadata for a non-existent token ID.
    /// @notice [KR] 존재하지 않는 토큰 ID에 대한 메타데이터를 조회할 때 발생하는 에러입니다.
    /// @param tokenId The invalid token ID.
    error InvalidTokenId(uint256 tokenId);

    // =============================================================
    //                           수식어
    // =============================================================

    modifier onlyNFTOwner(uint256 _tokenId) {
        if (ownerOf(_tokenId) != msg.sender) revert NotNFTOwner();
        _;
    }

    // =============================================================
    //                           생성자
    // =============================================================

    /// @notice [EN] Initializes the contract, setting the CARD token address.
    /// @notice [KR] 컨트랙트를 초기화하고 CARD 토큰 주소를 설정합니다.
    /// @param _cardTokenAddress The address of the ERC20 CARD token.
    constructor(
        address _cardTokenAddress
    ) ERC721("BaseCard", "MyBaseCard") Ownable(msg.sender) {
        if (_cardTokenAddress == address(0)) {
            revert InvalidCardTokenAddress();
        }
        cardToken = IERC20(_cardTokenAddress);

        // 초기 허용 목록 설정 (예시)
        _allowedSocialKeys["x"] = true;
        _allowedSocialKeys["farcaster"] = true;
        _allowedSocialKeys["website"] = true;
        _allowedSocialKeys["github"] = true;
        _allowedSocialKeys["luma"] = true;
    }

    // =============================================================
    //                         관리자 함수
    // =============================================================

    /// @notice [KR] [소유자 전용] 소셜 링크 허용 목록을 관리합니다.
    function setAllowedSocialKey(
        string memory _key,
        bool _isAllowed
    ) external onlyOwner {
        _allowedSocialKeys[_key] = _isAllowed;
    }

    // =============================================================
    //                          핵심 로직
    // =============================================================

    /// @notice [EN] Mints a new BaseCard NFT for the caller. The caller receives a `MINT_2_EARN_AMOUNT` of CARD tokens. Reverts if the user has already minted a card.
    /// @notice [KR] 호출자를 위해 새로운 BaseCard NFT를 민팅합니다. 호출자는 `MINT_2_EARN_AMOUNT` 만큼의 CARD 토큰을 받습니다. 유저가 이미 민팅했다면 실행이 취소됩니다.
    function mintBaseCard(CardData memory _initialCardData) external {
        if (hasMinted[msg.sender]) {
            revert AlreadyMinted();
        }
        hasMinted[msg.sender] = true;

        uint256 tokenId = _nextTokenId++;
        _cardData[tokenId] = _initialCardData;
        _safeMint(msg.sender, tokenId);

        // Mint-to-Earn: Reward the user with CARD tokens.
        cardToken.transfer(msg.sender, MINT_2_EARN_AMOUNT);
    }

    /// @notice [EN] [NFT Owner Only] Adds or updates an allowed social link.
    /// @notice [KR] [NFT 소유자 전용] 허용된 소셜 링크를 추가하거나 업데이트합니다.
    /// @param _tokenId The ID of the token.
    /// @param _key The key of the social media (e.g., "X").
    /// @param _value The value to set for that social media.
    function linkSocial(
        uint256 _tokenId,
        string memory _key,
        string memory _value
    ) external onlyNFTOwner(_tokenId) {
        if (!_allowedSocialKeys[_key]) revert NotAllowedSocialKey();

        _socials[_tokenId][_key] = _value;

        // Link-to-Earn: Reward the user with CARD tokens.
        cardToken.transfer(msg.sender, LINK_2_EARN_AMOUNT);

        emit SocialLinked(_tokenId, _key, _value);
    }

    /// @notice [EN] [NFT Owner Only] Update default card information.
    /// @notice [KR] [NFT 소유자 전용] 기본 카드 정보를 업데이트합니다.
    function updateNickname(
        uint256 _tokenId,
        string memory _newNickname
    ) external onlyNFTOwner(_tokenId) {
        _cardData[_tokenId].nickname = _newNickname;
    }

    function updateBio(
        uint256 _tokenId,
        string memory _newBio
    ) external onlyNFTOwner(_tokenId) {
        _cardData[_tokenId].bio = _newBio;
    }

    function updateImageURI(
        uint256 _tokenId,
        string memory _newImageURI
    ) external onlyNFTOwner(_tokenId) {
        _cardData[_tokenId].imageURI = _newImageURI;
    }

    function updateBasename(
        uint256 _tokenId,
        string memory _newBasename
    ) external onlyNFTOwner(_tokenId) {
        _cardData[_tokenId].basename = _newBasename;
    }

    // =============================================================
    //                           조회 함수
    // =============================================================

    /// @notice [EN] Internal function to ensure the token exists and is owned.
    /// @notice [KR] 토큰이 존재하고 소유되었는지 확인하는 내부 함수입니다.
    /// @param _tokenId The ID of the token.
    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        if (_tokenId == 0 || _tokenId >= _nextTokenId) {
            revert InvalidTokenId(_tokenId);
        }
        CardData memory cardData = _cardData[_tokenId];

        // 소셜 링크는 가스 효율을 위해 JSON에 직접 포함하지 않습니다.
        // 프론트엔드에서 getSocial() 함수를 통해 별도로 조회해야 합니다.
        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                cardData.nickname,
                " #",
                _tokenId.toString(),
                '",',
                '"description": "',
                cardData.bio,
                '",',
                '"image": "',
                cardData.imageURI,
                '",',
                '"attributes": [',
                '{"trait_type": "Basename", "value": "',
                cardData.basename,
                '"}'
                "]}"
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(json))
                )
            );
    }

    /// @notice [EN] Retrieves the cardData information for a specific NFT.
    /// @notice [KR] 특정 NFT의 소셜 링크 값을 조회합니다.
    /// @param _tokenId The ID of the token.
    /// @param _key The key of the social media (e.g., "X").
    function getSocial(
        uint256 _tokenId,
        string memory _key
    ) external view returns (string memory) {
        return _socials[_tokenId][_key];
    }

    /// @notice [EN] Checks if a specific social key is allowed.
    /// @notice [KR] 특정 소셜 key가 허용되었는지 확인합니다.
    /// @param _key The key of the social media (e.g., "X").
    /// @return True if the key is allowed, false otherwise.
    function isAllowedSocialKey(
        string memory _key
    ) external view returns (bool) {
        return _allowedSocialKeys[_key];
    }

    /// @notice [EN] Returns the decimals of the associated CARD token. This is useful for off-chain calculations.
    /// @notice [KR] 연동된 CARD 토큰의 소수점 자릿수를 반환합니다. 오프체인 계산에 유용합니다.
    /// @dev [EN] Since `decimals()` is optional in the ERC20 standard, this function uses a low-level staticcall to safely query it. It returns a default of 18 if the call fails or the token contract doesn't have this function.
    /// @dev [KR] ERC20 표준에서 `decimals()`는 선택사항이므로, 이 함수는 low-level staticcall을 사용하여 안전하게 조회합니다. 호출에 실패하거나 토큰 컨트랙트에 해당 함수가 없으면 기본값 18을 반환합니다.
    /// @return The number of decimals for the token.
    function tokenDecimals() external view returns (uint8) {
        (bool success, bytes memory data) = address(cardToken).staticcall(
            abi.encodeWithSignature("decimals()")
        );
        if (success && data.length == 32) {
            return abi.decode(data, (uint8));
        }
        return CARD_DECIMALS; // Fallback to the constant value
    }
}
```
