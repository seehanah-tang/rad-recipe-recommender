import firebase from "../firebase/Firebase";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import Navbar from "../components/Navbar";
import { RecipeData } from "../interfaces/MultifacetedRecipes";
import { UserData } from "../interfaces/MultifactedUser";
import authRefHelper from "../firebase/AuthRefHelper";
import "../styles/searchStyles.css";
import Title from "../components/Title";
import { API_KEY } from "../key";

/**
 * Interface that helps with state changes for the controlled input
 */
interface ControlledInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  ariaLabel: string;
}

/**
 * Sets up an input box that will be used to pass in commands
 *
 * @returns HTML element that contains a input box
 */
function ControlledInput({ value, setValue, ariaLabel }: ControlledInputProps) {
  return (
    <input
      className="search-input-box"
      value={value}
      placeholder="Enter something (ingredients, recipe names, etc.) to search"
      onChange={(ev) => setValue(ev.target.value)}
      aria-label={ariaLabel}
    ></input>
  );
}

interface InputBoxProps {
  addSearchTerm: (guess: string) => any;
}

/**
 *
 * sets up the inut box as well as a button that executes the command
 * @returns HTML element with the input box and the execute command button
 */
function InputBox({ addSearchTerm }: InputBoxProps) {
  const [value, setValue] = useState("");
  return (
    <div className="search-bar">
      <div className="search-bar-input">
        <fieldset>
          <ControlledInput
            value={value}
            setValue={setValue}
            ariaLabel={"Search box, look up some recipe recommendations"}
          />
        </fieldset>
      </div>
      <div>
        <button
          onClick={() => {
            addSearchTerm(value);
            setValue("");
          }}
          className="search-button"
          aria-label={"search button"}
        >
          {"Search"}
        </button>
      </div>
    </div>
  );
}

interface ControlledImageProps {
  link: string;
  altText: string;
  malLink: string;
}

/**
 * Uses the interface Controlled image props to create an image
 *
 * @param link - the src of the image
 * @param altText - the alt text of the image
 * @returns an image
 */
function ControlledImage({ link, altText, malLink }: ControlledImageProps) {
  return (
    <div>
      <a target="_blank" href={malLink}>
        <img src={link} alt={altText}></img>
      </a>
    </div>
  );
}

interface ControlledTitleProps {
  title: string;
}

/**
 * creates a title line using the ControlledTitleProp
 *
 * @param title - title of the show
 * @returns
 */
function ControlledTitle({ title }: ControlledTitleProps) {
  return <p className="image-title">{title}</p>;
}
/**
 * creates a list of search result divs and allows for them to be displayed. Also adds the show to a users
 * recipelist.
 * @param data the data set of the search results
 * @param setItems part of the hook that we use to set the list of react element sop that thay can be displayed.
 * @param addToAcc adds the recipe block that we create for each show to a person's recipe list if they want it.
 */
async function CreateSearchResults(
  data: any[],
  setItems: (itemList: any[]) => any,
  addToAcc: (recipeBlock: RecipeData) => any
) {
  let imDiv = [];
  if (data[0] !== undefined) {
    for (let i = 0; i < data.length; i++) {
      let sourceURL = "";
      try {
        const response = await fetch(
          "https://api.spoonacular.com/recipes/" +
            data[i].id +
            "/information?apiKey=" +
            API_KEY +
            "&includeNutrition=false"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseObject = await response.json();
        sourceURL = responseObject.sourceUrl;

        imDiv.push(
          <div>
            <ControlledImage
              link={data[i].image}
              altText={"cover picture of " + data[i].title}
              malLink={sourceURL}
            />
            <br></br>
            <ControlledTitle title={data[i].title} />
            <button
              className="add-button"
              onClick={() => {
                if (data[i] !== undefined) {
                  const ref = data[i];
                  try {
                    const recipeBlock: RecipeData = {
                      id: parseInt(ref.id),
                      title: ref.title,
                      thumbnail: ref.image,
                      url: ref.url,
                      // cuisine: ,
                    };
                    addToAcc(recipeBlock);
                  } catch (error) {
                    console.log(error);
                  }
                }
              }}
            >
              Add to Your Recipe Collection
            </button>
          </div>
        );
      } catch (error) {
        console.error("Error fetching source URL:", error);
      }
    
    }
    setItems(imDiv);
  } else {
    let notFoundDiv = [];
    notFoundDiv.push(
      <div>
        <p>No matching recipes! Check your spelling or widen your search.</p>
      </div>
    );
    setItems(notFoundDiv);
  }
}

export default function SearchPage() {
  //Hooks are created in order to update search term, image links, titles, etc.
  const [term, setTerm] = useState<string>("");
  const [cuisine, setCuisine] = useState<string>("");
  // const [data, setData] = useState<any[]>([])
  const [itemList, setItemList] = useState<any[]>([]);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [fbUser, setFBUser] = useState<UserData>();
  useEffect(() => {
    authRefHelper(setGoogleUser, setFBUser);
  }, []);

  /**
   * defines lambda function addToAcc, which adds in an recipeblock to an account
   */
  const devRef = firebase.firestore().collection("user_accounts");
  const addToAccount = (recipeBlock: RecipeData) => {
    devRef
      .doc(googleUser?.uid)
      .get()
      .then((doc) => {
        const datablock = doc.data();
        if (datablock !== undefined) {
          if (datablock.recipe_list !== undefined) {
            devRef.doc(googleUser?.uid).update({
              recipe_list:
                firebase.firestore.FieldValue.arrayUnion(recipeBlock),
            });
          } else {
            devRef.doc(googleUser?.uid).update({
              recipe_list: [recipeBlock],
            });
          }
        }
      });
  };

  // This use effect function updates on the search term and displays new search results as necessary
  useEffect(() => {
    // setData([])
    setItemList([]);
    const getInfo = () => {
      // TODO: edit this for more filters
      fetch(
        "https://api.spoonacular.com/recipes/complexSearch?apiKey=" +
          API_KEY +
          "&query=" +
          term +
          //  "&cuisine=" +
          // cuisine
          "&number=10"
      )
        .then((r) => r.json())
        .then((jr) => {
          var newData: any[] = [];
          for (let i = 0; i < 10; i++) {
            newData.push(jr.results[i]);
          }
          return newData;
        })
        .then((dataBlock) => {
          CreateSearchResults(dataBlock, setItemList, addToAccount);
        });
    };
    getInfo();
  }, [term]);


  return (
    <div>
      <Title />
      <Navbar />
      <InputBox
        addSearchTerm={(guess: string) => {
          setTerm(guess);
        }}
      />
      <div className="search">{itemList}</div>
    </div>
  );
}
