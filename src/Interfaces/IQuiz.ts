export default interface IQuestion {
    question: string;
    answers: string [];
    correct: number;
}

export default interface IQuizData {
    questions: IQuestion[];
}



