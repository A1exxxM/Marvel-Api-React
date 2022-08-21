import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import PropTypes from 'prop-types';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charInfo.scss';
import Skeleton from '../skeleton/Skeleton';

class CharInfo extends Component{

    state = {
        char : null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();


    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }


    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }
        this.onCharLoading();
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }
    
    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        });
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    render() {
        const {char,loading,error} = this.state;
        const skeleton =  char || loading || error ? null : <Skeleton/>;

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = (!loading && !error && char) ? <View char={char} /> : null;
        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}



const ComicsList = ({char}) => {
    const {comics} = char;
    return (
        <>
        {
            // eslint-disable-next-line
            comics.map((item,i) => {
                while (i <= 9) {
                    return (
                        <li key={i} className="char__comics-item">
                            {item.name}
                        </li>
                    )
                }
            })
        }
        </>
    )
}

const View = ({char}) => {
    const {name,description,thumbnail,wiki,homepage,comics} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail.indexOf('image_not_available') !== -1) {
    imgStyle = {'objectFit' : 'contain'};
    }
    const comicsList = comics.length === 0 ? 'Отсутствуют комиксы c участием данного персонажа в базе данных Marvel API' : <ComicsList char={char} />;
    return (
        <>
        <div className="char__basics">
            <img src={thumbnail} alt={name} style={imgStyle}/>
            <div>
                <div className="char__info-name">{name}</div>
                <div className="char__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsList}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}
export default CharInfo;