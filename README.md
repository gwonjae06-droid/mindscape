# MINDSCAPE — 경험으로 배우는 심리학

심리학 개념을 **읽고 → 작은 체험을 해보고 → 이해도를 확인하는** 정적 학습 사이트입니다.

**사이트:** https://gwonjae06-droid.github.io/mindscape/

## 학습 주제

| 주제 | 핵심 개념 | 짧은 학습 활동 |
| --- | --- | --- |
| 주의 · 스트룹 효과 | 자동적인 단어 읽기와 색 판단의 간섭 | **6문항** 글자색 고르기 (일치 3, 불일치 3) |
| 기억 · 작업기억 | 현재 필요한 정보를 잠시 유지하고 활용하기 | 다섯 자리 숫자를 **4초** 기억하고 입력하기 |
| 사고 · 확증편향 | 기존 믿음을 지지하는 증거에 치우치기 | 근거 4개 중 균형 잡힌 검증 자료 2개 선택 |
| 선택 · 프레이밍 효과 | 표현 방식이 판단에 미칠 수 있는 영향 | 같은 비율을 다른 문장으로 설명하는 사례 비교 |

각 학습 주제에는 **핵심 개념**, **일상 사례**, **미니 체험**, **객관식 이해도 확인**, **출처 링크**가 있습니다.

## 구현 방식

- 단일 HTML 파일: HTML, CSS, JavaScript. 설치나 빌드 도구 불필요
- 작은 화면 및 키보드 접근성 고려
- 학습 완료 여부만 브라우저 localStorage에 저장
- 체험 응답과 숫자 기록은 서버로 전송하지 않음
- 색 체험의 개인 반응시간은 참고용으로만 표시하며 **능력·건강 진단을 하지 않음**
- 작업기억 활동은 한 번의 기억 결과로 능력을 평가하지 않음

## 검증 방법

1. 첫 화면에 **4개의 주제 카드**가 보이는지 확인합니다.
2. 첫 주제의 **6문항**을 모두 답한 뒤 간단한 피드백이 나오는지 확인합니다.
3. 두 번째 주제에서 숫자가 **4초** 나타난 뒤 입력 화면으로 바뀌는지 확인합니다.
4. 세 번째 주제에서 자료 **2개 선택/선택 해제**와 설명이 작동하는지 확인합니다.
5. 네 번째 주제에서 동일 비율 문장에 대한 확인이 작동하는지 확인합니다.
6. 각 주제의 객관식 질문에 정답을 선택하면 **학습 완료**가 누적되는지 확인합니다.
7. 포트폴리오 돌아가기 링크와 모바일 레이아웃을 확인합니다.

## 참고 자료

- [American Psychological Association — Stroop effect](https://www.apa.org/science/resources/stroop.aspx)
- [University of Queensland — Attention, interference and control](https://qbi.uq.edu.au/node/6060)
- [National Institute of Mental Health — Working Memory](https://www.nimh.nih.gov/research/research-funded-by-nimh/rdoc/constructs/working-memory)
- [Noba — Memory: Encoding, Storage, Retrieval](https://nobaproject.com/modules/memory-encoding-storage-retrieval)
- [National Institute of Standards and Technology — Confirmation bias](https://www.nist.gov/glossary-term/36676)
- [APA Dictionary — Framing](https://dictionary.apa.org/framing)
- [Tversky & Kahneman, 1981 — The Framing of Decisions and the Psychology of Choice](https://stanford.edu/class/psych205/papers/Tversky-Kahneman-1981.pdf)

**주의:** 모든 활동은 비진단적 교육 시연입니다. 개인의 짧은 응답 결과는 심리학 연구 결과를 검증하거나 능력을 측정하기에 충분하지 않습니다.
