import '../../components/widgets/requestLoader.css'

const RequestLoader = () => {
    return( 
    <>
    <div style={{width:"100%",height:"100%",zIndex:"10000",backdropFilter:"blur(2px)",position:"absolute"}}></div>
    <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </> )
}

export default RequestLoader ;