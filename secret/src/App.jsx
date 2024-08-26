import { useCallback, useEffect, useState } from "react";

// components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

// styles
import "./App.css";

// data
import { wordsList } from "./data/words";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  console.log(words);

  const pickWordAndCategory = useCallback(() => {
    // escolha uma categoria aleatória
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // escolha uma palavra aleatória
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    console.log(category, word);

    return { category, word };
  }, [words]);

  // comece o jogo
  const startGame = useCallback(() => {
    // limpar todas as letras
    clearLettersStates();

    // escolha uma palavra
    const { category, word } = pickWordAndCategory();

    console.log(category, word);

    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // console.log(category, word);

    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // entrada de carta de processo
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // verifica se a carta já foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // empurra a letra adivinhada ou remove uma chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  console.log(wrongLetters);

  // reinicie o jogo
  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  };

  //limpa o input das letras
  const clearLettersStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //verifique se os palpites terminaram
  useEffect(() => {
    if (guesses === 0) {
      // o jogo termina e reinicia todos os estados
      clearLettersStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // verifique a condição de vitória
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    console.log(uniqueLetters);
    console.log(guessedLetters);

    // condição de vitória
    if (guessedLetters.length === uniqueLetters.length) {
      // adicionar pontuação
      setScore((actualScore) => (actualScore += 100));

      // reinicia o jogo com uma nova palavra
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;