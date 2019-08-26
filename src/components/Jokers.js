import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPhone} from '@fortawesome/free-solid-svg-icons'
import {faUsers} from '@fortawesome/free-solid-svg-icons'
import {faAdjust} from '@fortawesome/free-solid-svg-icons'

class Jokers extends Component {

    componentWillReceiveProps(nextProps) {
        if (nextProps.canUseLifelines !== this.props.canUseLifelines) {
            this.setState({
                canUseLifelines: nextProps.canUseLifelines
            });
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
        return <div className="margin-10">
            <button className='jokerBtn' disabled={this.props.usedLifelines[0]}
                    onClick={() => this.onHandleFiftyFifty()}>
                <FontAwesomeIcon icon={faAdjust} title="50:50" color={this.props.usedLifelines[0] ? "red" : "white"} size="2x"/>
            </button>
            <button className='jokerBtn' disabled={this.props.usedLifelines[1]}
                    onClick={() => this.onHandlePhoneFriend()}>
                <FontAwesomeIcon icon={faPhone} title="Phone a Friend" color={this.props.usedLifelines[1] ? "red" : "white"} size="2x"/>
            </button>
            <button className='jokerBtn' disabled={this.props.usedLifelines[2]}
                    onClick={() => this.onHandleAskAudience()}>
                <FontAwesomeIcon icon={faUsers}  title="Ask the Audience" color={this.props.usedLifelines[2] ? "red" : "white"} size="2x"/>
            </button>
        </div>
    }
}

export default Jokers;
