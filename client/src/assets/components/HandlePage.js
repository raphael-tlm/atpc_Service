import React, { useEffect, useState }from 'react'

import Navigation from './Navigation'
import Loading from './Loading.js';

export default function HandlePage({ title, children, nav = false}) {
  const [overideStyle, setOverideStyle] = useState()

  useEffect(() => {
    const load = () => {
      setOverideStyle({
        display: 'none'
    })
  }
   
  load();
  }, [window]);

  return (
    <>
    <Loading overideStyle={overideStyle}/>
    <div className={'page-' + title}>
        <div className={'page-' + title + '-content'}>
            {nav ? <Navigation title={title} nav={nav}/> : null}
            {children}
        </div>
    </div>
    </>
  )
}
