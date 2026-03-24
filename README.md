# API Football Dashboard

React와 Vite를 사용하여 개발된 축구 데이터 대시보드입니다. API-Sports의 축구 API를 활용하여 실시간 순위표와 득점 순위를 제공합니다.

## ✨ 주요 기능
- **실시간 순위표 (Standings)**: 프리미어리그, 라리가, 세리에 A, 분데스리가 등 주요 리그의 실시간 순위 확인
- **득점 순위 (Top Scorers)**: 리그별 득점 선수 순위 및 상세 스탯 제공
- **리그 선택**: 탭을 통해 간편하게 리그 전환 가능
- **반응형 디자인**: 다양한 디바이스에 최적화된 UI

## 🛠️ 기술 스택
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Inline Styles (CSS-in-JS 패턴)
- **API**: API-Sports (Football API)

## 🔑 핵심 코드 (Core Logic)

### 1. API 데이터 페칭 및 상태 관리
`useEffect`를 사용하여 탭(순위/득점)이나 리그가 변경될 때마다 데이터를 동적으로 불러옵니다.

```typescript
useEffect(() => {
    const fetchData = async () => {
        // ... (API 키 확인 및 로딩 상태 설정)

        try {
            // 엔드포인트 동적 설정 (순위표 vs 득점순위)
            const endpoint = tab === "standings" ? "standings" : "players/topscorers";
            const url = new URL(`${BASE_URL}/${endpoint}`);
            url.searchParams.append("league", String(leagueId));
            url.searchParams.append("season", "2024");

            const res = await fetch(url.toString(), {
                headers: { "x-apisports-key": API_KEY }
            });

            // ... (에러 처리)
            const json = await res.json();

            if (tab === "standings") {
                const leagueObj = json.response?.[0]?.league;
                if (leagueObj) {
                    // 리그 메타 데이터(로고, 시즌 등) 저장
                    setMeta({
                        name: leagueObj.name,
                        season: `${leagueObj.season}/${leagueObj.season + 1}`,
                        logo: leagueObj.logo
                    });
                    setData(leagueObj.standings?.[0] || []);
                }
            } else {
                setData(json.response || []);
            }
            // ...
        } catch (e: any) {
            // ... (에러 핸들링)
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [tab, leagueId]); // 의존성 배열: 탭이나 리그 ID 변경 시 재실행
```

### 2. 조건부 렌더링을 통한 뷰 전환
`tab` 상태에 따라 순위표 테이블과 득점 순위 테이블을 조건부로 렌더링합니다.

```typescript
{tab === "standings" ? (
    // 순위표 렌더링
    <>
        <thead>...</thead>
        <tbody>
        {data.map((item: any) => (
            <tr key={item.team?.id}>
                {/* 순위, 팀 로고, 승/무/패, 승점 등 표시 */}
                <td>{item.rank}</td>
                <td>{item.team?.name}</td>
                {/* ... */}
                <td>{item.points}</td>
            </tr>
        ))}
        </tbody>
    </>
) : (
    // 득점 순위 렌더링
    <>
        <thead>...</thead>
        <tbody>
        {data.map((p: any, idx: number) => (
            <tr key={p.player?.id || idx}>
                {/* 선수 사진, 이름, 골 수 등 표시 */}
                <td>{p.player?.name}</td>
                <td>{p.statistics?.[0]?.goals?.total || 0}</td>
                {/* ... */}
            </tr>
        ))}
        </tbody>
    </>
)}
```

## 🚀 시작하기

1. **환경 변수 설정**: `.env` 파일에 API 키를 설정합니다.
   ```
   VITE_FOOTBALL_API_KEY=your_api_key
   VITE_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
   ```

2. **의존성 설치 및 실행**:
   ```bash
   pnpm install
   pnpm dev
   ```
