import React ,{Component} from 'react'
import {Link} from 'react-router-dom'; 
import Progress from '../components/progress'
import './player.less'
import Pubsub from 'pubsub-js'

let duration = null;

class Player extends  Component {
    constructor(props){
        super(props);
        this.state = {
            progress: 0,
            volume: 0,
            leftTime: 0,
            isPlay:true
        }
        this.progressHandler = this.progressHandler.bind(this);
        this.play = this.play.bind(this)
    };

    componentDidMount () {
        $('#player').bind($.jPlayer.event.timeupdate,(e) => {
            duration = e.jPlayer.status.duration;
            this.setState({
                progress: e.jPlayer.status.currentPercentAbsolute,
                volume: e.jPlayer.options.volume * 100,
            });
        })
    };

    componentWillUnmount () {
        $('#player').unbind($.jPlayer.event.timeupdate)
    };

    progressHandler (progress) {
        $('#player').jPlayer('play', duration * progress);
    };

    changeVolumeHandler (progress) {
        $('#player').jPlayer("volume", progress );
    };

    formatTime (time) {
        let Time = Math.floor(time);
        let Second,Minute;
        if(Time>=60){
             if(Time%60>=10){
                Second = Time%60;
             }else{
                Second = `0${Time%60}`
             }
             Minute = (Time-Second)/60;
        }else{
             if(Time>=10){
                Second = Time;
             }else{
                Second = `0${Time}`
             }
            Minute = '00'
        }
        return  Minute+':'+Second
    };

    play () {
        if (this.state.isPlay) {
			$("#player").jPlayer("pause");
		} else {
			$("#player").jPlayer("play");
		}
        this.setState({
            isPlay: !this.state.isPlay
        })
    };
    playNext () {
       Pubsub.publish('PLAY_NEXT')
    };
    playPrev () {
        Pubsub.publish('PLAY_PREV')
    };
    playType () {
        Pubsub.publish('PLAY_TYPE',this.iType)
    }

    render () {

        return(
           
            <div className="player-page">
                    <h1 className="caption"><Link to="./list">我的私人音乐坊</Link></h1>
                    <p className="pnonograph"><img src="../../static/images/pnonograph.gif"/></p>
                    <div className="mt20 row">
                        <div className="controll-wrapper">
                            <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                            <h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
                            <div className="row mt20">
                                <div className="left-time -col-auto">{this.formatTime(duration*(this.state.progress*0.01))}/{this.formatTime(duration)}</div>
                                <div className="volume-container">
                                    <i className="icon-volume rt" style={{top: 7, left: 15}}></i>
                                    <div className="volume-wrapper" style={{position: 'absolute',top: -16,left: 36}}>
                                        <Progress
                                            progress={this.state.volume}
                                            progressChange={this.changeVolumeHandler}
                                            barColor='pink'
                                        >
                                        </Progress>
                                    </div>
                                </div>
                            </div>
                            <div style={{height: 10, lineHeight: '10px'}}>
                                <Progress
                                    progress={this.state.progress}
                                    progressChange={this.progressHandler}
                                >
                                </Progress>
                            </div>
                            <div className="mt35 row">
                                <div>
                                    <i className="icon prev" onClick={this.playPrev.bind(this)}></i>
                                    <i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`}
                                    onClick={this.play}
                                    ></i>
                                    <i className="icon next ml20" onClick={this.playNext.bind(this)}></i>
                                </div>
                                <div className="-col-auto">
                                    <i className="icon repeat-cycle" 
                                        ref={iType => {this.iType = iType}}
                                        onClick={this.playType.bind(this,this.iType)}>
                                    </i>
                                </div>
                            </div>
                        </div>
                        <div className="-col-auto cover">
                            <img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                        </div>
                    </div>
            </div>
            
        )
    }
}
export default Player;