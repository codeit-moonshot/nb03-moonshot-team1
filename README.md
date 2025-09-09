# 🌕 Moonshot

## 📌 프로젝트 소개

🌕 **불가능을 가능으로, 프로젝트가 많아도 일정 관리는 완벽하게.**  
**Moonshot**은 팀원들과 함께 프로젝트를 계획하고, 할 일을 정리하고, 댓글로 소통하며 모든 업무를 한눈에 확인할 수 있는 **올인원 프로젝트 일정 관리 서비스**입니다.  
당신의 아이디어가 현실이 되는 그 순간까지 Moonshot이 함께합니다. 🚀

---

## 🗓 프로젝트 개요

- **프로젝트 기간**: 2025.08.18 ~ 2025.09.08
- **목표**: 레이어드 아키텍처 기반의 안정적이고 확장 가능한 프로젝트/일정 관리 백엔드 구축
- **주요 기능**
  - 사용자 인증 (이메일/패스워드, Google OAuth2, 액세스/리프레시 토큰 갱신)
  - 프로젝트 CRUD, 멤버 초대/추가/제외, 멤버 목록
  - 할 일(Task) / 하위 할 일(Subtask) CRUD, 프로젝트별 조회, 검색/필터/정렬
  - 댓글 CRUD
  - **구글 캘린더 연동**
  - 파일 업로드(멀터) 및 이미지 처리(샤프), 정적 경로 제공
  - 이메일 알림(개발/테스트용 SMTP), 배포(Nginx/PM2)

---

## 👥 팀 구성 및 역할

