import './style.css'
import IQuestion from './Interfaces/IQuiz';

const BASE_URL = "https://vz-wd-24-01.github.io/typescript-quiz/questions";

document.getElementById('language')?.addEventListener('change', checkSelections);
document.getElementById('difficulty')?.addEventListener('change', checkSelections);

function checkSelections(): void {
    const languageSelect = document.getElementById('language') as HTMLSelectElement; 
    const difficultySelect = document.getElementById('difficulty') as HTMLSelectElement;
    const startButton = document.getElementById('startQuiz') as HTMLButtonElement;

    startButton.disabled = !(languageSelect.value && difficultySelect.value);
}
checkSelections();


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

async function fetchQuizData(url: string): Promise<IQuestion[]> {
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`)
        }
        const data: IQuestion[] = await response.json(); 
        console.log('Abgerufene Daten', data);

        return data
        
    } catch (error) {
        console.error('Error fetching quiz data', error);        
        throw error;
    }
}

let currentQuestionIndex = 0; 
let score = 0; 
let quizData: IQuestion[] = [];
let quizEnd = false; 
let correctAnswers = 0; 
let incorrectAnswers = 0; 


document.getElementById('startQuiz')?.addEventListener('click', async () =>
{
    const languageSelect = document.getElementById('language') as HTMLSelectElement; 
    const difficultySelect = document.getElementById('difficulty') as HTMLSelectElement; 

    const selectedLanguage = languageSelect.value; 
    const selectedDifficulty = difficultySelect.value;

    const quizUrl = buildQuizURL(selectedLanguage, selectedDifficulty);
    console.log(`Quiz URL:`, quizUrl);
    

    try {
        const fetchedData = await fetchQuizData(quizUrl);
        quizData = fetchedData; 
        console.log('Abgerufene Fragen', quizData);

        if (quizData.length > 0) {
            displayQuestions(quizData[currentQuestionIndex]);
            document.getElementById('resetQuiz')!.style.display = 'block';
        }

    } catch (error) {
        alert('Es gab ein Problem beim Laden der Quizdaten.')
        
    }
})

function displayQuestions(question: IQuestion): void {
    if (quizEnd) return
    const questionContainer = document.getElementById('questionContainer') as HTMLDivElement;
    questionContainer.classList.add('question-block');
    questionContainer.innerHTML = `<p>${question.question}</p>`;
    const answersContainer = document.getElementById('answersContainer') as HTMLDivElement; 
    answersContainer.innerHTML = ''; 
    
    question.answers.forEach((option, index) => {
        const button = document.createElement('button'); 
        button.textContent = option;
        button.onclick = () => checkAnswer(index, question.correct);
        answersContainer.appendChild(button)
    })
    updateQuestionCount();
}

function updateQuestionCount(): void {
    const questionCountDisplay= document.getElementById('questionCount') as HTMLElement;
    questionCountDisplay.innerHTML = `Fragen beantwortet: ${currentQuestionIndex} von ${quizData.length}
    Richtige Antworten: ${correctAnswers} | Falsche Antworten: ${incorrectAnswers}`;
}

function displayMessage(message: string): void {
    const messageSection = document.getElementById('message') as HTMLElement;
    const messageText = document.getElementById('messageText') as HTMLElement;
    messageText.textContent = message; 
    messageSection.style.display = 'block';
}

function hideMessage(): void {
    const messageSection = document.getElementById('message') as HTMLElement; 
    messageSection.style.display = 'none';
}

function checkAnswer(selectedIndex: number, correctIndex: number): void {
    if (quizEnd) return;
    if (selectedIndex === correctIndex) {
        score ++; 
        correctAnswers++;
        displayMessage('Richtige Antwort!');
    } else {
        incorrectAnswers++;
        displayMessage('Falsche Antwort');
    }

    currentQuestionIndex++;
    updateQuestionCount();

    if (currentQuestionIndex < quizData.length) {
        setTimeout(() => {
            hideMessage();
            displayQuestions(quizData[currentQuestionIndex])
        }, 500)
    } else {
        setTimeout(() => {
            hideMessage();
            showResult(); 
        }, 500)
        showResult();
    }
}

function showResult(): void {
    quizEnd = true;
    const resultSection = document.getElementById('results') as HTMLElement; 
    resultSection.style.display = 'block';
    const scoreDisplay = document.getElementById('score') as HTMLElement;
    scoreDisplay.textContent = `Ihr Punktestand: ${score} von ${quizData.length}`
    displayMessage("Das Quiz ist nun beendet");
}

document.getElementById('resetQuiz')?.addEventListener('click', () => {
    currentQuestionIndex = 0; 
    score = 0; 
    correctAnswers = 0;
    incorrectAnswers = 0; 
    quizData = []; 
    quizEnd = false;
    
    document.getElementById('results')!.style.display = 'none'; 
    document.getElementById('questionCount')!.textContent = ''; 
    document.getElementById('answersContainer')!.innerHTML = '';
    document.getElementById('questionContainer')!.innerHTML = ''; 
    

    hideMessage();
    
 });










