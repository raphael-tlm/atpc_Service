import Navigation from './Navigation'

export default function HandlePage({ title, children, nav = false}) {
  

  return (
    <>
    <div className={'page-' + title}>
        {nav ? <Navigation title={title} nav={nav}/> : null}
        <div className={'page-' + title + '-content'}>
          {children}
        </div>
    </div>
    </>
  )
}
