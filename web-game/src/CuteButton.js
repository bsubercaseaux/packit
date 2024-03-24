import React, { useState } from 'react';

const CuteButton = ({color, text, style, onClick}) => {
    
    return (<button className="cuteBtn" 
                    style={{ marginLeft: 10, 
                    marginBottom: 10, minWidth: 70, minHeight: 35, fontSize: 15, backgroundColor:color, ...style }} 
                    onClick={(event) => {onClick(event)}}>
    {text} 
</button>);
    
// make grid bigger or buttons smaller: for later


    // return what will be rendered

    // {} = don't do anything, {x} = don't want exact letters, but their content

};

export default CuteButton;

