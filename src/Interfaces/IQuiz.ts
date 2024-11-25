export default interface IQuestion {
    question: string;
    options: string [];
    correctAnswer: number;
}

export default interface IQuizData {
    questions: IQuestion[];
}



