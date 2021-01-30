import React from "react";
import style from "./ActiveTweetProfile.module.css";
import Aux from "./../../../utils/Aux";

const ActiveTweetProfile = (props) => {
  return (
    <Aux>
      <div className={style.profileCont}>
        <h3>Customer</h3>
        <div className={style.profileImage}>
          <img src={props.profile.profile_image_url_https} alt="profile" />
        </div>
        <div className={style.info}>
          TwitterId <b>{props.profile.screen_name}</b>
        </div>
        <div className={style.info}>
          Name <b>{props.profile.name}</b>
        </div>
        <div className={style.info}>
          Location{" "}
          <b>
            {props.profile.location === null
              ? "Not Given"
              : props.profile.location}
          </b>
        </div>
        <div className={style.info}>
          Followers <b>{props.profile.followers_count}</b>
        </div>
        <div className={style.info}>
          Freinds <b>{props.profile.friends_count}</b>
        </div>
      </div>
    </Aux>
  );
};

export default ActiveTweetProfile;
