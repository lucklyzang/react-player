import React ,{Component} from 'react'
import Musiclistitem from '../components/Musiclistitem'

class MusicList extends Component {
    render () {
        let listEle = null;
        listEle = this.props.musicList.map((item)=>{
            return <Musiclistitem
                focus={item == this.props.currentMusicItem}
                musicItem={item} 
                key={item.id}
            >
                
            </Musiclistitem>
        })
        return(
            <ul>
                {listEle}
            </ul>
        )
    }
};
export default MusicList;