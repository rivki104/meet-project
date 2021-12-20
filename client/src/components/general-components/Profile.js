import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const mapStateToProps = (state) => {
    return {
        currentUser: state.generalReducer.currentUser,
    };
}

const mapDispatchToProps = (dispatch) => ({
    // setRoomId: (roomId) => dispatch(actions.setRoomId(roomId)),
});


const getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//TODO Transfer this style to regular style
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    randomColor: {
        color: "wight",
        backgroundColor: getRandomColor,
    },
}));

function Profile(props) {

    const { currentUser } = props;

    const classes = useStyles();

    const [avatarImgaes, setAvatarImages] = useState();
    const [avatarLetters, setAvatarLetters] = useState();

    useEffect(() => {
        //אם יש משתמש רשום
        if (currentUser !== null) {
            //לפי האות הראשונה של החשבון שלו Avatar יצירת  
            setAvatarLetters(<div className={classes.root}>
                <Avatar className={classes.orange}>
                    {currentUser.googleProfile ? currentUser.name.slice(0, 1) : currentUser.email.slice(0, 1)}
                </Avatar>
            </div>);

            //Avatar שליפת תמונת הפרופיל שלו ל
            setAvatarImages(<div className={classes.root}>
                <Avatar alt="..." src={currentUser.picture} />
            </div>);
        }
    }, [currentUser])
    return (
        <div style={{ width: "20px" }}>
            {/* אם יש לו תמונת פרופיל ישתמש בה אם לא- יצור אותיות */}
            {currentUser && currentUser.picture ? avatarImgaes : avatarLetters}
        </div>
    );

}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);