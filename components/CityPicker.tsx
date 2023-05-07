"use client";

import React, { useState, useEffect } from "react";
import { Country, City, State } from "country-state-city";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { GlobeIcon } from "@heroicons/react/solid";
import { Text } from "@tremor/react";

type option = {
  value: {
    latitude: string;
    longitude: string;
    isoCode: string;
  };
  label: string;
} | null;

type stateOption = {
  value: {
    latitude: string;
    longitude: string;
    countryCode: string;
    name: string;
    isoCode: string;
  };
  label: string;
} | null;

type cityOption = {
  value: {
    latitude: string;
    longitude: string;
    countryCode: string;
    name: string;
    stateCode: string;
  };
  label: string;
} | null;

const options = Country.getAllCountries().map((country) => ({
  value: {
    latitude: country.latitude,
    longitude: country.longitude,
    isoCode: country.isoCode,
  },
  label: country.name,
}));

function CityPicker() {
  const [selectedCountry, setSelectedCountry] = useState<option>(null);
  const [selectedCity, setSelectedCity] = useState<cityOption>(null);
  const [selectedState, setSelectedState] = useState<stateOption>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { push } = useRouter();

  const handleSelectedCountry = (option: option) => {
    setSelectedCountry(option);
    setSelectedCity(null);
  };

  const handleSelectedState = (option: stateOption) => {
    setSelectedState(option);
    setSelectedCity(null);
  };

  const handleSelectedCity = (option: cityOption) => {
    setSelectedCity(option);
    push(
      `/location/${option?.value.name}/${option?.value.latitude}/${option?.value.longitude}`
    );
  };

  useEffect(() => setIsMounted(true), []);

  return isMounted ? (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-white/80">
          <GlobeIcon className="h-5 w-5 text-white" />
          <label htmlFor="country">Country</label>
        </div>
        <Select
          className="text-black"
          value={selectedCountry}
          onChange={handleSelectedCountry}
          options={options}
        />
      </div>

      {selectedCountry?.value.isoCode === "US" && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-white/80">
            <GlobeIcon className="h-5 w-5 text-white" />
            <label htmlFor="state">State</label>
          </div>
          <Select
            className="text-black"
            value={selectedState}
            onChange={handleSelectedState}
            options={State.getStatesOfCountry(
              selectedCountry.value.isoCode
            ).map((state) => ({
              value: {
                latitude: state.latitude!,
                longitude: state.longitude!,
                countryCode: state.countryCode,
                name: state.name,
                isoCode: state.isoCode,
              },
              label: state.name,
            }))}
          />
        </div>
      )}

      {selectedCountry &&
        selectedState &&
        selectedCountry?.value.isoCode === "US" && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white/80">
              <GlobeIcon className="h-5 w-5 text-white" />
              <label htmlFor="city">City</label>
            </div>
            <Select
              className="text-black"
              value={selectedCity}
              onChange={handleSelectedCity}
              options={City.getCitiesOfState(
                selectedCountry.value.isoCode,
                selectedState.value.isoCode
              )?.map((state) => ({
                value: {
                  latitude: state.latitude!,
                  longitude: state.longitude!,
                  countryCode: state.countryCode,
                  name: state.name,
                  stateCode: state.stateCode,
                },
                label: state.name,
              }))}
            />
          </div>
        )}

      {selectedCountry && selectedCountry?.value.isoCode !== "US" && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-white/80">
            <GlobeIcon className="h-5 w-5 text-white" />
            <label htmlFor="city">City</label>
          </div>
          <Select
            className="text-black"
            value={selectedCity}
            onChange={handleSelectedCity}
            options={City.getCitiesOfCountry(
              selectedCountry.value.isoCode
            )?.map((state) => ({
              value: {
                latitude: state.latitude!,
                longitude: state.longitude!,
                countryCode: state.countryCode,
                name: state.name,
                stateCode: state.stateCode,
              },
              label: state.name,
            }))}
          />
        </div>
      )}
    </div>
  ) : (
    <div>
      <Text className="text-white font-bold text-center">
        Loading Countries...
      </Text>
    </div>
  );
}

export default CityPicker;
