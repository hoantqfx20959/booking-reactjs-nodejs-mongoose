import { useEffect, useState } from 'react';
// import useHttp from '../untils/use-http';
import axios from '../untils/axios';

import Frame from '../components/UI/Frame/Frame';

import Header from '../components/common/Header/Header';

import CityList from '../components/home/CityList/CityList';
import HomesGuestsLoveList from '../components/home/HomesGuestsLove/HomesGuestsLoveList';
import PropertyTypeList from '../components/home/PropertyTypeList/PropertyTypeList';

const Home = () => {
  const [cityData, setCityData] = useState();
  const [propertyData, setPropertyData] = useState();
  const [homesGuestsLove, setHomesGuestsLove] = useState();
  const FetchUrl = (url, func) => {
    useEffect(() => {
      async function fetchData() {
        const request = await axios.get(url);
        func(request.data.items || request.data.user);
        return request;
      }
      fetchData();
    }, [url, func]);
  };

  FetchUrl(`/api/cities`, setCityData);
  FetchUrl(`/api/properties`, setPropertyData);
  FetchUrl(`/api/properties`, setHomesGuestsLove);

  const citiesGuestsLove =
    cityData &&
    cityData.sort((a, b) => b.properties.length - a.properties.length);
  citiesGuestsLove && citiesGuestsLove.splice(5);

  homesGuestsLove && homesGuestsLove.sort((a, b) => b.rating - a.rating);
  homesGuestsLove && homesGuestsLove.splice(5);

  return (
    <>
      <Header />
      <Frame>
        <CityList cityData={citiesGuestsLove} />
        <h2 style={{ width: '1024px' }}>Browse by property type</h2>
        <PropertyTypeList propertyData={propertyData} />
        <h2 style={{ width: '1024px' }}>Homes guests love</h2>
        <HomesGuestsLoveList homesGuestsLove={homesGuestsLove} />
      </Frame>
    </>
  );
};

export default Home;
