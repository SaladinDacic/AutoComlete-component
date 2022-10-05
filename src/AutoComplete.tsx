import { useEffect, useRef, useState } from "react";
import * as mockAlbums from "./mockData/mockAlbums.json";
import * as mockComments from "./mockData/mockComments.json";
import * as mockPosts from "./mockData/mockPosts.json";
import * as mockTodos from "./mockData/mockTodos.json";
import * as mockUsers from "./mockData/mockUsers.json";

const AutoComplete = () => {
  const allData = { mockAlbums, mockComments, mockPosts, mockTodos, mockUsers };
  const [data, setData] = useState<{}[]>([]);
  const [inputText, setInputText] = useState("");
  const [category, setCategory] = useState("mockUsers");
  const [suggestedSearch, setSuggestedSearch] = useState<string[]>([]);

  const selectedCategory = (allData: any, category: any) => {
    return Object.keys(allData).find((value) => {
      return value === category;
    });
  };

  const handleInputChange = (input: string, data: any) => {
    if (input.length !== 0) {
      let filteredDataByInput = filterData(data, input);
      let filteredData = removeUndefined(filteredDataByInput);
      setSuggestedSearch(filteredData.slice(0, 10));
    } else {
      setSuggestedSearch([]);
    }
  };

  const reactFragmentLiElement = (
    <>
      {suggestedSearch?.map((text: string, idx) => {
        var dangerHtml = markCharacters(text, inputText, idx);
        return (
          <li
            onClick={() => {
              setInputText(text);
              handleInputChange(text, data);
            }}
            key={idx}
            value={text}
            dangerouslySetInnerHTML={{ __html: dangerHtml }}
          ></li>
        );
      })}
    </>
  );

  useEffect(() => {
    (async () => {
      const nameOfCategory = selectedCategory(allData, category);
      const typedInputData = allData as any;

      const data = await new Promise((resolve, reject) => {
        if (nameOfCategory !== undefined) {
          resolve(typedInputData[nameOfCategory]);
        } else {
          resolve(typedInputData);
        }
        reject("can't fetch data");
      });
      const typedData = data as any;
      if (nameOfCategory !== undefined) {
        setData(typedData.default);
      } else {
        const extractedData = Object.keys(typedData).reduce((acc, keyName) => {
          return acc.concat(typedInputData[keyName].default);
        }, []);
        setData(extractedData);
      }
    })();
    return () => {};
  }, [category]);

  return (
    <div className="autoCompleteContainer">
      <select
        className="suggestionCategory"
        name="category"
        id="1"
        onChange={(evt) => {
          setCategory(evt.target.value);
        }}
      >
        <option value="mockUsers">users</option>
        <option value="mockAlbums">albums</option>
        <option value="mockComments">comments</option>
        <option value="mockPosts">posts</option>
        <option value="mockTodos">todos</option>
        <option value="everything">everything</option>
      </select>
      <div className="text-container">
        <textarea
          placeholder="Search anything"
          className="suggestionInput"
          autoComplete="off"
          value={inputText}
          onChange={(evt) => {
            setInputText(evt.target.value);
            handleInputChange(evt.target.value, data);
          }}
        />
        <ul className="suggestionList" id="suggestions">
          {reactFragmentLiElement}
        </ul>
      </div>
    </div>
  );
};

export default AutoComplete;

function markCharacters(text: string, stateText: string, idx: number) {
  const regMatch = new RegExp(`${stateText}`, "gi");
  const modedTextArr = text.replace(regMatch, "§§§").split("§§§");
  const stringsObj: any = {};
  modedTextArr.forEach((string: string, idx: number) => {
    const strName = `str${idx}`;
    stringsObj[strName] = `<span>${string}</span>`;
  });
  var htmlStyled = `<span style=background-color:gray>${stateText}</span>`;
  var dangerHtml = Object.values(stringsObj).join(htmlStyled);
  return dangerHtml;
}

function filterData(data: any, input: string) {
  return data.map((obj: any) => {
    var arr: string[] = Object.keys(obj);
    for (let i = 0; i < arr.length; i++) {
      try {
        const foundValue = String(obj[arr[i]]).toLowerCase();
        const loweredInput = input.toLowerCase();

        if (foundValue.includes(loweredInput)) {
          return obj[arr[i]];
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
}

function removeUndefined(stringArr: string[]) {
  return stringArr.filter((text: string) => {
    if (text === undefined) return false;
    else return true;
  });
}
