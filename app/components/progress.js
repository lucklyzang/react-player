import React ,{Component} from 'react';
import './progress.less'

class Progress extends Component {
    constructor (props) {
        super (props);
        this.progressChange = this.progressChange.bind(this);
    };
    progressChange (e) {
        const progressDom = this.theProgress;
        const leftWidth = progressDom.getBoundingClientRect().left
        const progressWidth = progressDom.clientWidth;
        const currentPercent = (e.clientX-leftWidth)/progressWidth;
        this.props.progressChange && this.props.progressChange (currentPercent) 
    };
    render () {
        return (
            <div className="components-progress"
                ref={(currentProgress) => {this.theProgress = currentProgress}}
                onClick={this.progressChange}
            >
                <div className="progress" style={{width: `${this.props.progress}%`,background:this.props.barColor}}></div>
            </div>
        )
    }
};
Progress.defaultProps = {
    barColor:　'#2f9842'
};
export default Progress;