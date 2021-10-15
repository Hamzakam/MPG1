import React, { useEffect, useState } from "react";
import "./SearchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { search } from "./services";

function SearchBar({ placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");

  const handleFilter = (event) => {
    setSearchFilter(event.target.value);
  };

  //Will run everytime searchFilter is changed.
  useEffect(() => {
    try {
      //use Effects callback is not async so wrapper async function is required.
      const fetchFilteredData = async () => {
        if (searchFilter === "") {
          setFilteredData([]);
          return;
        }
        //calling search community. returns a array.
        const communities = await search(searchFilter);
        setFilteredData(communities);
      };
      //calling wrapper function.
      fetchFilteredData();
    } catch (error) {
      console.log(error);
    }
  }, [searchFilter]);
  const clearInput = () => {
    setFilteredData([]);
    setSearchFilter("");
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={searchFilter}
          onChange={handleFilter}
        />
        <div className="searchIcon">
          {filteredData.length === 0 ? (
            <SearchIcon />
          ) : (
            <CloseIcon id="clearBtn" onClick={clearInput} />
          )}
        </div>
      </div>
      {filteredData.length !== 0 && (
        <div className="dataResult">
          {filteredData.map((community) => {
            return (
              <a
                className="dataItem"
                key={community.id}
                href={`/api/sub/${community.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <p>{community.name} </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
