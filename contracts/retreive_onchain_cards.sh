#!/bin/bash

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

if [ -z "$NETWORK" ]; then
    echo "❌ Error: NETWORK not set in .env"
    exit 1
fi

echo "=================================================="
echo "🎴 Fetching All BaseCard NFTs (Token ID 1-5)"
echo "=================================================="
echo "📍 Contract: $BASE_CARD_ADDRESS"
echo "🌐 Network: $NETWORK"
echo ""

START_ID=1
END_ID=5

# 출력 파일 설정
OUTPUT_FILE="onchain_cards_output.json"
TEMP_FILE="temp_nfts.json"

# 기존 파일이 있으면 삭제
rm -f "$OUTPUT_FILE" "$TEMP_FILE"

# JSON 배열 시작
echo "[" > "$OUTPUT_FILE"

# 첫 번째 항목인지 체크 (콤마 추가용)
FIRST_ITEM=true

# 토큰 ID 1~5까지 반복
for TOKEN_ID in $(seq $START_ID $END_ID); do
    echo "=================================================="
    echo "🔍 Token ID: $TOKEN_ID"
    echo "=================================================="
    
    # tokenURI 호출
    RESULT=$(cast call $BASE_CARD_ADDRESS "tokenURI(uint256)(string)" $TOKEN_ID --rpc-url "$NETWORK" 2>&1)
    
    # 에러 체크
    if [ $? -ne 0 ]; then
        echo "❌ Failed to fetch Token ID $TOKEN_ID"
        echo "Error: $RESULT"
        echo ""
        continue
    fi
    
    # Raw tokenURI 출력
    echo "📄 Raw tokenURI:"
    echo "$RESULT"
    echo ""
    
    # Base64 디코드 및 JSON 파싱
    echo "🔓 Decoded JSON:"
    DECODED_JSON=$(echo "$RESULT" | tr -d '"' | sed 's/data:application\/json;base64,//' | base64 -d 2>/dev/null)
    
    if [ -z "$DECODED_JSON" ]; then
        echo "⚠️  Failed to decode/parse JSON for Token ID $TOKEN_ID"
        echo ""
        echo ""
        continue
    fi
    
    # 화면에 출력
    echo "$DECODED_JSON" | python3 -m json.tool 2>/dev/null
    
    # 파일에 저장 (콤마 처리)
    if [ "$FIRST_ITEM" = true ]; then
        echo "  $DECODED_JSON" >> "$OUTPUT_FILE"
        FIRST_ITEM=false
    else
        echo "  ,$DECODED_JSON" >> "$OUTPUT_FILE"
    fi
    
    echo ""
    echo ""
done

# JSON 배열 종료
echo "]" >> "$OUTPUT_FILE"

# JSON 파일 포맷팅 (예쁘게)
if [ -f "$OUTPUT_FILE" ]; then
    python3 -m json.tool "$OUTPUT_FILE" > "$TEMP_FILE" && mv "$TEMP_FILE" "$OUTPUT_FILE"
fi

echo "=================================================="
echo "✅ All NFTs fetched successfully!"
echo "=================================================="
echo "📁 Results saved to: $OUTPUT_FILE"
echo ""

# 파일 내용 미리보기
if [ -f "$OUTPUT_FILE" ]; then
    echo "📄 File preview:"
    head -n 20 "$OUTPUT_FILE"
    echo "..."
fi