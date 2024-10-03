// adding api Url
const apiUrl = "https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple";

// global variables used
let i = 0;
var options =[];
var liElements = [];
var score = 0;

// calling HTML 
const questions = document.querySelector(".question h3");
const next = document.querySelector("#next");
const ul = document.querySelector("#options");

//function to fetch API
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

        //Function to display questions and answers
        function displayQuestions(){

            //Displaying question along with index
            questions.innerHTML = i+1 + ". " + data.results[i].question;

            //Creating 4 options
            let li1 = document.createElement("li");
            let li2 = document.createElement("li");
            let li3 = document.createElement("li");
            let li4 = document.createElement("li");

            liElements = [li1, li2, li3, li4];

            //Adding incorrect and correct answers to options array
            data.results[i].incorrect_answers.forEach(el => {
                options.push(el);
            });
            options.push(data.results[i].correct_answer);

            //Shuffling the options array
            const shuffledOptions = shuffleArray(options);
            console.log(shuffledOptions);

            //adding options to HTML
            shuffledOptions.forEach((el, index)=>{
                liElements[index].innerHTML = el;
                liElements[index].classList.toggle("hover");
            });
            liElements.forEach(li => ul.appendChild(li)); 

            //Checking answers
            checkAnswers();
        }

        //Function to check answers
        function checkAnswers(){
            liElements.forEach((el) =>{

                //checking the click event
                el.addEventListener('click', ()=>{

                    if (el.classList.contains("clicked")) {
                        return; // Exit if already clicked
                    }
        
                    // Mark the element as clicked to lock clicking again
                    liElements.forEach((el) =>{
                        el.classList.add("clicked");
                        el.classList.toggle("hover");
                    });

                    //for correct option selected by user
                    if(el.innerHTML == data.results[i].correct_answer){ 
                        el.classList.add("correct");
                        score = score + 1;
                    }
                    //for wrong option selected by user
                    else{
                        el.classList.add("incorrect");
                    }

                    //Show the answer, even if user selected wrong answer
                    showAnswer();
                })
            });
        }

        //Function to highlight the correct option
        function showAnswer(){
            liElements.forEach((el) =>{
                if(el.innerHTML == data.results[i].correct_answer){
                    el.classList.add("correct");
                }
            })
        }

        //adding next button
        next.addEventListener('click',()=>{
            next.innerHTML = "Next";

            //removing all the added options
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }

            //clearing arrays
            liElements = [];
            options =[];

            //increasing index
            i++;

            // checking the number of questions 
            if(i<5) {
                displayQuestions();
            }
            else{
                //complition of quiz
                questions.innerHTML = `You have completed the Quiz with score: ${score} out of 5.`;
                next.innerHTML = "Play Again";
                i = -1;
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

//Function to fetch data from API
fetchQuestions();