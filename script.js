const categoryTranslations = {
    'All': 'הכל',
    'Mahjong Games': 'משחקי מהג׳ונג',
    'Bubble Shooter': 'יורה בועות',
    'Hidden Object Games': 'משחקי חפצים מוסתרים',
    '2048 & Merge': '2048 ומיזוג',
    'Klondike': 'קלונדייק',
    'Sorting Games': 'משחקי מיון',
    'Match 3 Games': 'משחקי התאמת 3',
    'Shooting & War': 'יריות ומלחמה',
    'Maze Games': 'משחקי מבוך',
    'Mahjong Solitaire': 'מהג׳ונג סוליטר',
    'Connect 3': 'חיבור 3',
    'Pyramid': 'פירמידה',
    'Solitaire Games': 'משחקי סוליטר',
    'Puzzle Games': 'משחקי פאזל',
    'Mahjong Slide': 'מהג׳ונג החלקה',
    'Brain Games': 'משחקי מוח',
    'Skill': 'מיומנות',
    'Freecell': 'פריסל',
    'Arkanoid': 'ארקנויד',
    'Collapse Games': 'משחקי קריסה',
    'Daily Puzzles': 'פאזלים יומיים',
    'Mahjong Connect': 'מהג׳ונג חיבור',
    'Tripeaks & Golf': 'שלושת הפסגות וגולף',
    'Bejeweled': 'בג׳ולד',
    'Card Games': 'משחקי קלפים',
    'Puzzles': 'פאזלים',
    'Hidden Clues': 'רמזים מוסתרים',
    'Montana': 'מונטנה',
    'Zuma Games': 'משחקי זומה',
    '3D Mahjong': 'מהג׳ונג תלת-ממד',
    'Pinball': 'פינבול',
    'Memory': 'זיכרון',
    'Tetris': 'טטריס',
    'Spider': 'עכביש',
    'Board': 'משחקי לוח',
    'Word Games': 'משחקי מילים',
    'Racing': 'מרוצים',
    'Tower Defense': 'הגנת מגדל',
    'Difference Games': 'משחקי הבדלים',
    'Math Games': 'משחקי מתמטיקה',
    'Sports': 'ספורט',
    'Retro': 'רטרו',
    'Billiards': 'ביליארד',
    'Golf': 'גולף',
    'Time management': 'ניהול זמן',
    'Hidden Alphabet': 'אלפבית מוסתר',
    'Crosswords': 'תשבצים',
    'Platform': 'פלטפורמה',
    'Sudoku': 'סודוקו',
    'Mahjong Tower': 'מגדל מהג׳ונג',
    'Snake': 'נחש',
    'Hidden Numbers': 'מספרים מוסתרים',
    'Pac Maze': 'מבוך פאק-מן'
};

const translationDictionary = {
    'מהג׳ונג': 'mahjong',
    'פאזל': 'puzzle',
    'קלפים': 'cards',
    'זיכרון': 'memory',
    'מילים': 'words',
    'חשיבה': 'thinking',
    'אסטרטגיה': 'strategy',
    'פעולה': 'action',
    'הרפתקאות': 'adventure',
    'ספורט': 'sports',
    'מרוצים': 'racing',
    'יריות': 'shooting',
    // הוסף עוד תרגומים לפי הצורך
};

