import React, {Component} from 'react';

import data from "../utils/Level-data";
import Jokers from "./Jokers";
import classNames from 'classnames';

class Levels extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scores: this.props.scores,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.scores !== this.props.scores) {
            this.setState({
                scores: nextProps.scores,
            });
        }
        if (this.props.scores) {
            const hl = document.querySelector('.currentLevel');
            hl.style.transform = `translate(0, ${this.state.scores * -30}px)`
        }
    }

    onHandleFiftyFifty = () => {
        if (typeof this.props.onClickFiftyFifty === 'function') {
            this.props.onClickFiftyFifty();
        }
    };

    onHandlePhoneFriend = () => {
        if (typeof this.props.onClickPhoneFriend === 'function') {
            this.props.onClickPhoneFriend();
        }
    };

    onHandleAskAudience = () => {
        if (typeof this.props.onClickAskAudience === 'function') {
            this.props.onClickAskAudience();
        }
    };

    render() {
        let len = data.currentLevel.slice(0).length;
        const winningsLi = data.currentLevel.slice(0).reverse().map((key, i) => (
            <div key={key} className={classNames({
                    'level-row' : true,
                    'color-white' : i % 5 === 0,
                    'color-orange' : i % 5 !== 0
                })}>
                <span className="number1"> {len - i}</span>
                <span>{key}</span>
            </div>
        ))
        return <div className='scorePanel'>
            <div className='winning'>
                <Jokers usedLifelines={this.props.usedLifelines}
                        onClickFiftyFifty={this.props.onClickFiftyFifty}
                        onClickPhoneFriend={this.props.onClickPhoneFriend}
                        onClickAskAudience={this.props.onClickAskAudience}/>
                {winningsLi}
                {this.state.scores ? <span className='currentLevel'/> : null}
            </div>
        </div>
    }
}

export default Levels;
