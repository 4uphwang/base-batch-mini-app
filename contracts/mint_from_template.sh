#!/bin/bash

# template.json 파일을 읽어서 각 주소에 대해 mintBaseCardFor를 호출하는 스크립트

# .env 파일에서 환경 변수 로드
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Error: .env file not found"
    exit 1
fi

# 환경 변수 체크
if [ -z "$BASE_CARD_ADDRESS" ]; then
    echo "❌ Error: BASE_CARD_ADDRESS not set in .env"
    exit 1
fi

if [ -z "$ETH_FROM" ]; then
    echo "❌ Error: ETH_FROM not set in .env"
    exit 1
fi

if [ -z "$NETWORK" ]; then
    echo "❌ Error: NETWORK not set in .env"
    exit 1
fi

TEMPLATE_FILE="template.json"

if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "❌ Error: $TEMPLATE_FILE not found"
    exit 1
fi

echo "=================================================="
echo "🎴 Minting BaseCards from template.json"
echo "=================================================="
echo "📍 Contract: $BASE_CARD_ADDRESS"
echo "🌐 Network: $NETWORK"
echo "📄 Template: $TEMPLATE_FILE"
echo ""

# jq가 설치되어 있는지 확인
if ! command -v jq &> /dev/null; then
    echo "❌ Error: jq is required but not installed"
    echo "Install with: brew install jq"
    exit 1
fi

# template.json의 항목 개수 확인
ITEM_COUNT=$(cat "$TEMPLATE_FILE" | jq 'length')
echo "📊 Total items in template: $ITEM_COUNT"
echo ""

# 각 항목에 대해 민팅 수행
for i in $(seq 0 $(($ITEM_COUNT - 1))); do
    echo "=================================================="
    echo "🔍 Processing item #$(($i + 1))"
    echo "=================================================="
    
    # JSON에서 데이터 추출
    RECIPIENT=$(cat "$TEMPLATE_FILE" | jq -r ".[$i].address")
    NICKNAME=$(cat "$TEMPLATE_FILE" | jq -r ".[$i].nickname")
    ROLE=$(cat "$TEMPLATE_FILE" | jq -r ".[$i].role")
    BIO=$(cat "$TEMPLATE_FILE" | jq -r ".[$i].bio")
    IMAGE_URI=$(cat "$TEMPLATE_FILE" | jq -r ".[$i].image")
    BASENAME=$(cat "$TEMPLATE_FILE" | jq -r ".[$i].basename")
    
    # Social links를 keys와 values 배열로 추출 (순서 유지)
    SOCIAL_KEYS=$(cat "$TEMPLATE_FILE" | jq -c ".[$i].social | to_entries | map(.key)")
    SOCIAL_VALUES=$(cat "$TEMPLATE_FILE" | jq -c ".[$i].social | to_entries | map(.value)")
    
    echo "📧 Recipient: $RECIPIENT"
    echo "👤 Nickname: $NICKNAME"
    echo "💼 Role: $ROLE"
    echo "📝 Bio: $BIO"
    echo "🖼️  Image: $IMAGE_URI"
    echo "🏷️  Basename: $BASENAME"
    echo "🔑  Social Keys: $SOCIAL_KEYS"
    echo "🔑  Social Values: $SOCIAL_VALUES"
    echo ""
    
    # mintBaseCardFor 호출
    echo "⛏️  Minting NFT for $ADDRESS..."
    
    # Cast 명령어 실행
    CARD_DATA_TUPLE="(\"$IMAGE_URI\", \"$NICKNAME\", \"$ROLE\", \"$BIO\", \"$BASENAME\")"
    echo "CARD_DATA_TUPLE: $CARD_DATA_TUPLE"

    #SOCIAL_KEYS: ["x","farcaster"]
    echo "SOCIAL_KEYS: $SOCIAL_KEYS"

    #SOCIAL_VALUES: ["jeongseup","cosmoseup.farcaster.eth"]
    echo "SOCIAL_VALUES: $SOCIAL_VALUES"    
    
    # Execute the cast send command
    cast send "$BASE_CARD_ADDRESS" \
        "mintBaseCardFor(address,(string,string,string,string,string),string[],string[])" \
        "$RECIPIENT" \
        "$CARD_DATA_TUPLE" \
        "${SOCIAL_KEYS}" \
        "${SOCIAL_VALUES}" \
        --rpc-url "$NETWORK" \
        -vvvv

    if [ $? -eq 0 ]; then
        echo "✅ Successfully minted for $ADDRESS"
    else
        echo "❌ Failed to mint for $ADDRESS"
        echo "   This address may have already minted, or there was an error."
    fi
    
    # Rate limiting: 다음 민팅 전에 잠시 대기 (네트워크 부하 방지)
    if [ $i -lt $(($ITEM_COUNT - 1)) ]; then
        echo "⏳ Waiting 3 seconds before next mint..."
        sleep 3
        echo ""
    fi
done

echo "=================================================="
echo "✅ All minting operations completed!"
echo "=================================================="
echo ""
echo "📊 You can now run: ./all_nfts.sh"
echo "   to fetch and verify all minted NFTs"

