import React, { useState, useEffect } from 'react'
import FadeLoader from 'react-spinners/FadeLoader';

export default function Loading({overideStyle = false}) {

    const style = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '2em'
    }

    return (
        <div style={overideStyle ? overideStyle : style}>
            <FadeLoader color='white' loading={true} size={150} />
        </div>
    )
}
