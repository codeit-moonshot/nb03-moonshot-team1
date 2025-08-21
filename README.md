# 🌕 Moonshot

## 📌 프로젝트 소개

🌕 **불가능을 가능으로, 프로젝트가 많아도 일정 관리는 완벽하게.**
**Moonshot**은 팀원들과 함께 프로젝트를 계획하고, 할 일을 정리하고, 댓글로 소통하며 모든 업무를 한눈에 확인할 수 있는 **올인원 프로젝트 일정 관리 서비스**입니다.
당신의 아이디어가 현실이 되는 그 순간까지 Moonshot이 함께합니다. 🚀

---

## 🗓 프로젝트 개요

- **프로젝트 기간**: 2025.08.18 ~ 2025.09.08
- **목표**: 레이어드 아키텍처 기반의 안정적이고 확장 가능한 프로젝트 관리 백엔드 구축
- **주요 기능**:
  - 사용자 인증 (이메일/소셜 로그인)
  - 프로젝트 생성 및 멤버 초대
  - 할 일(Task) / 하위 할 일(Subtask) 관리
  - 파일 업로드 및 관리
  - 댓글 및 태그 관리
  - 알림/메일 전송
  - DB 트랜잭션 및 최적화

---

## 👥 팀 구성 및 역할

| 담당자                                          | 파트           | 구현 기능(약술)                                                              | 주요 구현 기능                                                                          |
| ----------------------------------------------- | -------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **[리드, 유진호](https://github.com/selentia)** | App Core       | 메인 프레임, 파일 업로드, DB 최적화, 에러 처리, 레이어드 아키텍처, 배포/영상 | ESLint, Prettier, tsconfig, alias, 토큰 기반 인증, 글로벌 에러 핸들링, 프론트/배포 연동 |
| **[조영욱](https://github.com/youngwookjo)**    | 인증/유저/댓글 | 인증, 유저 관리, 댓글 CRUD                                                   | 로그인/회원가입, 개인정보 수정, 댓글 기능                                               |
| **[팀장, 유소망](https://github.com/K-somang)** | 핵심 기능      | 할 일/하위 할 일, 구글 캘린더                                                | Task CRUD, 검색/필터/정렬, 캘린더 연동                                                  |
| **[한선재](https://github.com/HSunJ)**          | 서브 기능      | 멤버 관리, 프로젝트 CRUD, 메일 발송                                          | 프로젝트 초대/추가/제외, 메일 알림                                                      |

---

## 🛠 기술 스택

| 구분            | 기술                                                              |
| --------------- | ----------------------------------------------------------------- |
| **언어/런타임** | TypeScript, Node.js (Express)                                     |
| **ORM/DB**      | Prisma, PostgreSQL                                                |
| **보안**        | helmet, csurf, express-session, cookie-parser, express-rate-limit |
| **유효성 검증** | Zod                                                               |
| **파일 업로드** | multer                                                            |
| **암호화/인증** | bcrypt, jsonwebtoken                                              |
| **정적 분석**   | ESLint, Prettier                                                  |
| **운영/배포**   | Nginx, PM2, cross-env                                             |
| **개발 편의**   | nodemon, ts-node, concurrently                                    |

---

## 📂 디렉터리 구조

```
src
├── app.ts # Express 앱 초기화
├── server.ts # 서버 실행 엔트리
├── config/ # 환경변수/DB 설정
├── errors/ # ApiError, 에러 핸들러
├── middlewares/ # 인증/권한 가드, CSRF, 로깅 등
├── modules/ # 도메인별 router, controller, service, repo
├── prisma/ # schema.prisma, seed.ts
├── routes/ # index.ts, API 라우트 모음
├── types/ # 타입 정의 (Express 확장, DTO 등)
├── utils/ # asyncHandler, pagination, 상수 등
└── uploads/ # 파일 업로드 루트
```

---

## ⚙️ 실행 방법

### 1. 환경 변수

.env 예시:

```
# Database

DATABASE_URL=postgresql://<user>:<password>@localhost:5432/moonshot

# Server

PORT=3000
FE_PORT=3001
BASE_URL_DEV=http://localhost
BASE_URL=https://your.domain.com

# Auth / Session

SESSION_SECRET=your_secret_key
JWT_SECRET=your_jwt_secret

# CORS

CORS_ORIGINS=http://localhost:3001,https://your.domain.com

# Upload

UPLOAD_ROOT=./uploads
```

### 2. 설치 및 마이그레이션

```
npm install
npm run prisma:migrate
npm run prisma:generate
npm run seed # (시드 데이터 필요 시)
```

### 3. 개발 실행

```
npm run dev # BE + FE 동시 실행
```

### 4. 빌드 & 프로덕션 실행

```
npm run build
npm start

# 또는 PM2 운영

npm run start:all
```

---

## 🔐 보안 기본 세팅

- helmet 적용 (CSP 포함)
- httpOnly, secure, sameSite 쿠키
- express-session + cookie-parser 기반 세션
- express-rate-limit 요청 제한
- CORS 화이트리스트 기반 허용
- 정적 파일 MIME 강제 설정
- app.disable('x-powered-by'), app.set('etag', false)

---

## 📜 스크립트

```
"scripts": {
  "dev": "concurrently \\"npm run dev:be\\" \\"npm run dev:fe\\"",
  "dev:be": "cross-env NODE_ENV=development nodemon --watch src --exec \\"ts-node -r tsconfig-paths/register src/server.ts\\"",
  "dev:fe": "cross-env NODE_ENV=development npm run dev --prefix frontend",

  "prisma:generate": "prisma generate --schema=src/prisma/schema.prisma",
  "prisma:migrate": "prisma migrate dev --schema=src/prisma/schema.prisma",
  "prisma:reset": "prisma migrate reset --schema=src/prisma/schema.prisma",
  "prisma:studio": "prisma studio --schema=src/prisma/schema.prisma",

  "seed": "ts-node -r tsconfig-paths/register src/prisma/seed.ts",

  "lint": "eslint \\"src/**/*.ts\\"",
  "lint:fix": "eslint \\"src/**/*.ts\\" --fix",
  "format": "prettier --write .",

  "build": "tsc -p tsconfig.json && tsc-alias -p tsconfig.json",
  "start": "node dist/server.js",
  "start:be": "cross-env NODE_ENV=production pm2 start dist/server.js --name moonshot-be",
  "start:fe": "cross-env NODE_ENV=production pm2 start npm --name moonshot-fe -- run start --prefix frontend",
  "start:all": "npm run start:be && npm run start:fe"
}
```

---

## 📌 링크

- 팀 협업 문서: https://docs.google.com/spreadsheets/d/13tC83NmPo3fSsDM-hQjSXLD9b4618Wi2pPE-3gbcyK0/edit?usp=sharing
- 최종 발표 자료: 기재 예정
