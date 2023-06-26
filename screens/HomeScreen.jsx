import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
 
  
} from "react-native";

import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/FontAwesome5";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../api";

import { getData, storeData } from "../api/storage/asyncStorage";
const HomeScreen = () => {
  const [search, setSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const handleLocation = (location) => {
    setLocations([]);
    setSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: location?.name,
      days: 7,
    }).then((data) => {
      setLoading(false);
      setWeather(data);
      storeData("city", location.name);
    });
  };
  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  }; 
  const fetchMyWeatherData = async () => {
    let City = await getData("city");
    let cityName = "Baranagar";
    if (City) {
      cityName = City;
    }
    fetchWeatherForecast({
      cityName,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const { current, location } = weather;
  return (

    
    
    
    <View className="flex-1 relative">
      
      <StatusBar style="light" />
     
       
      <Image
        blurRadius={70}
        source={require("../assets/images/bg.png")}
        className="absolute h-full w-full"
      />
      
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Text className=" text-4xl font-bold text-green-300">Loading...</Text>
        </View>
      ) : (
        <SafeAreaView className="flex flex-1 mt-9">
             
          <View style={{ height: "7%" }} className="mx-4 relative z-50">
           
            <View
              className="flex-row  justify-end items-center rounded-full "
              style={{
                backgroundColor: search
                  ? "rgba(255 , 255 ,255 ,0.2)"
                  : "transparent",
              }}
            >
              {search ? (
                <TextInput
                  onChangeText={handleSearch}
                  placeholder="Search City"
                  placeholderTextColor={"lightgray"}
                  className="w-full rounded-full pl-4 flex-1 text-base text-white h-10"
                />
              ) : null}

              <TouchableOpacity
                onPress={() => setSearch(!search)}
                style={{ backgroundColor: "rgba(255 , 255 ,255 , 0.3)" }}
                className="rounded-full p-3 m-1"
              >
                <Icon name="search1" size={25} color="#ffffff" />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && search ? (
              
              <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                {locations.map((location, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : " ";
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(location)}
                      key={index}
                      className={
                        "flex-row items-center border-0 p-3 px-4 mb-1 space-x-2" +
                        borderClass
                      }
                    >
                      <Icon2 name="map-marker-alt" size={25} color="gray" />
                      <Text className="text-black text-lg ml-2">
                        {" "}
                        {location?.name} , {location?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            
            ) : null}
           
              </View>
             
              <View className="mx-4 justify-around flex-1 mb-2">
            <Text className="text-white text-center text-2xl font-bold">
              {location?.name} ,
              <Text className="text-lg font-semibold text-gray-300">
                {" " + location?.country}
              </Text>
            </Text>
            <View className="flex-row justify-center">
              <Image
                source={weatherImages[current?.condition?.text]}
                className="w-52 h-52"
              />
            </View>
            <View className="space-y-2">
              <Text className="text-center font-bold text-white text-6xl ml-5">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-center font-bold text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            <View className="flex-row justify-between mx-4 ">
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/wind.png")}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.wind_kph}KM/h
                </Text>
              </View>

              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/drop.png")}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.humidity}%
                </Text>
              </View>

              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/sun.png")}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                   {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>
          
             <View className="mb-2 space-y-3">
              <View className="flex-row items-center mx-5 space-x-2">
              <Icon name="calendar" size={25} color="#ffffff" />
              <Text className="text-white text-base">Daily Forecast</Text>
            </View>
            

            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.map((item, index) => {
                let date = new Date(item.date);
                let options = { weekday: "long" };
                let dayName = date.toLocaleDateString("en-US", options);
                dayName = dayName.split(",")[0];
                return (
                  <View
                    key={index}
                    className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                    style={{ backgroundColor: "rgba(255 ,255 , 255 , 0.15)" }}
                  >
                    <Image
                      source={weatherImages[item?.day?.condition?.text]}
                      className="h-11 w-11"
                    />
                    <Text className="text-white">{dayName}</Text>
                    <Text className="text-white text-xl font-semibold">
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
              
              </ScrollView>
             
            </View>
            
            
          </SafeAreaView>
        
          )}
       
       
      
       </View>
       
      
  );
};

export default HomeScreen;
