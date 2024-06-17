import React, {useState, useRef} from 'react'
import style from './styling/HomePage.module.css'
import ChatbotPage from '../Chatbot/ChatbotPage'
import LoginDash from './LoginComp'


export default function () {

  const authUser = useRef({id: 0, token: ""});
  const [trigger, setTrigger] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const setUserInfo = (user) => {
    authUser.current = {id: user.id, token: user.token}
    setTrigger(prevTrigger => !prevTrigger);
    console.log(user);
    //console.log(`token: ${authUser.current.token}\nuserId: ${authUser.current.id}`);    
  }

  const handleChange = () => {
    setShowLogin(prev => !prev);
  }

  return (
    <div className={style.main_container}>
      <div className={style.ratings_bar}>

      </div>


      <div className={style.top_bar}>
        {/* Top bar with logo etc.*/}

        <div className={style.top_btn}>
          <button className={style.categories_btn}>
              Categories
          </button>
          <button className={style.verkopen_btn}>
              Start selling
          </button>
        </div>
        
        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKRF54Ib4Fgp1tZgscMo93-lAAUKxqTNK8_qYj5jNQ&s' className={style.logo} />       

        <button className={style.loginbtn} onClick={handleChange}>
          { showLogin ? "Login" : "Login"}
        </button>

      </div>
      
      <div>
        {/* images etc */}
      </div>


      <div className={style.main_section}>
        {/* Main Animated image etc */}

                   
          <video className={style.animated_img} autoPlay muted>
            <source src="https://cms.media.basworld.com/v/basgroup/Dronebeelden_videowall_V4/mp4_480p" type="video/mp4"/>
          </video>
          <div className={style.animated_txt}>
            BUY VEHICLES AND MACHINERY WORLDWIDE
            <button className={style.animated_btn}>
              VIEW STOCK
            </button>
          </div> 





          <div className={style.component_section}>
            <div className={style.home_components}>
              <span className={style.component_txt}>Over 2.500 products in stock</span>
              <div>
                <button className={style.component_btn}> &gt;	 </button>
                <span className={style.component_btn_txt}>View our stock</span>
              </div>
            </div>

            <div className={style.home_components}>
                <span className={style.component_txt}>Sell your vehicle or Machine</span>
           
                <div>
                  <button className={style.component_btn}> &gt;	 </button>
                  <span className={style.component_btn_txt}>Start selling now</span>
                </div>

            </div>
          </div>
          
      </div>

      <div className={style.spc_container}>
        <p>Search Per Category</p>

        <div className={style.spc_card_container}>
          <div className={style.spc_card_body}>
            <div className={style.spc_card_img}>
              <img className={style.spc_card_img} src="https://basgroup.a.bigcontent.io/v1/static/tractor-units"/>

            </div>
            <span className={style.spc_card_txt}>Tractor Unit</span>
          </div>

          <div className={style.spc_card_body}>
            <div className={style.spc_card_img}>
              <img className={style.spc_card_img} src="https://basgroup.a.bigcontent.io/v1/static/trucks"/>

            </div>
            <span className={style.spc_card_txt}>Truck</span>
          </div>

          <div className={style.spc_card_body}>
            <div className={style.spc_card_img}>
              <img className={style.spc_card_img} src="https://basgroup.a.bigcontent.io/v1/static/truck-and-trailer-combination"/>

            </div>
            <span className={style.spc_card_txt}>Truck + Trailer</span>
          </div>

          <div className={style.spc_card_body}>
            <div className={style.spc_card_img}>
              <img className={style.spc_card_img} src="https://basgroup.a.bigcontent.io/v1/static/vans_1"/>

            </div>
            <span className={style.spc_card_txt}>Vans</span>
          </div>

          <div className={style.spc_card_body}>
            <div className={style.spc_card_img}>
              <img className={style.spc_card_img} src="https://basgroup.a.bigcontent.io/v1/static/machinery_1"/>

            </div>
            <span className={style.spc_card_txt}>Machinery</span>
          </div>

          <div className={style.spc_card_body}>
            <div className={style.spc_card_img}>
              <img className={style.spc_card_img} src="https://basgroup.a.bigcontent.io/v1/static/agri_1"/>

            </div>
            <span className={style.spc_card_txt}>Agriculture</span>
          </div>

          <div className={style.spc_card_body}>
            <div className={style.spc_card_img}>
              <img className={style.spc_card_img} src="https://basgroup.a.bigcontent.io/v1/static/semi-trailers_1"/>

            </div>
            <span className={style.spc_card_txt}>Semi-Trailers</span>
          </div>

          <div className={style.spc_card_body}>
            <div className={style.spc_card_img}>
              <img className={style.spc_card_img} src="https://basgroup.a.bigcontent.io/v1/static/trailers_1"/>
            </div>
            <span className={style.spc_card_txt}>Trailers</span>
          </div>



        </div>

      </div>
      {/* login dashbaord. */}
      {showLogin && <LoginDash setUserInfo={setUserInfo} /> }

      <ChatbotPage userInfo={authUser} trigger={trigger}/>

    </div>
  )
}
