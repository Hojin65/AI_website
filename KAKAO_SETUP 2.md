# 카카오 지도 API 설정 가이드

## 개요
Google Maps API 대신 카카오 지도 API를 사용하도록 여행 플래너를 업데이트했습니다. 카카오 API는 한국 지역에 특화되어 있어 국내 여행 서비스에 더 적합합니다.

## 카카오 개발자 계정 생성 및 API 키 발급

### 1. 카카오 개발자 센터 가입
1. [카카오 개발자 센터](https://developers.kakao.com/)에 접속
2. 카카오 계정으로 로그인
3. 개발자 등록 완료

### 2. 애플리케이션 생성
1. "내 애플리케이션" 메뉴 선택
2. "애플리케이션 추가하기" 클릭
3. 앱 이름: `AI Travel Planner` (또는 원하는 이름)
4. 사업자명: 개인 또는 회사명
5. 애플리케이션 생성 완료

### 3. API 키 확인
생성된 애플리케이션에서 다음 키들을 확인:
- **JavaScript 키**: 웹 브라우저에서 사용 (지도 표시용)
- **REST API 키**: 서버에서 사용 (장소 검색용)

### 4. 플랫폼 등록
1. "플랫폼" 탭 선택
2. "Web 플랫폼 등록" 클릭
3. 사이트 도메인 등록:
   - 개발 환경: `http://localhost:3000`
   - 배포 환경: 실제 도메인 주소

## 환경 변수 설정

### 1. .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용 추가:

```env
# Kakao Maps API Key
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_javascript_key_here
NEXT_PUBLIC_KAKAO_REST_API_KEY=your_rest_api_key_here
```

### 2. API 키 입력
발급받은 키를 해당 변수에 입력:
- `NEXT_PUBLIC_KAKAO_MAP_API_KEY`: JavaScript 키
- `NEXT_PUBLIC_KAKAO_REST_API_KEY`: REST API 키

## 기능별 사용

### 1. 지도 표시
- **컴포넌트**: `KakaoMap`
- **사용처**: 여행 결과 페이지
- **기능**: 여행 경로 및 관광지 시각화

### 2. 장소 검색
- **컴포넌트**: `PlaceSearch`
- **사용처**: 여행지 선택, 숙소 위치 검색
- **기능**: 실시간 장소 검색 및 자동완성

### 3. 좌표 검색
- **함수**: `getCoordinatesByAddress`
- **기능**: 주소를 좌표로 변환

### 4. 경로 최적화
- **함수**: `optimizeRoute`
- **기능**: 여행지 간 최적 경로 계산

## 보안 주의사항

### 1. API 키 보호
- REST API 키는 서버에서만 사용
- JavaScript 키는 도메인 제한 설정 권장

### 2. 도메인 제한
카카오 개발자 센터에서 허용 도메인 설정:
- 개발: `localhost:3000`
- 배포: 실제 도메인

### 3. 사용량 모니터링
- 카카오 개발자 센터에서 API 사용량 확인
- 무료 할당량 초과 시 과금 발생 가능

## 문제 해결

### 1. 지도가 표시되지 않는 경우
- API 키 확인
- 도메인 등록 확인
- 브라우저 콘솔 에러 메시지 확인

### 2. 장소 검색이 안 되는 경우
- REST API 키 확인
- CORS 설정 확인
- 네트워크 요청 상태 확인

### 3. 일일 할당량 초과
- 카카오 개발자 센터에서 사용량 확인
- 필요시 유료 플랜 검토

## 추가 기능

### 1. 교통 정보
```javascript
// 대중교통 경로 검색
const getPublicTransitRoute = async (start, end) => {
  // 카카오 모빌리티 API 활용
}
```

### 2. 주변 정보
```javascript
// 주변 맛집, 관광지 검색
const getNearbyPlaces = async (lat, lng, category) => {
  // 카테고리별 장소 검색
}
```

### 3. 실시간 교통
```javascript
// 실시간 교통 정보
const getTrafficInfo = async (route) => {
  // 교통 상황 정보 제공
}
```

## 참고 자료
- [카카오 지도 API 문서](https://apis.map.kakao.com/)
- [카카오 로컬 API 문서](https://developers.kakao.com/docs/latest/ko/local/dev-guide)
- [카카오 개발자 가이드](https://developers.kakao.com/docs)

## 지원
API 관련 문의: [카카오 개발자 포럼](https://devtalk.kakao.com/) 