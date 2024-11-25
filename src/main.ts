import './style.css'
import IQuestion from './Interfaces/IQuiz';
import IQuizData from './Interfaces/IQuiz';

const BASE_URL = "https://vz-wd-24-01.github.io/typescript-quiz/questions"
const LANGUAGES = ['de', 'en'];
const DIFFICULTY = ['easy', 'hard'];


function buildQuizURL(language: typeof LANGUAGES[number], difficulty: typeof DIFFICULTY[number]): string {
  if (language === 'de') {
      difficulty = difficulty === 'easy' ? 'leicht' : 'schwer';
  }
  return `${BASE_URL}/${difficulty}.json`;
}
console.log(buildQuizURL('en', 'easy'));
console.log(buildQuizURL('de', 'hard'));







