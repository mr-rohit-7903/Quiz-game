const apiUrl = "https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple";
let i = 0;
var options =[];
var liElements = [];
var score = 0;

const questions = document.querySelector(".question h3");
const next = document.querySelector("#next");
const ul = document.querySelector("#options");


async function fetchQuestions() {
    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);

        // Parse the JSON response
        const data = await response.json();

        // Check if the response is successful
        if (response.ok) {
            console.log(data.results); // Display the fetched trivia questions in console
            displayQuestions(); // Call function to display questions
        } else {
            console.error("Error fetching trivia questions:", data);
        }

        //function to display questions and answers
        function displayQuestions(){
            questions.innerHTML =  data.results[i].question;
            let li1 = document.createElement("li");
            let li2 = document.createElement("li");
            let li3 = document.createElement("li");
            let li4 = document.createElement("li");

            liElements = [li1, li2, li3, li4];

            data.results[i].incorrect_answers.forEach(el => {
                options.push(el);
            });

            options.push(data.results[i].correct_answer);
            const shuffledOptions = shuffleArray(options);
            console.log(shuffledOptions);

            shuffledOptions.forEach((el, index)=>{
                liElements[index].innerHTML = el;
            });

            liElements.forEach(li => ul.appendChild(li)); 
            checkAnswers();
        }

        function checkAnswers(){
            liElements.forEach((el) =>{
                el.addEventListener('click', ()=>{

                    if (el.classList.contains("clicked")) {
                        return; // Exit if already clicked
                    }
        
                    // Mark the element as clicked
                    liElements.forEach((el) =>{el.classList.add("clicked")});

                    if(el.innerHTML == data.results[i].correct_answer){
                        el.classList.add("correct");
                        score = score + 1;
                    }
                    else{
                        el.classList.add("incorrect");
                    }
                    click = true;
                    showAnswer();
                })
            });
        }

        function showAnswer(){
            liElements.forEach((el) =>{
                if(el.innerHTML == data.results[i].correct_answer){
                    el.classList.add("correct");
                }
            })
        }

        //adding next button
        next.addEventListener('click',()=>{
            next.innerHTML = "next";
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }
            liElements = [];
            options =[];
            if(i<4) {
                i++;
                displayQuestions();
            }
            else{
                questions.innerHTML = `You have completed the Quiz with score: ${score}`;
                next.innerHTML = "Play Again";
                i = 0;
            }
        });

    } catch (error) {
        console.error("Network error:", error);
    }
}

//algorithm to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate random index
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
    return array;
}



fetchQuestions();