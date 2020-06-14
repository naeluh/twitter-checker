import React, { useState } from 'react';

export default function List({ data }) {
  console.log(data);
  return data.map(d => {
    <p>
      {d.user.screen_name} is a {d.botometer.scores.universal}
    </p>;
  });
}
