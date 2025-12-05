import { Component } from 'react';
import './style.css';
class Cell extends Component {
    render() {
        return (
            <div className={this.getClassName()} style={this.getStyled()}>
                { this.props.cell.isPresent && <span style={{fontSize: '40px', color: '#000', userSelect: 'none', lineHeight: '1'}}>♛</span> }
            </div>
        );
    }
    getClassName = ()=>{
        if(this.props.cell.isAttacked){
            return "boardCell attacked";
        } else if(this.props.cell.isCurrent){
            return "boardCell current";
        }else if(this.props.cell.isPresent){
            return "boardCell present";
        }else if(this.props.cell.isChecked){
            return "boardCell checked";
        } else{
            return "boardCell";
        }
    }
    getStyled = () =>{
        if( (this.props.cell.row+this.props.cell.col)%2 === 0 ){
            return {
                backgroundColor:"white"
            }
        }else{
            return {
                backgroundColor:"grey"
            }
        }
    }
}

export default Cell;