| 담당자                                             | 역할 요약             | 상세 기여                                                                                                                                                                                                                                                   |
| -------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[유진호(리드)](https://github.com/selentia)**    | 리드 / 코어 & 인프라  | 프로젝트 구조/메인 프레임, ESLint/Prettier/tsconfig/alias, 엔트리포인트, DB 최적화, 파일 업로드, Task API(조회/등록/수정/삭제/프로젝트별 조회), 예상 이슈/SDLC 산출물(요구/설계/구현/테스트/배포) 정리, Nginx/도메인/DB 연결, 프론트 연결/디버깅, 시연 영상 |
| **[조영욱(팀장)](https://github.com/youngwookjo)** | 인증/유저/댓글/캘린더 | 회원가입/로그인/토큰 갱신, 내 정보 조회/수정, Google OAuth2, 구글 캘린더 연동, 하위 할 일 마무리, 댓글 CRUD, 유저 참여 프로젝트의 할 일 목록 조회, 발표 자료 준비                                                                                           |
| **[한선재](https://github.com/HSunJ)**             | 프로젝트/멤버/알림    | ERD, 프로젝트 생성/수정/삭제/상세/목록, 멤버 초대/추가/제외, 멤버 목록, 이메일 알림, 중간발표 준비                                                                                                                                                          |

---

## 🛠 기술 스택

| 구분                   | 기술                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| **언어/런타임**        | TypeScript, Node.js(Express)                                                                                  |
| **ORM/DB**             | Prisma, PostgreSQL                                                                                            |
| **보안/안정화**        | helmet, express-rate-limit, CORS 화이트리스트, cookie-parser, 환경변수 분리, 헤더 은닉(`x-powered-by` 비활성) |
| **유효성 검증**        | Zod                                                                                                           |
| **파일 업로드/이미지** | multer, sharp                                                                                                 |
| **암호화/인증**        | bcrypt(+pepper), jsonwebtoken (액세스/리프레시)                                                               |
| **정적 분석**          | ESLint, Prettier                                                                                              |
| **운영/배포**          | Nginx, PM2, cross-env                                                                                         |
| **개발 편의**          | nodemon, ts-node, concurrently                                                                                |

---

## 📂 디렉터리 구조

```
src
├── app.ts         # Express 앱 초기화
├── server.ts      # 서버 실행 엔트리
│
├── config         # 환경변수/DB 설정
├── constants      # 상수 정의
├── crons          # 주기적 작업
├── errors         # 에러 정의
├── libs           # 외부 연동/서비스성 유틸
├── middlewares    # 인증/권한 가드 등
├── modules        # 도메인별 router/controller/service/repository/validator/dto 등
├── prisma         # schema.prisma, seed.ts
├── routes         # API 라우트 모음
├── types          # Express 확장 타입
└── utils          # passwordUtils.ts 등
uploads            # 파일 업로드 루트

```

---

## ⚙️ 실행 방법

### 1) 환경 변수 예시 (`.env.example`)

```
# DATABASE
DATABASE_URL_DEV=postgresql://<user_name>:<password>@localhost:5432/moonshot
DATABASE_URL=postgresql://<user_name>:<password>@localhost:5432/moonshot

# PORT
PORT=3001
FE_PORT=3000

# BASE URL (API 오리진)
BASE_URL_DEV=http://localhost:3001
BASE_URL=https://your.domain.com

# FRONT (프론트엔드 오리진)
FRONT_URL_DEV=http://localhost:3000
FRONT_URL=https://your.domain.com

# FILE URL (정적 업로드 접근용)
FILE_BASE_URL_DEV=http://localhost:3001/api/uploads
FILE_BASE_URL=https://your.domain.com/api/uploads

# RUNTIME
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,https://your.domain.com
ACCESS_TOKEN_SECRET=your_accesstoken_secret
REFRESH_TOKEN_SECRET=your_refreshtoken_secret
INVITATION_TOKEN_SECRET=your_invitationtoken_secret
UPLOAD_ROOT=./uploads
PASSWORD_PEPPER=your_password_pepper

# OAUTH2.0 (메일 송신 테스트용)
MAILSERVICE=gmail,naver
HOSTMAIL=smtp.gmail.com
MAILPORT=YOUR_PORT
SMTP_USER=yourmail.gmail.com
SMTP_PASS=your_pass

# GOOGLE OAUTH
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback

# GOOGLE TOKEN 암호화 (32바이트)
TOKEN_ENCRYPT_KEY=your_32_byte_key
```

### 2) 설치 & 마이그레이션

```bash
npm install
npm run prisma:migrate
npm run prisma:generate
npm run seed      # (필요 시)
```

### 3) 개발 실행

```bash
npm run dev       # BE + FE 동시 실행
# 개별 실행:
# npm run dev:be
# npm run dev:fe
```

### 4) 빌드 & 프로덕션 실행

```bash
npm run build

# PM2로 BE/FE 함께 시작
npm start          # (= start:be && start:fe)

# 또는 명시적으로 실행할 시에는
npm run start:be
npm run start:fe

# 중지
npm run stop
```

---

## 📜 NPM 스크립트

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:be\" \"npm run dev:fe\"",
    "dev:be": "cross-env NODE_ENV=development nodemon --watch src --ext ts --exec \"ts-node -r tsconfig-paths/register src/server.ts\"",
    "dev:fe": "cross-env NODE_ENV=development npm run dev --prefix frontend",

    "prisma:generate": "prisma generate --schema=src/prisma/schema.prisma",
    "prisma:migrate": "prisma migrate dev --schema=src/prisma/schema.prisma",
    "prisma:reset": "prisma migrate reset --schema=src/prisma/schema.prisma",
    "prisma:studio": "prisma studio --schema=src/prisma/schema.prisma",

    "seed": "ts-node -r tsconfig-paths/register src/prisma/seed.ts",

    "lint": "eslint \"src/**/*.ts\"",
    "lint:fix": "eslint \"src/**/*.ts\" --fix",
    "format": "prettier --write .",

    "build": "tsc -p tsconfig.json && tsc-alias -p tsconfig.json",

    "start": "npm run start:be && npm run start:fe",
    "start:be": "cross-env NODE_ENV=production pm2 start dist/server.js --name moonshot-be",
    "start:fe": "cross-env NODE_ENV=production pm2 start npm --name moonshot-fe -- run start --prefix frontend",
    "stop": "pm2 delete moonshot-be || true && pm2 delete moonshot-fe || true",
    "start:all": "npm run start:be && npm run start:fe"
  }
}
```

---

## 🔐 보안 기본 세팅

- **helmet** 적용(CSP 구성은 환경에 맞게)
- **express-rate-limit**로 요청 제한
- **CORS** 화이트리스트 기반 허용
- **cookie-parser**로 쿠키 파싱(필요한 최소 범위)
- `app.disable('x-powered-by')` 헤더 제거
- `app.set('etag', false)`로 ETag 비활성화
- 정적 파일 **MIME 강제 설정**
- 비밀번호 해싱 시 **bcrypt + pepper** 조합
- 인증은 **JWT(Access/Refresh)** 중심

---

## ✅ 진행 결과 하이라이트

- **인프라/배포**: Nginx 구성, DB/도메인 연결, 프론트 연동/디버깅 완료
- **백엔드 API**: 사용자 인증/갱신, Google OAuth2, 프로젝트/멤버, Task/Subtask, 댓글, 캘린더 연동, 파일 업로드/이미지 처리
- **문서/품질**: API 문서/SDLC 산출물 정리, ESLint/Prettier 도입, tsconfig/alias 정비
- **시연/산출물**: 시연 영상 제작(진행), 최종 배포 및 테스트 완료

---

## 📌 링크

- 팀 협업 문서(스프레드시트): https://docs.google.com/spreadsheets/d/13tC83NmPo3fSsDM-hQjSXLD9b4618Wi2pPE-3gbcyK0/edit?usp=sharing
- 최종 발표 자료: https://docs.google.com/presentation/d/1XBmjeN_Pu0jKqN2lfwSPn85UO00dr5x5II3_vhY7D2M/edit
- 시연 영상: https://drive.google.com/file/d/1iWrBdx53sti-sYUyihxmG3t_wJocSovF/view
- 저장소: https://github.com/codeit-moonshot/nb03-moonshot-team1
