# LoL 티어 체크 - 배포 가이드

구글시트 없이, 이 프로젝트 자체에 백엔드(API + 데이터베이스)가 다 들어있습니다.
Vercel에 올리면 그대로 작동합니다. 로그인 없이 누구나 링크로 참여 가능합니다.

## 배포 순서

1. GitHub에 새 저장소를 만들고 이 폴더 전체(index.html, api/data.js, package.json)를 업로드합니다.
2. https://vercel.com 에 가입 후 "Add New... > Project"에서 방금 만든 GitHub 저장소를 선택합니다.
3. Framework Preset은 "Other"로 두고 그대로 Deploy를 누릅니다. (별도 빌드 설정 필요 없음)
4. 배포가 끝나면 Vercel 프로젝트 대시보드에서 상단 "Storage" 탭으로 이동합니다.
5. "Create Database" > "KV (Key-Value)" 선택 후 아무 이름이나 넣고 생성합니다.
6. 생성된 KV 데이터베이스를 방금 만든 프로젝트에 "Connect Project"로 연결합니다.
   (이 과정에서 필요한 환경변수(KV_REST_API_URL 등)가 프로젝트에 자동으로 추가됩니다.)
7. 프로젝트 대시보드 > Deployments 탭에서 "Redeploy"를 한 번 눌러줍니다.
   (KV를 연결한 뒤에는 재배포해야 환경변수가 적용됩니다.)
8. 배포된 주소(예: https://your-project.vercel.app)를 12명에게 공유하면 끝입니다.

## 확인 방법

- 사이트 접속 시 바로 "익명 평가 결과" 화면이 뜨면 정상입니다 (아직 데이터 없으면 "아직 제출된 평가가 없어요" 메시지).
- 이름 선택 → 11명 평가 → 제출 → "제출 완료" 배너가 뜨면 정상 저장된 것입니다.
- 문제가 있으면 브라우저에서 F12(또는 모바일 개발자도구) 콘솔 오류를 확인해주세요.

## 파일 구성

- `index.html` : 프론트엔드 전체 (피라미드 결과 화면 포함)
- `api/data.js` : 서버리스 API (GET=결과 조회, POST=평가 제출), Vercel KV에 데이터 저장
- `package.json` : `@vercel/kv` 패키지 의존성
