/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React, { useEffect, useState } from "react";
import GoogleMaps from "./GoogleMaps";
import { jsx, css } from "@emotion/core";
import { colors, utilities } from "../styleVars";
import { Link } from "react-router-dom";

const serviceFilter = css`
  max-width: ${utilities.maxWidth};
  margin: auto;

  .links {
    a {
      color: ${colors.darkColor};
      &:hover {
        color: ${colors.primaryColor};
      }
    }
  }

  form {
    padding: 1rem;
    max-width: 600px;
    margin: auto;

    input {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
    }

    button {
      display: block;
      margin: auto;
      margin: 0.25rem auto;
      padding: 0.5rem;
      width: 100%;
      font-size: 1.1rem;
      background: ${colors.primaryColor};
      border: none;
      cursor: pointer;
      border-radius: ${utilities.borderRadius};
      transition: all ${utilities.animationSpeed} ease;

      &:hover {
        background: ${colors.secondaryColor};
        border: 2px solid ${colors.primaryColor};
        color: ${colors.lightColor};
      }

      a {
        color: ${colors.darkColor};
      }
    }
  }

  .homes {
    background: ${colors.darkColor};
    margin: 1rem;
    padding: 1rem;
    border-radius: ${utilities.borderRadius};

    p {
      color: ${colors.lightColor};
      padding: 1rem 0;

      .name {
        color: ${colors.primaryColor};
      }
    }`

export default function ShowcaseFilter() {
  const [data2, setData2] = useState({ error: "" }); //this is the state for the customer
  const [filteredServices, setFilteredServices] = useState(null);
  const [email, setEmail] = useState(" ");
  const [noServices, setNoServices] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmail({
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email)
    fetch(`/api/v1/selectserviceslist/${email}`)  //!todo
      // .then(res => {
      //     if (res.ok === false) { this.props.history.push('/login') }
      //     return res
      //     console.log(res)
      //   })
      .then(data => data.json())
      .then(data => {
        setData2(data);
        // if (!data2.error) 
        setFilteredServices(data.Services)
        if (data.Services && data.Services.length == 0) {
          setNoServices(true)
        }
        console.log(filteredServices)
        console.log(data)
        console.log('filteredServices')
        //how to make a copy of services? and access it 
      })
  }

  return (
    <>
      {data2.error || noServices ? <><div>No services for this user</div><a href="https://sphyn.herokuapp.com/showcase">Click here to reload page and re-enter correct email</a></> :
        (<>
          <form onSubmit={handleSubmit}>
            <input htmlFor="email" className="emailInput" onChange={(e) => setEmail(e.target.value)}
              value={email} type="email" name="email" placeholder="Email address"></input>
            <button type="submit">the somewhat working button</button>
          </form>
          <>
            {filteredServices && filteredServices.map((service, i) => {
              return (
                <div key={i}>
                  <p><span>{service.nick_name}</span>{service.sq_ft}<span>{service.address}</span><br /></p>
                  {!service.img_url ? < iframe width="853" height="480" src="https://my.matterport.com/show/?m=rvKhT7rSPML" frameborder='0' allowfullscreen allow="xr-spatial-tracking"></iframe> :
                    <iframe width="853" height="480" src={service.img_url} frameBorder="0" allowFullScreen allow="xr-spatial-tracking"></iframe>}
                  <GoogleMaps address={service.address} city={service.city} state={service.state} zipcode={service.zipcode} />
                </div>
              )
            }
            )}
          </>
        </>)
      }
    </>)
}
