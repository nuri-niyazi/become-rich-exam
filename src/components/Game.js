import React, {Component} from 'react';
import Answer from './Answer';
import Levels from './Levels';
import Question from './Question';
import QuestionType from '../utils/Constants';
import axios from 'axios';
import data from '../utils/Level-data';

class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: [],
            allAnswers: [],
            incorrectAnswers: [],
            correctAnswerId: null,
            canAnswer: [false, false, false, false],
            text: "",
            scores: 0,
            usedLifelines: [false, false, false]
        }
    }

    componentDidMount() {
        this.startGame();
    }

    startGame = () => {
        this.prepareQuestion([true, true, true]);
        this.setState({
            text: `Hello! This is your first question!`,
            scores: 0,
            usedLifelines: [false, false, false]
        });
    }

    getQuestion = () => {
        if (!this.sessionToken) {
            axios.get(`https://opentdb.com/api_token.php?command=request`)
                .then(res => {
                    this.sessionToken = res.data.token;
                    this.retrieveQuestions();
                }).catch(error => {
                console.error(error);
            });
        } else {
            this.retrieveQuestions();
        }
    }

    retrieveQuestions = () => {
        let type = QuestionType.EASY;
        if (this.state.scores > 5 && this.state.scores <= 10) {
            type = QuestionType.MEDIUM;
        } else if (this.state.scores > 10) {
            type = QuestionType.HARD;
        }

        axios.get(`https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986&difficulty=${type}&token=${this.sessionToken}`)
            .then(res => {
                if (!res.data.response_code) {
                    const question = decodeURIComponent(res.data.results[0].question);
                    const incorrectAnswers = res.data.results[0].incorrect_answers.map(item => decodeURIComponent(item));
                    const correctAnswer = decodeURIComponent(res.data.results[0].correct_answer);
                    const allAnswers = this.shuffle(incorrectAnswers.concat(correctAnswer));
                    const correctAnswerId = allAnswers.indexOf(correctAnswer);
                    this.setState({question, allAnswers, correctAnswerId, incorrectAnswers});
                } else if (res.data.response_code === 3) {
                    this.getQuestion();
                } else {
                    let errorMsg = "Error: Could not retrieve data from the server";
                    this.setState({
                        text: errorMsg
                    });
                    throw Error(errorMsg);
                }

            }).catch(error => {
            console.error(error);
        });
    }

    shuffle = arr => {
        for (let i = arr.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
        }

        return arr;
    }

    hightlightCorrectAns = () => {
        this.state.allAnswerButtons[this.state.correctAnswerId].classList.remove('selected');
        this.state.allAnswerButtons[this.state.correctAnswerId].classList.add('correct');
    }

    hightlightSelectedAns = id => {
        this.state.allAnswerButtons[id].classList.add('selected');
        this.state.allAnswerButtons[id].disabled = true;
    }

    hightlightWrongAns = id => {
        this.state.allAnswerButtons[id].classList.remove('selected');
        this.state.allAnswerButtons[id].classList.add('wrong');
        this.state.allAnswerButtons[id].disabled = true;
    }

    prepareQuestion = status => {
        this.getQuestion();
        this.setState({
            usedLifelines: status,
            canAnswer: [true, true, true, true],
        });
    }

    finishGame = text => {
        this.setState({
            usedLifelines: [false, false, false],
            canAnswer: [false, false, false, false],
            canType: true,
            text: text,
        });
    }


    handleSelectAnswer = (id) => {
        this.state.allAnswerButtons = document.querySelectorAll('.answerButton');
        this.hightlightSelectedAns(id);
        this.setState({
            canAnswer: [false, false, false, false],
        });

        setTimeout(() => {
            if (id === this.state.correctAnswerId) {
                this.hightlightCorrectAns();
                this.setState({
                    scores: this.state.scores + 1,
                    canAnswer: [false, false, false, false],
                });

                if (this.state.scores < 15) {
                    this.setText('Correct answer!');
                    this.prepareQuestion(this.state.usedLifelines);
                } else {
                    this.setState({
                        canAnswer: [false, false, false, false],
                    })
                    this.setText(`Congratulations! You've just won a  ${data.guaranteedAmounts[this.state.scores - 1]}`)
                }

            } else {
                this.hightlightCorrectAns();
                this.hightlightWrongAns(id);
                this.finishGame(`Wrong answer! You earn ${data.guaranteedAmounts[this.state.scores]}`);
                this.setState({
                    canAnswer: [true, true, true, true],
                    scores: 0
                });
                setTimeout(() => this.startGame(), 700)
            }
            setTimeout(() => this.setText(), 2500)
        }, 1000);
    }

    setText = text => {
        this.setState({
            text: text,
        });
    }

    handleFiftyFifty = () => {
        this.setText("Let's highlight two wrong answers!");
        let usedLifelines = Object.assign(this.state.usedLifelines);
        usedLifelines[0] = true;
        this.setState({
            usedLifelines: usedLifelines
        });
        let allAnswerButtons = [...document.querySelectorAll(".answerButton")];
        allAnswerButtons.splice(this.state.correctAnswerId, 1);
        this.shuffle(allAnswerButtons);
        for (let i = 0; i < 2; i++) {
            allAnswerButtons[i].disabled = true;
            allAnswerButtons[i].classList.add('wrong')
        }
    }

    handlePhoneFriend = () => {
        let allAnswerButtons = this.shuffle([...document.querySelectorAll(".answerButton")]);
        let notDisabledAnswers = allAnswerButtons.filter(i => i.disabled === false);

        let usedLifelines = Object.assign(this.state.usedLifelines);
        usedLifelines[1] = true;
        this.setState({
            usedLifelines: usedLifelines,
            text: notDisabledAnswers[0].innerText
        })
    }

    handleAskAudience = () => {
        let audienceAnswer;

        let percentage = (Math.random() * 100) + 1;
        if (percentage <= 70) {
            audienceAnswer = this.state.allAnswers.filter(val => !this.state.incorrectAnswers.includes(val));
        } else {
            let allAnswerButtons = this.shuffle([...document.querySelectorAll(".answerButton")]);
            let notDisabledAnswers = allAnswerButtons.filter(i => i.disabled === false);

            for (let i = 0; i < notDisabledAnswers.length; i++) {
                for (let j = 0; j < this.state.incorrectAnswers.length; j++) {
                    if (notDisabledAnswers[i].innerText.split(": ")[1] === this.state.incorrectAnswers[j]) {
                        audienceAnswer = this.state.incorrectAnswers[j];
                        break;
                    }
                }
                if (audienceAnswer) {
                    break;
                }
            }
        }

        let usedLifelines = Object.assign(this.state.usedLifelines);
        usedLifelines[2] = true;
        this.setState({
            usedLifelines: usedLifelines,
            text: audienceAnswer
        })
    }

    render() {
        return (
            <div>
                <div className="level-panel">
                    <Levels scores={this.state.scores} usedLifelines={this.state.usedLifelines}
                            onClickFiftyFifty={this.handleFiftyFifty}
                            onClickPhoneFriend={this.handlePhoneFriend}
                            onClickAskAudience={this.handleAskAudience}/>
                </div>

                <div className="game-container">
                    <h1 className='text'>{this.state.text}</h1>
                    <Question question={this.state.question}/>
                    <Answer allAnswers={this.state.allAnswers} onSelectAnswer={this.handleSelectAnswer}
                            canAnswer={this.state.canAnswer}/>
                </div>
            </div>
        );
    }
}

export default Game;
