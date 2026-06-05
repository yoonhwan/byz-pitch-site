# Tech Guide 프레임워크 결정 기록

> **Smith Condition 3**: Tech Guide 프레임워크는 Astro 검토 결과를 남긴 뒤 최종 확정
> **작성일**: 2026-06-05 | Mouse (frontend_coder)

---

## Astro 검토

### Astro 적합성 평가

| 기준 | Astro | Plain HTML |
|------|-------|-----------|
| 빌드 도구 필요 | ✅ Node + npm build 필요 | ❌ 불필요 |
| 파일 기반 라우팅 | ✅ 6페이지 → 6개 .astro 파일 | ❌ 수동 링크 |
| 콘텐츠 관리 | ✅ Markdown + frontmatter | ❌ HTML 직접 편집 |
| 번들 최적화 | ✅ 자동 CSS/JS 최적화 | ❌ 수동 |
| 배포 복잡도 | ⚠️ 빌드 → dist/ 배포 | ✅ 즉시 서빙 |
| MVP 속도 | ⚠️ 초기 셋업 비용 | ✅ 즉시 시작 |
| 콘텐츠 안정성 | ⚠️ 아직 콘텐츠 미확정 | ✅ 유연한 수정 |

### 검토 결론

**이번 MVP에서는 Astro 미사용 → Plain HTML/CSS 선택**

**근거:**
1. **콘텐츠 미확정 상태**: Content Readiness Gate G-1(비즈니스 SSOT) 미통과로 콘텐츠 잦은 변경 예상 → 빌드 파이프라인 오버헤드 불합리
2. **빠른 반복 필요**: 현재 MVP 단계에서는 즉시 확인 가능한 단일 HTML이 효율적
3. **6페이지 스코프**: 6페이지는 Astro의 파일 기반 라우팅 장점이 충분히 발휘될 규모가 아님
4. **팀 컨텍스트**: byz-pitch 프로젝트에 Node.js 빌드 인프라 미구성

### Astro 전환 조건 (미래)

콘텐츠가 안정화되고 아래 조건을 만족할 때 Astro 전환 검토:
- G-1 통과 (비즈니스 SSOT 확보)
- 페이지 수 10개+ 확장 시
- Markdown 기반 콘텐츠 관리 필요 시

---

## 최종 결정

**Plain HTML/CSS** — 단일 파일, 앵커 기반 6섹션 구조

- `index.html`: 6개 `<section>` (각 섹션 = 1 page)
- `assets/css/guide.css`: 네비게이션 + 컨텐츠 스타일
- L3 anchor heading: 각 섹션 내 `<h3 id="...">` + 사이드바 목차 링크
