document.addEventListener('DOMContentLoaded', () => {
    const categoryList = document.getElementById('categories');
    const quizSection = document.getElementById('quiz-section');
    const questionElement = document.getElementById('question');
    const optionsList = document.getElementById('options');
    const nextButton = document.getElementById('next-btn');
    const resultSection = document.getElementById('result-section');
    const scoreElement = document.getElementById('score');
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];

    // Fetch and display categories
    fetch('/api/categories')
        .then(res => res.json())
        .then(categories => {
            categories.forEach(category => {
                const li = document.createElement('li');
                li.textContent = category.name;
                li.dataset.id = category.id;
                li.addEventListener('click', () => startQuiz(category.id));
                categoryList.appendChild(li);
            });
        });

    // Start the quiz
    function startQuiz(categoryId) {
        fetch(`/api/questions/${categoryId}`)
            .then(res => res.json())
            .then(data => {
                questions = data;
                document.getElementById('category-selection').style.display = 'none';
                quizSection.style.display = 'block';
                showQuestion();
            });
    }

    // Show a question
    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionElement.innerHTML = question.question;
        optionsList.innerHTML = '';
        const options = [...question.incorrect_answers, question.correct_answer];
        shuffleArray(options);
        options.forEach(option => {
            const li = document.createElement('li');
            li.textContent = option;
            li.addEventListener('click', () => selectAnswer(option, question.correct_answer));
            optionsList.appendChild(li);
        });
        nextButton.style.display = 'none';
    }

    // Handle answer selection
    function selectAnswer(selected, correct) {
        const options = optionsList.querySelectorAll('li');
        options.forEach(option => {
            option.style.pointerEvents = 'none';
            option.style.background = option.textContent === correct ? '#28a745' : '#dc3545';
        });
        if (selected === correct) score++;
        nextButton.style.display = 'block';
    }

    // Go to the next question
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    });

    // End the quiz
    function endQuiz() {
        quizSection.style.display = 'none';
        resultSection.style.display = 'block';
        scoreElement.textContent = `${score} / ${questions.length}`;
    }

    // Utility function: shuffle options
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});
