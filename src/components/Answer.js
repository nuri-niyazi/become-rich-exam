import React, {Component} from 'react';

class Answer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            allAnswers: this.props.allAnswers
        }
    }

    onHandleClick = (answerId) => {
        if (typeof this.props.onSelectAnswer === 'function') {
            this.props.onSelectAnswer(answerId);
        }
    };


    componentWillReceiveProps(nextProps) {
        if (nextProps.allAnswers !== this.props.allAnswers) {
            this.setState({
                allAnswers: nextProps.allAnswers
            });
        }
    }

    render() {
        const letters = ['A: ', 'B: ', 'C: ', 'D: '];
        const btns = this.state.allAnswers.map((answer, i) => {
            return <button
                className='answerButton'
                key={answer}
                disabled={!this.props.canAnswer[i]}
                onClick={() => this.onHandleClick(i)}>
                {letters[i]}{answer}
            </button>
        });

        return <div className='answerContainer'>
            {btns}
        </div>
    }
}

export default Answer;
