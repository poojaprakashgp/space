import {memo} from 'react'
const LaunchItem = ({ launch }) => {
    return ( 
        <>
        <img src={launch.links.mission_patch_small} alt={launch.mission_name} />
        <h3>{launch.mission_name}</h3>
        <p>{new Date(launch.launch_date_local).toLocaleDateString()}</p>
        <p>Rocket: {launch.rocket.rocket_name}</p>
        <p>Launch Site: {launch.launch_site.site_name}</p>
      </>
    )
}

export  const MemoriedItems = memo(LaunchItem)