import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_FOOTBALL_BASE_URL,
    headers: { 'x-apisports-key': import.meta.env.VITE_FOOTBALL_API_KEY }
});

export const getFootballData = async (tab: string, leagueId: number) => {
    const endpoint = tab === "standings" ? "/standings" : "/players/topscorers";
    const { data } = await api.get(endpoint, { params: { league: leagueId, season: "2024" } });

    if (tab === "standings") {
        const league = data.response?.[0]?.league;
        return {
            meta: { name: league.name, season: `${league.season}/${league.season+1}`, logo: league.logo },
            list: league.standings?.[0] || []
        };
    }
    return { list: data.response || [] };
};