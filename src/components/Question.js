import React, {Component} from 'react';

class Question extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: this.props.question
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            question: nextProps.question
        });
    }


    render() {
        return (
            <div className = 'question'>
                <p>{this.state.question}</p>
            </div>
        );
    }
}

export default Question;
