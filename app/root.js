import React ,{Component} from 'react'
import Header from './components/header'
import Player from './page/player'
import  MusicList from './page/musiclist'
import Pubsub from 'pubsub-js'
import { BrowserRouter as Router,Link,Route,Switch} from 'react-router-dom'
import 'whatwg-fetch'
import axios from 'axios';

class Root extends  Component {
    constructor(props){
        super(props);
        this.state = {
            currentMusicItem : {},
            musicList : []
        }

    };

    getData () {
        axios.get('app/config/listData.json')
        .then((response)=> {
            if(response.status == 200){
                this.setState({
                    currentMusicItem: response.data[0],
                    musicList: response.data
                });
                this.playMusic(response.data[0]);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    };

    componentDidMount () {
        $('#player').jPlayer({
            supplied:'mp3',
            vmode:'widow'
        });
        this.getData();
        $('#player').bind($.jPlayer.event.ended, (e) => {
            let childVal = this.child.iType.getAttribute("class")
            if(this.child.iType.className.indexOf('repeat-cycle')>-1){
                this.playNext('next')
            }else if(this.child.iType.className.indexOf('repeat-once')>-1){
                this.playMusic(this.state.currentMusicItem)
            }else if(this.child.iType.className.indexOf('repeat-random')>-1){
                this.playMusic(MUSIC_LIST[this.mathRandom()])
            }
        });

        Pubsub.subscribe('DELETE_MUSIC',(msg,musicItem) => {
            this.setState({
                musicList: this.state.musicList.filter((item)=>{
                    return item !== musicItem
                })
            })
            if(musicItem == this.state.currentMusicItem){
              let seleteIndex =  this.findMusicIndex (musicItem);
              this.playMusic(this.state.musicList[seleteIndex+1]);
            }
        });

        Pubsub.subscribe('PLAY_MUSIC',(msg,musicItem) => {
            this.playMusic (musicItem)
        });

        Pubsub.subscribe('PLAY_NEXT',(msg) => {
            this.playNext('next');
        });

        Pubsub.subscribe('PLAY_PREV',(msg) => {
            this.playNext();
        });

        Pubsub.subscribe('PLAY_TYPE',(msg,iType) => {
            let classVal = iType.getAttribute("class");
            if(iType.className.indexOf('repeat-cycle')>-1){
                classVal = classVal.replace("repeat-cycle","repeat-once");
                iType.setAttribute("class",classVal );
           }else if(iType.className.indexOf('repeat-once')>-1){
                classVal = classVal.replace("repeat-once","repeat-random");
                iType.setAttribute("class",classVal );
           }else if(iType.className.indexOf('repeat-random')>-1) {
                classVal = classVal.replace("repeat-random","repeat-cycle");
                iType.setAttribute("class",classVal );
           }
        });
    };

    componentWillUnMount () {
        Pubsub.unsubscribe('DELETE_MUSIC');
        Pubsub.unsubscribe('PLAY_MUSIC');
        Pubsub.unsubscribe('PLAY_NEXT');
        Pubsub.unsubscribe('PLAY_PREV');
        Pubsub.unsubscribe('PLAY_TYPE')
    };

    playMusic (musicItem) {
        $('#player').jPlayer('setMedia',{
            mp3:musicItem.file
        }).jPlayer('play');
        this.setState({
            currentMusicItem: musicItem
        })
    };

    findMusicIndex (musicItem) {
        return this.state.musicList.indexOf(musicItem)
    };

    playNext ( genre ) {
            let index =  this.findMusicIndex (this.state.currentMusicItem);
            let newIndex = null;
            let musicListLength = this.state.musicList.length;
            if( genre === 'next'){
                newIndex = (index+1) % musicListLength
            }else{
                newIndex = (index-1+musicListLength) % musicListLength
            }
            this.playMusic(this.state.musicList[newIndex])
    };
    mathRandom () {
        return parseInt(Math.random()*(6-0+1)+0)
    }
    render () {
        const Home = () => (
            <Player
              currentMusicItem={this.state.currentMusicItem}
              ref={iType => this.child = iType} 
            />
          );
      
          const List = () => (
            <MusicList
            currentMusicItem={this.state.currentMusicItem}
              musicList={this.state.musicList}
            />
          );
        return(
            <Router>
                <section>
                    <Header/>,
                    <Route exact path="/" component={Home}/>
                    <Route path="/list" component={List}/>
                </section>
            </Router>
        )
    }
};


export default Root;