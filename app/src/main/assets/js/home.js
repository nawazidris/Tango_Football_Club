document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const fetchFile = (path) => window.AppConfig?.fetchAsset
            ? window.AppConfig.fetchAsset(path)
            : fetch(path);

        const [logRes, playersRes, matchesRes, historyRes] = await Promise.all([
            fetchFile('data/log.json'),
            fetchFile('data/players.json'),
            fetchFile('data/matches.json'),
            fetchFile('data/club-history.json')
        ]);

        const log = await logRes.json();
        const players = await playersRes.json();
        const matches = await matchesRes.json();
        const history = await historyRes.json();

        updateStats(log, players, matches, history);
        displayFeaturedMatch(matches);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function updateStats(log, players, matches, history) {
    const teamName = "Tango FC";
    const teamRow = log.rows.find(row => row[1] === teamName);

    if (teamRow) {
        // Hero Stats
        document.getElementById('hero-played').textContent = teamRow[2]; // P
        document.getElementById('hero-points').textContent = teamRow[9]; // Pts
        document.getElementById('hero-pos').textContent = teamRow[0] + (teamRow[0] === '1' ? 'st' : teamRow[0] === '2' ? 'nd' : teamRow[0] === '3' ? 'rd' : 'th');

    // Goals Scored from players.json (as requested)
    const totalGoals = players.reduce((sum, p) => sum + (p.stats.goals || 0), 0);
    document.getElementById('quick-goals').textContent = totalGoals;

    // Clean Sheets from players.json (sum of individual player clean sheets) or matches
    const playerCleanSheets = players.reduce((sum, p) => sum + (p.stats.cleanSheets || 0), 0);
    // If player clean sheets exist, use them, otherwise use match calculation
    document.getElementById('quick-cleansheets').textContent = playerCleanSheets > 0 ? playerCleanSheets : cleanSheets;

    // Titles Won from history
    const titles = history.achievements ? history.achievements.filter(a => a.title.toLowerCase().includes('champion') || a.title.toLowerCase().includes('winner')).length : 10;
    document.getElementById('quick-titles').textContent = titles;
}

function displayFeaturedMatch(matches) {
    const container = document.getElementById('match-highlight');
    if (!container) return;

    // Find next upcoming match or last completed match
    const upcoming = matches.find(m => m.status === 'upcoming');
    const lastCompleted = [...matches].reverse().find(m => m.status === 'completed');

    const match = upcoming || lastCompleted;
    if (!match) return;

    const isUpcoming = match.status === 'upcoming';

    container.innerHTML = `
        <div class="match-card featured">
            <div class="match-header">${isUpcoming ? 'Next Match' : 'Recent Result'}</div>
            <div class="match-body">
                <div class="team">
                    <span class="team-name">${match.homeTeam}</span>
                </div>
                <div class="score">
                    ${isUpcoming ? `<span>VS</span>` : `<span>${match.homeScore} - ${match.awayScore}</span>`}
                </div>
                <div class="team">
                    <span class="team-name">${match.awayTeam}</span>
                </div>
            </div>
            <div class="match-info">
                <span><i class="far fa-calendar"></i> ${match.date}</span>
                <span><i class="far fa-clock"></i> ${match.time}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${match.venue}</span>
            </div>
        </div>
    `;
}
