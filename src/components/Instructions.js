import React from 'react'; 


const boxStyle = { 

    // marginLeft: "50%",
	// height:20,
	display: "inline-block",
	alignItems: "center",
	justifyContent: "center",
    textAlign : "center",
    padding : 0,    
    border :  "0.1em solid black",
    width : 20, 

}; 



export default class Key extends React.Component {   

    render () { 

        return ( 
            <div style = {{...boxStyle, background: this.props.color, color: "white"}}>
            
            {this.props.content}
            </div>
        );


       // return ({Instruction});
    }
}

