import React from "react";
import style from "./LandingPage.module.css";
import LandingImage from "./../../utils/images/LandingPage-Image.jpg";
import LoadingComponent from "./../LoadingComponent/LoadingComponent";

const LandingPage = (props) => {
  return (
    <div className={style.landingPageCont}>
      <div className={style.authSection}>
        <div className={style.authSection__header}>
          <h3>Twitter Helpdesk</h3>
        </div>
        <div className={style.authSection__intro}>
          <h1>Optimize Your Brand's Twitter Response</h1>
          <p>Care more for your customers with us.</p>
        </div>
        <div className={style.authSection__buttons}>
          {props.isLoading === true ? (
            <LoadingComponent />
          ) : (
            <a href={props.authUrl}>
              <button className={style.authSection__button}>
                SignIn With Twitter
              </button>
            </a>
          )}
        </div>
      </div>
      <div className={style.imageSection}>
        <div></div>
      </div>
    </div>
  );
};

export default LandingPage;
