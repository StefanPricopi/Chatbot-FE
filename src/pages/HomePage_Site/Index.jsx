import React from 'react'
import style from './styling/HomePage.module.css'


export default function () {
  return (
    <div className={style.main_container}>
      <div className={style.top_bar}>
        {/* Top bar with logo etc.*/}
        <button className={style.categories_btn}>
            Categories
        </button>
        <button className={style.verkopen_btn}>
            Start met verkopen
        </button>
        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKRF54Ib4Fgp1tZgscMo93-lAAUKxqTNK8_qYj5jNQ&s' className={style.logo} />       
      </div>
      
      <div>
        {/* images etc */}
      </div>



    </div>
  )
}
