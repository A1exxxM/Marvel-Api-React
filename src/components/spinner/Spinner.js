import spinner from '../../resources/gif/spinner.gif';
import './spinner.scss';
const Spinner = () => {
    return (
        <img src={spinner} alt='spinner' className='spinner'/>
    )
}

export default Spinner;