document.addEventListener('DOMContentLoaded', function() {
    const featuredGamesContainer = document.getElementById('featured-games');
    const allGamesContainer = document.getElementById('all-games-grid');
    const categoryFilter = document.querySelector('.category-filter');
    const modal = document.getElementById('game-modal');
    const closeBtn = document.querySelector('.close');
    const gameFrame = document.getElementById('game-frame');
    const loadingIndicator = document.getElementById('loading-indicator');
    const nightModeBtn = document.getElementById('night-mode-btn');
    const gameTitle = document.getElementById('game-title');
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    // Add this line to define sectionTitle
    const sectionTitle = document.querySelector('#all-games h2');

    let games = [];
    let categories = ['הכל'];
    let currentPage = 1;
    const gamesPerPage = 20;

    loadingIndicator.style.display = 'flex';

    // Load games from local JSON file
    fetch('games.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Invalid data format received');
            }
            games = data;
            loadingIndicator.style.display = 'none';
            initializeGames();
        })
        .catch(error => {
            console.error('Error loading games:', error);
            loadingIndicator.style.display = 'none';
            if (allGamesContainer) {
                allGamesContainer.textContent = `Error loading games: ${error.message}. Please try again later.`;
            }
        });

    function translateCategory(category) {
        return categoryTranslations[category] || category;
    }

    function initializeGames() {
        if (games.length === 0) {
            if (allGamesContainer) {
                allGamesContainer.textContent = 'אין משחקים זמינים כרגע.';
            }
            return;
        }

        games.forEach(game => {
            const translatedCategory = translateCategory(game.category);
            if (!categories.includes(translatedCategory)) {
                categories.push(translatedCategory);
            }
            game.translatedCategory = translatedCategory;
        });

        createCategoryFilter();
        addFeaturedGames();
        showAllGames();
        initializeInfiniteScrolling();
    }

    function createCategoryFilter() {
        categoryFilter.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = category;
            button.dataset.category = category;
            categoryFilter.appendChild(button);
        });

        categoryFilter.querySelector('[data-category="הכל"]').classList.add('active');
    }

    function addFeaturedGames() {
        featuredGamesContainer.innerHTML = '';
        const featuredGames = games.slice(0, 5);
        featuredGames.forEach(game => {
            const gameCard = createGameCard(game);
            gameCard.classList.add('featured-game-card');
            featuredGamesContainer.appendChild(gameCard);
        });
    }

    function createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.category = game.translatedCategory;
        card.innerHTML = `
            <img src="${game.thumb4}" alt="${game.name}" onerror="this.src='placeholder.png'">
            <h3>${game.name}</h3>
            <div class="game-category">${game.translatedCategory}</div>
            <div class="game-rating">${getRandomRating()}</div>
        `;
        card.addEventListener('click', () => openGame(game));
        return card;
    }

    function getRandomRating() {
        const rating = Math.floor(Math.random() * 5) + 1;
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    function openGame(game) {
        if (game.url) {
            gameFrame.innerHTML = `<iframe src="${game.url}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
            gameTitle.textContent = game.name;
            modal.style.display = 'block';
        } else {
            console.error('Game URL is missing');
            alert('Sorry, unable to load the game.');
        }
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none';
        gameFrame.innerHTML = '';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            gameFrame.innerHTML = '';
        }
    }

    categoryFilter.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-btn')) {
            const category = e.target.dataset.category;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            allGamesContainer.innerHTML = '';
            currentPage = 1;

            const filteredGames = category === 'הכל' ? games : games.filter(game => game.translatedCategory === category);
            const initialGames = filteredGames.slice(0, gamesPerPage);

            initialGames.forEach(game => {
                allGamesContainer.appendChild(createGameCard(game));
            });

            if (sectionTitle) {
                sectionTitle.textContent = category === 'הכל' ? 'כל המשחקים' : `משחקי ${category}`;
            }
        }
    });

    function searchGames() {
        let searchTerm = searchInput.value.trim().toLowerCase();
        let searchTerms = [searchTerm];

        // בדוק אם המילה קיימת במילון התרגומים
        if (translationDictionary[searchTerm]) {
            searchTerms.push(translationDictionary[searchTerm]);
        } else {
            // אם לא מצאנו תרגום מדויק, נחפש תרגומים חלקיים
            for (let [hebrewWord, englishWord] of Object.entries(translationDictionary)) {
                if (searchTerm.includes(hebrewWord)) {
                    searchTerms.push(englishWord);
                }
            }
        }

        allGamesContainer.innerHTML = ''; // נקה את המיכל
        currentPage = 1; // אפס את מספר העמוד

        const filteredGames = games.filter(game =>
            searchTerms.some(term =>
                game.name.toLowerCase().includes(term) ||
                game.category.toLowerCase().includes(term)
            )
        );
        const initialGames = filteredGames.slice(0, gamesPerPage);

        initialGames.forEach(game => {
            allGamesContainer.appendChild(createGameCard(game));
        });

        if (sectionTitle) {
            sectionTitle.textContent = `תוצאות חיפוש: "${searchInput.value}"`;
        }

        console.log(`Searching for terms: ${searchTerms.join(', ')}`);
    }

    if (searchButton) {
        searchButton.addEventListener('click', searchGames);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchGames();
            }
        });
    }

    function loadMoreGames() {
        const startIndex = currentPage * gamesPerPage;
        const endIndex = startIndex + gamesPerPage;
        const nextGames = games.slice(startIndex, endIndex);

        nextGames.forEach(game => {
            allGamesContainer.appendChild(createGameCard(game));
        });

        currentPage++;
    }

    function initializeInfiniteScrolling() {
        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                loadMoreGames();
            }
        });
    }

    function showAllGames() {
        if (allGamesContainer) {
            allGamesContainer.innerHTML = '';
            const initialGames = games.slice(0, gamesPerPage);
            initialGames.forEach(game => {
                allGamesContainer.appendChild(createGameCard(game));
            });
        }
        if (sectionTitle) {
            sectionTitle.textContent = 'כל המשחקים';
        }
        currentPage = 1;
    }

    if (nightModeBtn) {
        nightModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('night-mode');
            const icon = nightModeBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
        });
    }
});
