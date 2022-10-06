import { useState } from "react";

const AutoComplete = ({data, selectCategory }:{data:{}[], selectCategory: (category:string) =>void}) => {
  const [inputText, setInputText] = useState("");
  const [suggestedSearch, setSuggestedSearch] = useState<string[]>([]);

  const handleInputChange = (input: string, data: any) => {
    if (input.length !== 0) {
      let filteredDataByInput = filterData(data, input);
      let filteredData = removeUndefined(filteredDataByInput);
      setSuggestedSearch(filteredData.slice(0,10));
    } else {
      setSuggestedSearch([]);
    }
  };

  const reactFragmentLiElement = (
    <>
      {suggestedSearch?.map((text: string, idx) => {
        var dangerHtml = markCharacters(text, inputText);
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

  return (
    <div className="autoCompleteContainer">
      <select
        className="suggestionCategory"
        name="category"
        id="1"
        onChange={(evt) => {
          selectCategory(evt.target.value);
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
        <input
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


function markCharacters(text: string, stateText: string)
{
  try {
    const regMatch = new RegExp(`${stateText}`, "gi");
    const modedTextArr = text.replace(regMatch, `</span><span style=background-color:gray>${stateText}</span><span>`)
    const dangerHtml = `<span>${modedTextArr}</span>`
    return dangerHtml;
    
  } catch (error) {
    return "<></>";
  }
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
