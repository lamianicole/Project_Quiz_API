import './style.css'
import IQuestion from './Interfaces/IQuiz';
import IQuizData from './Interfaces/IQuiz';

const BASE_URL = "https://vz-wd-24-01.github.io/typescript-quiz/questions"
const LANGUAGES = ['de', 'en'];
const DIFFICULTY = ['easy', 'hard'];

function buildQuizURL(language: string, difficulty: string): string {
  let finalDifficulty: string;

  if (language === 'de') {
      if (difficulty === 'easy') {
          finalDifficulty = 'leicht';
      } else if (difficulty === 'hard') {
          finalDifficulty = 'schwer';
      } else {
          throw new Error('Ungültiger Schwierigkeitsgrad');
      }
  } else if (language === 'en') {
      finalDifficulty = difficulty;
  } else {
      throw new Error('Ungültige Sprache');
  }

  return `${BASE_URL}/${finalDifficulty}.json`;
}









