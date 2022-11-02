import {useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
    GoogleMap,
    Marker,
    DirectionsRenderer,
    Circle,
    Polygon,
    MarkerClusterer,
    computeOffset,
} 
// var faker = require('faker')
from '@react-google-maps/api';
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { GoogleComponent } from 'react-google-location' 
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';

import { EditControl } from "react-leaflet-draw"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"

import axios from 'axios';
// import {MapContainer, TitleLayer, FeatureGroup} from "react-leaflet"

// import {EditControl} from "react-leaflet-draw"
// import "leaflet/dist/leaflet.css"

const DB_URL = 'http://localhost:3000/dealers';

// const API_KEY = "AIzaSyCY1oDgXTf55jiJBGLsiTsCgf9DyrlU6E"
const SetLocationMap = () => {
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const center = useMemo(()=>({lat:40,lng:-80}),[]); // <google.maps.LatLngLiteral>
    const [polygonCords, setPolygonCords] = useState([]);
    const options = useMemo(()=>({ 
        //<MapOptions>
    // disableDefaultUI: true,
        clickableIcons: false
    }),[])
    const mapRef = useRef(); 
    //mapRef: <GoogleMap>
 
    const onLoad = useCallback(map => (mapRef.current = map),[]);
   const handlePolygonCoords = (e)=>{
    setPolygonCords([...polygonCords, {lat:e.latLng.lat(),lng:e.latLng.lng()}]);
    console.log("test",polygonCords)
}
    console.log(JSON.stringify(SetLocationMap));



const handleSignUp = async()=>{
    
    if(polygonCords.length >2 && name.length>0 && pass.length>0){
        // var name = faker.name.Name()
        // var pass = faker.name.lastName()
        // var polygonCords = faker.internet.email()
        // dealers.push({
        //     "Name": name,
        //     "password": pass,
        //     "coords": polygonCords
        //   })
        console.log(polygonCords)
        const data = await axios.post('http://localhost:3000/map',{Name:name,Password:pass,mapName:'map1',coords:polygonCords});
    // console.log(data)

    }
    else if(name.length===0){
        alert('Set your Delaership Name!');

    }
    // else if(polygonCords.length< 2){
    //     alert('Set your Delaership location!');
    // }
   
    else if(pass.length===0){
        alert('Set your Password!');

    }    
}
//////////////////////////////////////////
const _onCreate = (e) => {
    console.log(e);
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;

      setPolygonCords((layers) => [
        ...layers,
        { id: _leaflet_id, latlngs: layer.getLatLngs()[0] }
      ]);
    }
    console.log(polygonCords);
  };

  const _onEdited = (e) => {
    console.log(e);
    const {
      layers: { _layers }
    } = e;

    Object.values(_layers).map(({ _leaflet_id, editing }) => {
      setPolygonCords((layers) =>
        layers.map((l) =>
          l.id === _leaflet_id
            ? { ...l, latlngs: { ...editing.latlngs[0] } }
            : l
        )
      );
    });
    console.log(polygonCords);
  };

  const _onDeleted = (e) => {
    console.log(e);
    const {
      layers: { _layers }
    } = e;

    Object.values(_layers).map(({ _leaflet_id }) => {
      setPolygonCords((layers) => layers.filter((l) => l.id !== _leaflet_id));
    });
    console.log(polygonCords);
  };



//////////////////////////////////////////////
  return (


    <>
    <div><input type={'text'} value={name} placeholder='Enter your Name  ...' onChange={(e)=>{setName(e.target.value)}} />
    <input type={'password'} value={pass} placeholder='Enter your Password  ...' onChange={(e)=>{setPass(e.target.value)}} />
    <button onClick={handleSignUp}>Signup</button></div>
    <div className="map">

            {/* <GoogleMap
            zoom={10} 
            center={center}
            mapContainerStyle={{marginTop:30,width:'100vw',height:'70vh'}}
            options={options}
            onLoad={onLoad}
            onClick={handlePolygonCoords}
            >  
          
                {polygonCords.length>=2 && <Polygon paths={polygonCords} 
            
                options={{
                    strokeColor: "#FF0000",
                    // strokeOpacity: 0.8,
                    // strokeWeight: 2,
                    // fillColor: "#FF0000",
                    fillOpacity: 0
                
                    
                }} />}       
            </GoogleMap> */}
            {/* //////////////////////////// after changing code//////////////////////////////////// */}
            <MapContainer   
            center = {center}
            zoom = {8}
            ref = {mapRef}
            onClick={handlePolygonCoords}
            style={{marginTop:30,width:'100vw',height:'70vh'}}
            options={options}
            onLoad={onLoad}
            >
            {polygonCords.length>=2 && <Polygon paths={polygonCords}
                options={{
                    strokeColor: "#FF0000",
                    // strokeOpacity: 0.8,
                    // strokeWeight: 2,
                    // fillColor: "#FF0000",
                    fillOpacity: 0               
            }} />}
           
            <FeatureGroup>
               <EditControl position='topright' 
                onCreated={_onCreate}
                onEdited = {_onEdited}
                onDeleted = {_onDeleted}
                draw = {
                    {
                    rectangle: false,
                    polyline: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,

                    }
                }

                />
            </FeatureGroup>
      
            <ReactLeafletGoogleLayer />
            </MapContainer>

        <pre>
        <pre className="text-left">{JSON.stringify(polygonCords, 0, 2)}</pre>
        </pre>
    {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}         
        </div>
        </>
  )
}
export default SetLocationMap