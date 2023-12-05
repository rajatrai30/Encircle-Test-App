import React from 'react';
import { Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import './Logo.css'; // Import the CSS file

function Logo({IconImage, IconLink, logoName, service}) {
    return (
        <div className="Iconlogo">
            <Typography component={Link} to={IconLink}>
                <img src={IconImage} alt="services" className="image" />
                <span className="logoName text-bold text-[3rem] lg:text-[1rem]">{logoName}</span>
            </Typography>
        </div>
    );
}

export default Logo;