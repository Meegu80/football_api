import React, { useState, useEffect } from "react";

// --- 환경 변수 로드 (Vite 기준) ---
const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;
const BASE_URL = import.meta.env.VITE_FOOTBALL_BASE_URL;

const COLORS = {
    primary: "#1a1a1a",
    accent: "#0057ff",
    border: "#ebebeb",
    bg: "#f4f7f9",
    card: "#ffffff",
    gold: "#b45309",
    win: "#2ecc71",
    loss: "#e74c3c",
};

export default function FootballFinalStableDash() {
    const [tab, setTab] = useState("standings");
    const [leagueId, setLeagueId] = useState(39);
    const [data, setData] = useState<any[]>([]);
    // --- 시즌 및 리그 정보를 저장할 상태 추가 ---
    const [meta, setMeta] = useState({ name: "", season: "", logo: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const leagues = [
        { id: 39, name: "Premier League" },
        { id: 140, name: "La Liga" },
        { id: 135, name: "Serie A" },
        { id: 78, name: "Bundesliga" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!API_KEY || !BASE_URL) {
                setError(".env 파일에 VITE_FOOTBALL_API_KEY와 VITE_FOOTBALL_BASE_URL을 설정해주세요.");
                return;
            }

            setLoading(true);
            setError(null);
            setData([]);

            try {
                const endpoint = tab === "standings" ? "standings" : "players/topscorers";
                const url = new URL(`${BASE_URL}/${endpoint}`);
                url.searchParams.append("league", String(leagueId));
                url.searchParams.append("season", "2024");

                const res = await fetch(url.toString(), {
                    headers: { "x-apisports-key": API_KEY }
                });

                if (!res.ok) throw new Error(`API Error: ${res.status}`);
                const json = await res.json();

                if (tab === "standings") {
                    const leagueObj = json.response?.[0]?.league;
                    if (leagueObj) {
                        // 시즌 정보를 "2024/2025" 형식으로 가공하여 저장
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

                if (!json.response || json.response.length === 0) {
                    setError("데이터를 찾을 수 없습니다.");
                }
            } catch (e: any) {
                setError(e.message || "데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tab, leagueId]);

    return (
        <div style={{ backgroundColor: COLORS.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: COLORS.primary }}>
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .container { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }
                .info-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid ${COLORS.border}; margin-bottom: 20px; display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                .table-card { background: white; border-radius: 12px; border: 1px solid ${COLORS.border}; overflow-x: auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                table { width: 100%; border-collapse: collapse; min-width: 700px; }
                th { background: #fafafa; padding: 14px; font-size: 11px; color: #6b7280; text-transform: uppercase; border-bottom: 2px solid ${COLORS.border}; letter-spacing: 0.05em; }
                td { padding: 16px; border-bottom: 1px solid ${COLORS.border}; font-size: 14px; vertical-align: middle; }
                .active-tab { background: ${COLORS.accent} !important; color: white !important; }
                .btn-base { padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: 0.2s; font-weight: 700; border: none; font-size: 13px; }
            `}</style>

            {/* --- Header --- */}
            <nav style={{ background: COLORS.primary, padding: "15px 0", color: "white", position: "sticky", top: 0, zIndex: 10 }}>
                <div className="container" style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontWeight: 900, fontSize: "20px", letterSpacing: "-0.5px" }}>PRO<span style={{ color: COLORS.accent }}>FOOTBALL</span></h2>
                    <div style={{ display: "flex", gap: "8px", background: "#2a2a2a", padding: "4px", borderRadius: "8px" }}>
                        <button onClick={() => setTab("standings")} className={`btn-base ${tab === "standings" ? "active-tab" : ""}`} style={{ background: "transparent", color: "#888" }}>순위표</button>
                        <button onClick={() => setTab("topscorers")} className={`btn-base ${tab === "topscorers" ? "active-tab" : ""}`} style={{ background: "transparent", color: "#888" }}>득점 순위</button>
                    </div>
                </div>
            </nav>

            <div className="container">
                {error && <div style={{ padding: "20px", background: "#fff1f0", border: "1px solid #ffa39e", color: "#cf1322", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>⚠️ {error}</div>}

                {/* --- 1. 추가된 시즌 정보 섹션 --- */}
                {!loading && meta.name && (
                    <div className="info-card">
                        <img src={meta.logo} width="45" height="45" alt="league logo" style={{ objectFit: "contain" }} />
                        <div>
                            <h3 style={{ fontSize: "20px", fontWeight: 800, lineHeight: 1.2 }}>{meta.name}</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                                <span style={{ backgroundColor: "#eef2ff", color: COLORS.accent, padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 700 }}>
                                    SEASON {meta.season}
                                </span>
                                <span style={{ color: "#999", fontSize: "12px" }}>Official Data</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- League Select --- */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "25px", overflowX: "auto", paddingBottom: "5px" }}>
                    {leagues.map(l => (
                        <button key={l.id} onClick={() => setLeagueId(l.id)} style={{
                            padding: "8px 18px", borderRadius: "20px", border: "1px solid",
                            borderColor: leagueId === l.id ? COLORS.accent : COLORS.border,
                            background: leagueId === l.id ? COLORS.accent : "white",
                            color: leagueId === l.id ? "white" : "#666",
                            fontWeight: 700, fontSize: "13px", cursor: "pointer"
                        }}>
                            {l.name}
                        </button>
                    ))}
                </div>

                {/* --- Main Data Table --- */}
                <div className="table-card">
                    {loading ? (
                        <div style={{ padding: "100px", textAlign: "center", color: "#999", fontWeight: 500 }}>데이터를 실시간 동기화 중입니다...</div>
                    ) : (
                        <table>
                            {tab === "standings" ? (
                                <>
                                    <thead>
                                    <tr>
                                        <th style={{ textAlign: "center", width: "70px" }}>Rank</th>
                                        <th style={{ textAlign: "left" }}>Team</th>
                                        <th>PL</th>
                                        <th>W</th>
                                        <th>D</th>
                                        <th>L</th>
                                        <th>GD</th>
                                        <th style={{ background: "#f0f4ff", color: COLORS.accent }}>PTS</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data.map((item: any) => (
                                        <tr key={item.team?.id}>
                                            <td style={{ textAlign: "center", fontWeight: 800 }}>{item.rank}</td>
                                            <td style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <img src={item.team?.logo} width="28" height="28" alt="" />
                                                <span style={{ fontWeight: 700 }}>{item.team?.name}</span>
                                            </td>
                                            <td style={{ textAlign: "center" }}>{item.all?.played}</td>
                                            <td style={{ textAlign: "center" }}>{item.all?.win}</td>
                                            <td style={{ textAlign: "center" }}>{item.all?.draw}</td>
                                            <td style={{ textAlign: "center" }}>{item.all?.lose}</td>
                                            <td style={{ textAlign: "center", fontWeight: 600, color: item.goalsDiff >= 0 ? COLORS.win : COLORS.loss }}>
                                                {item.goalsDiff > 0 ? `+${item.goalsDiff}` : item.goalsDiff}
                                            </td>
                                            <td style={{ textAlign: "center", fontWeight: 900, color: COLORS.accent, background: "#f8faff", fontSize: "16px" }}>{item.points}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </>
                            ) : (
                                <>
                                    <thead>
                                    <tr>
                                        <th style={{ textAlign: "center", width: "70px" }}>#</th>
                                        <th style={{ textAlign: "left" }}>Player</th>
                                        <th style={{ textAlign: "left" }}>Team</th>
                                        <th>App</th>
                                        <th>Ast</th>
                                        <th style={{ background: "#fffbeb", color: COLORS.gold }}>Goals</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data.map((p: any, idx: number) => (
                                        <tr key={p.player?.id || idx}>
                                            <td style={{ textAlign: "center", fontWeight: 800, color: idx < 3 ? COLORS.gold : "#999" }}>{idx + 1}</td>
                                            <td style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <img src={p.player?.photo} width="38" height="38" style={{ borderRadius: "50%", border: `1px solid ${COLORS.border}` }} alt="" />
                                                <div>
                                                    <div style={{ fontWeight: 700 }}>{p.player?.name}</div>
                                                    <div style={{ fontSize: "11px", color: "#999" }}>{p.player?.nationality}</div>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 600, color: "#555" }}>{p.statistics?.[0]?.team?.name || "-"}</td>
                                            <td style={{ textAlign: "center" }}>{p.statistics?.[0]?.games?.appearances || 0}</td>
                                            <td style={{ textAlign: "center" }}>{p.statistics?.[0]?.goals?.assists ?? 0}</td>
                                            <td style={{ textAlign: "center", fontWeight: 900, fontSize: "18px", color: COLORS.gold, background: "#fffdf5" }}>
                                                {p.statistics?.[0]?.goals?.total || 0}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </>
                            )}
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}