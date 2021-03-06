import React ,{Component} from 'react'
import './musiclistitem.less'
import Pubsub from 'pubsub-js'
import {Link} from 'react-router-dom'; 

class MusiclistItem extends Component {

    playMusic(musicItem){
        Pubsub.publish('PLAY_MUSIC',musicItem)
    };

    deleteMusic(musicItem,e){
        e.stopPropagation();
        Pubsub.publish('DELETE_MUSIC',musicItem)
    };
    
    render () {
        let musicItem = this.props.musicItem;
        return (
                <li onClick={this.playMusic.bind(this,musicItem)} className={`components-listitem row ${this.props.focus?'focus':''}`}>
                    <Link to="./home"><p><strong>{musicItem.title}</strong>－{musicItem.artist}</p></Link>
                    <p onClick={this.deleteMusic.bind(this,musicItem)} className="-col-auto delete"></p>
                </li>
        )
    }
};

export default MusiclistItem;
