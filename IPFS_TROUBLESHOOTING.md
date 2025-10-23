# IPFS 업로드 실패 문제 해결 가이드

## 🔍 문제 진단

### 1단계: 콘솔 로그 확인
브라우저 개발자 도구 (F12) → Console 탭에서 다음을 확인:

```
✅ 정상:
  ✅ Card generated successfully
  📦 IPFS Upload result: { id: "...", cid: "...", url: "..." }
  ✅ IPFS Upload successful

❌ 실패:
  ✅ Card generated successfully
  📦 IPFS Upload result: undefined
  ❌ Card generated but IPFS upload failed
```

### 2단계: 서버 로그 확인
터미널에서 Next.js 개발 서버 로그를 확인:

```bash
# 정상적인 경우
POST /api/generate 200 in XXms
✅ SVG uploaded to IPFS: QmXXX at https://ipfs.io/ipfs/QmXXX

# 실패하는 경우
POST /api/generate 200 in XXms
❌ IPFS upload error: [에러 메시지]
```

## 🐛 가능한 원인

### 1️⃣ 환경 변수 누락 또는 잘못된 설정

**증상:**
```
❌ IPFS upload error: PINATA_JWT environment variable is required
❌ IPFS upload error: PINATA_GROUP environment variable is required
```

**해결:**
```bash
# .env.local 파일 확인
cat .env.local | grep PINATA

# 필요한 환경 변수:
PINATA_JWT=eyJhbGc...
PINATA_GATEWAY=your-gateway.mypinata.cloud
PINATA_GROUP=your-group-id
```

**체크리스트:**
- [ ] `.env.local` 파일이 존재하는가?
- [ ] `PINATA_JWT`가 설정되어 있는가?
- [ ] `PINATA_GROUP`이 설정되어 있는가?
- [ ] 개발 서버를 재시작했는가? (`yarn dev` 다시 실행)

### 2️⃣ Pinata API 키 만료 또는 권한 부족

**증상:**
```
❌ IPFS upload error: Unauthorized
❌ IPFS upload error: Invalid JWT
❌ IPFS upload error: 401
```

**해결:**
1. https://app.pinata.cloud/developers/api-keys 접속
2. 새 API 키 생성 (Admin 권한)
3. `.env.local` 파일 업데이트
4. 개발 서버 재시작

### 3️⃣ Pinata Group ID 잘못됨

**증상:**
```
❌ IPFS upload error: Group not found
❌ IPFS upload error: 404
```

**해결:**
1. https://app.pinata.cloud/ 접속
2. Groups 메뉴에서 그룹 생성 또는 확인
3. 그룹 ID 복사
4. `.env.local`에 `PINATA_GROUP=그룹ID` 설정

### 4️⃣ 네트워크 오류 (Pinata API 접근 불가)

**증상:**
```
❌ IPFS upload error: fetch failed
❌ IPFS upload error: Network error
❌ IPFS upload error: ECONNREFUSED
```

**해결:**
- 인터넷 연결 확인
- VPN 사용 중이면 비활성화 시도
- Pinata 서비스 상태 확인: https://status.pinata.cloud

### 5️⃣ File API 문제 (서버 사이드)

**증상:**
```
❌ IPFS upload error: File is not a constructor
❌ IPFS upload error: Blob is not defined
```

**해결:**
이미 코드에 구현되어 있습니다. Node.js 버전 확인:
```bash
node --version  # v18 이상 필요
```

### 6️⃣ 기본 이미지 fetch 실패

**증상:**
```
❌ Card generation error: Failed to fetch
```

**원인:** 사용자가 이미지를 업로드하지 않았을 때 `/assets/default-profile.png`를 fetch하는 과정에서 실패

**해결:**
기본 이미지 파일 확인:
```bash
ls -la public/assets/default-profile.png
```

파일이 없다면:
```bash
# 기본 이미지 추가 또는 로직 수정 필요
```

## 🔧 디버깅 단계

### 1단계: 환경 변수 확인
```bash
# .env.local 파일 내용 확인 (민감정보 주의)
cat .env.local

# 필수 항목:
# PINATA_JWT=...
# PINATA_GATEWAY=...
# PINATA_GROUP=...
```

### 2단계: Pinata API 수동 테스트
```bash
# Pinata API 테스트
curl -X GET "https://api.pinata.cloud/data/testAuthentication" \
  -H "Authorization: Bearer YOUR_PINATA_JWT"

# 성공 시:
# {"message":"Congratulations! You are communicating with the Pinata API!"}
```

### 3단계: 개발 서버 재시작
```bash
# 서버 중지 (Ctrl+C)
# 다시 시작
yarn dev
```

### 4단계: 브라우저 캐시 클리어
- 개발자 도구 → Network 탭 → "Disable cache" 체크
- 또는 하드 리프레시: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

### 5단계: 로그 상세 확인
코드에 이미 추가된 디버그 로그 확인:
```javascript
console.log("📦 IPFS Upload result:", result.ipfs);
console.error("🔍 Full result:", result);
```

## 🚀 해결 체크리스트

- [ ] `.env.local` 파일 존재 확인
- [ ] `PINATA_JWT` 환경 변수 설정
- [ ] `PINATA_GROUP` 환경 변수 설정  
- [ ] `PINATA_GATEWAY` 환경 변수 설정
- [ ] Pinata API 키가 유효한지 확인
- [ ] 개발 서버 재시작
- [ ] 브라우저 콘솔에서 에러 메시지 확인
- [ ] 서버 터미널에서 에러 로그 확인
- [ ] `/assets/default-profile.png` 파일 존재 확인
- [ ] 인터넷 연결 확인

## 💡 빠른 테스트

가장 간단한 테스트:
```bash
# 1. 환경 변수 확인
echo $PINATA_JWT

# 2. 서버 재시작
yarn dev

# 3. 브라우저에서 민트 페이지 접속
# 4. 콘솔 열고 카드 생성 시도
# 5. 에러 메시지 확인
```

## 📞 추가 도움

문제가 계속되면:
1. 브라우저 콘솔의 전체 에러 로그 복사
2. 서버 터미널의 에러 로그 복사
3. `.env.local` 파일 구조 확인 (값은 숨기고)
4. 위 정보를 가지고 디버깅

