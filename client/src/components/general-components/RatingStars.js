import React from 'react';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

export default function RatingStars() {
  const [value, setValue] = React.useState(1);

  return (
    <div>
      <Box component="fieldset" mb={3} borderColor="transparent">
        <br></br>
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />
      </Box>
    </div>
  );
}
