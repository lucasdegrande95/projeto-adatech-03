const readlineSync = require('readline-sync');

class WordBank {
    constructor() {
        this.words = { crocodilo: 'hábitos semiaquáticos ', golfinho: 'animal aquático', coruja: 'hábitos noturnos', bode: 'pode ter chifres' };
    }

    getRandomWord() {
        const keys = Object.keys(this.words);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const word = keys[randomIndex];
        const hint = this.words[word];
        return { word, hint };
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    increaseScore() {
        this.score += 100;
    }
}

class Match {
    constructor(player, word, hint) {
        this.player = player;
        this.word = word;
        this.hint = hint;
        this.guesses = new Set();
        this.attemptsLeft = Match.maxAttemps;
    }

    displayWord() {
        return this.word.split('').map(letter => (this.guesses.has(letter) ? letter : '_')).join(' ');
    }

    makeGuess(guess) {
        guess = guess.toLowerCase();
        this.guesses.add(guess);
        if (!this.word.includes(guess)) {
            this.attemptsLeft--;
        }
        return this.word.includes(guess);
    }
    isWordGuessed() {
        return this.word.split('').every(letter => this.guesses.has(letter));
    }

    isGameOver() {
        return this.attemptsLeft === 0 || this.isWordGuessed();
    }
    static maxAttemps = 6;

}

class GameController {
    constructor() {
        this.wordBank = new WordBank();
        this.player = null;
        this.match = null;
    }

    startGame() {
        const playerName = readlineSync.question('Digite o seu nome: ');
        this.player = new Player(playerName);
        this.newMatch();
        console.log(`Bem vindo(a) ao jogo da Forca ${this.player.name}`);
    }

    newMatch() {
        const { word, hint } = this.wordBank.getRandomWord();
        this.match = new Match(this.player, word, hint);
    }

    displayGameStatus() {
        console.log(`\nPalavra: ${this.match.displayWord()}\nDica: ${this.match.hint}\nLetras já adicionadas: ${[...this.match.guesses].join(', ')} \nTentativas:${this.match.attemptsLeft}\nPontuação: ${this.player.score}`);
    }

    play() {
        this.startGame();

        while (true) {
            this.displayGameStatus();
            const guess = readlineSync.question('Digite uma letra ou adivinhe a palavra: ');

            if (guess.length === 1 && guess.match(/[a-z]/i)) {
                if (this.match.makeGuess(guess)) {
                    console.log('Letra correta!');
                    if (this.match.isWordGuessed()) {
                        console.log(`Parabéns, ${this.player.name}! Você acertou a palavra: ${this.match.word}`);
                        this.player.increaseScore();
                        this.newMatch();
                    }
                } else {
                    console.log('Letra errada. Tente novamente.');
                }
            } else if (guess.length > 1) {
                if (guess.toLowerCase() === this.match.word) {
                    console.log(`Parabéns, ${this.player.name}! Você acertou a palavra: ${this.match.word}`);
                    this.player.increaseScore();
                    this.newMatch();
                } else {
                    console.log('Palavra incorreta. Tente novamente.');
                }
            } else {
                console.log('Entrada inválida. Digite uma letra ou a palavra inteira.');
            }
            if (this.match.isGameOver()) {
                console.log('Fim de jogo!');
                const restart = readlineSync.keyInYNStrict('Deseja jogar novamente?');
                if (restart) {
                    this.newMatch();
                } else {
                    process.exit()
                }
            }
        }
    }
}

const gameController = new GameController();
gameController.play();