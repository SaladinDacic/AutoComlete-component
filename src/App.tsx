import './App.css';
import AutoComplete from "./AutoComplete";
import { useEffect, useState } from "react";
import * as mockAlbums from "./mockData/mockAlbums.json";
import * as mockComments from "./mockData/mockComments.json";
import * as mockPosts from "./mockData/mockPosts.json";
import * as mockTodos from "./mockData/mockTodos.json";
import * as mockUsers from "./mockData/mockUsers.json";
function App()
{
  const allData = { mockAlbums, mockComments, mockPosts, mockTodos, mockUsers };
  const [category, setCategory] = useState("mockUsers");
  const [data, setData] = useState<{}[]>([]);
  
  const selectedCategory = (allData: any, category: any) => {
    return Object.keys(allData).find((value) => {
      return value === category;
    });
  };

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
    <div className="App">
      <AutoComplete data={data}  selectCategory={ setCategory }/>
    </div>
  );
}

export default App;
