import './style.css'
import IQuestion from './Interfaces/IQuiz';

const BASE_URL = "https://vz-wd-24-01.github.io/typescript-quiz/questions"


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
    const questionContainer = document.getElementById('questionContainer') as HTMLDivElement; 
    questionContainer.innerHTML = question.question;
    const answersContainer = document.getElementById('answersContainer') as HTMLDivElement; 
    answersContainer.innerHTML = ''; 
    
    question.answers.forEach((option, index) => {
        const button = document.createElement('button'); 
        button.textContent = option;
        button.onclick = () => {
            if (confirm("Mit dem Absenden dieser Antwort ist eine Korrektur nicht mehr möglich. Sind sie sicher?")){
                checkAnswer(index, question.correct);
            }
        }
        answersContainer.appendChild(button)
    })
    updateQuestionCount();
}

function updateQuestionCount(): void {
    const questionCountDisplay= document.getElementById('questionCount') as HTMLElement;
    questionCountDisplay.textContent = `Fragen beantwortet: ${currentQuestionIndex} von ${quizData.length}`
}

function checkAnswer(selectedIndex: number, correctIndex: number): void {
    if (selectedIndex === correctIndex) {
        score ++; 
        alert('richtige Antwort');
    } else {
        alert('falsche Antwort');
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        displayQuestions(quizData[currentQuestionIndex])
    } else {
        showResult();
    }
}

function showResult(): void {
    const resultSection = document.getElementById('results') as HTMLElement; 
    resultSection.style.display = 'block';
    const scoreDisplay = document.getElementById('score') as HTMLElement;
    scoreDisplay.textContent = `Ihr Punktestand: ${score} von ${quizData.length}`
}

document.getElementById('resetQuiz')?.addEventListener('click', () => {
    currentQuestionIndex = 0; 
    score = 0; 
    quizData = []; 
    
    document.getElementById('results')!.style.display = 'none'; 
    document.getElementById('questionCount')!.textContent = ''; 
    document.getElementById('answersContainer')!.innerHTML = '';  
    
    alert("Das Quiz wurde zurückgesetzt."); 
 });










