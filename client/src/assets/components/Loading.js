import FadeLoader from 'react-spinners/FadeLoader';

export default function Loading({hide, overideStyle = {}}) {

    return (
        <div className={hide ? 'loading hide' : 'loading' } style={overideStyle == {} ? null : overideStyle}>
            <FadeLoader color='white' loading={true} size={150} />
        </div>
    )
}
