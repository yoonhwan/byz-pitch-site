# BYZ-Agents Verified Facts

> **SSOT**: content/shared/facts.md
> **용도**: Claim Registry — 모든 정량적 주장의 검증 상태 추적
> **관리 규칙**: [VERIFIED]만 투자자 자료·scrollytelling·brochure에 숫자형 강조 허용
> **최초 작성**: 2026-06-05 | bead: byz-pitch-realtime-review-001

---

## Claim Registry

| ID | Claim | Status | 사용 가능 채널 |
|----|-------|--------|--------------|
| CLM-001 | "0.5초 이내 통역 완료" | [UNVERIFIED] | tech-guide(내부 참고) |
| CLM-002 | "최대 50명 동시 참여" | [UNVERIFIED] | tech-guide(내부 참고) |
| CLM-003 | "N개 언어 지원" | [UNVERIFIED] | tech-guide(내부 참고) |
| CLM-004 | "Gateway-Redis-Worker 3-Tier 분산 구조" | [VERIFIED] | 전체 채널 |
| CLM-005 | "Pulse Consumer 기반 LangGraph 상태 머신 파이프라인" | [VERIFIED] | 전체 채널 |
| CLM-006 | "Python 3.11, FastAPI, LangGraph, Redis 7.0+, Next.js 15, React 19, TypeScript" | [VERIFIED] | 전체 채널 |

---

## 상세 클레임 정의

### CLM-001: 실시간 통역 지연시간
- **claim**: "0.5초 이내 통역 완료"
- **status**: [UNVERIFIED]
- **source**: docs/context/01-byz-realtime-architecture.md §3.1 (정성적 언급)
- **evidence**: 벤치마크 미실시
- **channels**: [tech-guide]
- **blocked**: [scrollytelling, brochure, investor-pitch]
- **action**: 실측 벤치마크 필요 (Link E2E 또는 수동 측정)
- **last_updated**: 2026-06-05

### CLM-002: 동시 참여자 수
- **claim**: "최대 50명 동시 참여"
- **status**: [UNVERIFIED]
- **source**: docs/context/01-byz-realtime-architecture.md §7 (설계 목표)
- **evidence**: 부하 테스트 미실시
- **channels**: [tech-guide]
- **blocked**: [scrollytelling, brochure, investor-pitch]
- **action**: 부하 테스트 또는 설계 스펙 명시 (soft claim으로 전환 가능)
- **last_updated**: 2026-06-05

### CLM-003: 지원 언어 수
- **claim**: "N개 언어 지원"
- **status**: [UNVERIFIED]
- **source**: STT/TTS 프로파일에서 열거 가능하나 정확 수치 미집계
- **evidence**: 없음
- **channels**: [tech-guide]
- **blocked**: [scrollytelling, brochure, investor-pitch]
- **action**: STT provider별 지원 언어 목록 집계 (Google STT, Whisper 등 확인)
- **last_updated**: 2026-06-05

### CLM-004: 3-Tier 분산 아키텍처
- **claim**: "Gateway-Redis-Worker 3-Tier 분산 구조"
- **status**: [VERIFIED]
- **source**: docs/context/01-byz-realtime-architecture.md §1.1-1.2
- **evidence**: 소스 코드 디렉토리 구조 일치 (gateway/, worker/, shared/), README 아키텍처 다이어그램 일치
- **channels**: [tech-guide, scrollytelling, brochure, investor-pitch]
- **blocked**: []
- **last_updated**: 2026-06-05

### CLM-005: STT→번역→TTS 파이프라인
- **claim**: "Pulse Consumer 기반 LangGraph 상태 머신 파이프라인"
- **status**: [VERIFIED]
- **source**: docs/context/01-byz-realtime-architecture.md §3
- **evidence**: worker/infrastructure/consumers/pulse_consumer.py 존재, LangGraph build_pulse_graph 구현 확인
- **channels**: [tech-guide, scrollytelling, brochure, investor-pitch]
- **blocked**: []
- **last_updated**: 2026-06-05

### CLM-006: 기술 스택
- **claim**: "Python 3.11, FastAPI, LangGraph, Redis 7.0+, Next.js 15, React 19, TypeScript"
- **status**: [VERIFIED]
- **source**: docs/context/01-byz-realtime-architecture.md §2
- **evidence**: pyproject.toml, package.json 확인 가능; 아키텍처 문서 §2 표 일치
- **channels**: [tech-guide, scrollytelling, brochure, investor-pitch]
- **blocked**: []
- **last_updated**: 2026-06-05

---

## 검증 상태 정의

| 상태 | 의미 | 사용 가능 채널 |
|------|------|--------------|
| `[VERIFIED]` | 소스 코드/문서/벤치마크로 검증됨 | 모든 채널 |
| `[SOFT_CLAIM]` | 설계 목표 또는 이론적 수치. "최대 ~N" 등 한정 표현 사용 | tech-guide(한정표현 필수), scrollytelling(한정표현 필수) |
| `[UNVERIFIED]` | 검증 미완료 | tech-guide만 (내부 참고용, 수치 노출 금지) |
| `[REJECTED]` | 검증 결과 부정확 판명 | 사용 금지 |

---

## 사용 규칙

1. **투자자 자료(scrollytelling, brochure)에는 `[VERIFIED]` claim만 숫자형 강조 허용**
2. `[SOFT_CLAIM]`은 "~약 N", "최대 N" 등 한정 표현과 함께만 사용
3. `[UNVERIFIED]` 수치는 화면에 노출하지 않음 (내부 개발 참고용)
4. 새로운 정량적 주장 발견 시 반드시 facts.md에 등록 후 검증 프로세스 진행
5. Claim 검증: Link E2E 또는 Tank 유닛 테스트 → Smith evidence 리뷰 → [VERIFIED] 승인

---

## Content Readiness Gate 상태

| Gate | 조건 | 상태 |
|------|------|------|
| G-1 | 비즈니스 SSOT 문서 (`docs/context/02-byz-business-plan.md`) | ❌ 미확보 |
| G-2 | Claim Registry [VERIFIED] 태그 3개 이상 | ✅ (CLM-004, 005, 006) |
| G-3 | 브랜드/카피 전략 확정 | ❌ 미확정 |
| G-4 | Track A scrollytelling 완성 + Smith DA 승인 | ⏳ 진행 중 |

> **Track B 착수**: G-1~G-4 모두 충족 시. 현재 G-1, G-3 미통과 → Track A만 진행
