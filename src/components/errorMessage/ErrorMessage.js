import error from '../../resources/gif/error.gif';
import './errorMessage.scss';
const ErrorMessage = () => {
    return (
        <img src={error} alt='error' className='error'/>
    )
}

export default ErrorMessage;