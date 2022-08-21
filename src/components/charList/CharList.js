import React,{Component} from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component{
    
     

    state = {
        characters: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();
    
    onCharListLoaded = (newCharacters) => {
        let ended = false;
        if (newCharacters.length < 9) {
            ended = true;
        }

        this.setState(({offset,characters})=> ({
            characters: [...characters, ...newCharacters],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    

    componentDidMount() {
        this.onRequest();
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }
    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    setClass = (key) => {
        this.itemRefs.forEach((item,i) => {
            item.classList.remove('char__item_selected');
            if (key === i) {
                item.classList.add('char__item_selected');
            }
        })
    }

    renderItems(arr) {


        const items = arr.map((item,i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail.indexOf('image_not_available') !== -1) {
                imgStyle = {'objectFit' : 'contain'};
            }
            return (
                <li ref={this.setRef} //массив ссылок на элемент записываем в itemRefs
                    className="char__item"
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.setClass(i);
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            );
        });


        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {characters, loading, error,newItemLoading,offset,charEnded} = this.state;
        
        const items = this.renderItems(characters);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading && error) ? items : null;
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button disabled={newItemLoading} style={{'display': charEnded ? 'none' : 'block'}} onClick={()=>this.onRequest(offset)} className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
CharList.propTypes = {
    onCharSelected: PropTypes.func
}
export default CharList;