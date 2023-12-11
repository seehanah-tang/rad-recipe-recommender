import { UserData } from "../interfaces/MultifactedUser";
import firebase from "../firebase/Firebase";
import { useState } from "react";
import "../styles/Recommendations.css";

const counter = (array: string[]) => {
  var count: any = {};
  array.forEach((val) => (count[val] = (count[val] ?? 0) + 1));
  return count;
};

const dictCounter = (array: string[]) => {
  var count = new Map<string, number>();
  array.forEach((val) => count.set(val, (count.get(val) ?? 0) + 1));
  return count;
};

function Recommendations(userObject: any) {
  const [recommendList, setRecommendList] = useState<any[]>([]);
  //useEffect(() => {if (user !== undefined && user !== null) {console.log('loading'); loadRecommendations()}}, [userObject.userObject])

  let user: UserData = userObject.userObject;
  if (user === undefined || user === null) {
    return <div>User Not Loaded! Try Again</div>;
  } else if (!user.id || !user.friend_list) {
    return <div>Add Some Friends Before Using Recommender!</div>;
  }

  var devRef = firebase.firestore().collection("user_accounts");
  const loadRecommendations = () => {
    const friendSet = new Set(user.friend_list);
    // Gets all docs
    devRef
      .get()
      .then((items) => {
        return items.docs.map((doc) => doc.data());
      })
      // Returns all friends
      .then((allItems) => allItems.filter(({ id }) => friendSet.has(id)))
      // Returns all friend's recipe lists
      .then((friendObjects) =>
        friendObjects.map(function (doc) {
          return doc.recipe_list;
        })
      )
      .then((friendLists) => {
        // Generates a count of how many times each genre appear in each person's list.
        const genreCountsCounter = friendLists.map(function (doc) {
          return counter(
            doc
              .map(function (inner: any) {
                return inner.genres;
              })
              .flat(2)
          );
        });
        // console.log(genreCountsCounter)
        // Compiles them into the max genre for each person
        const argMax = genreCountsCounter.map(function (genreCounts) {
          return Object.entries(genreCounts).reduce((a: any, b: any) =>
            a[1] > b[1] ? a : b
          )[0];
        });
        // console.log(argMax)
        // Compiles them into the max genre amongst all friends
        const topGenre = Object.entries(counter(argMax)).reduce(
          (a: any, b: any) => (a[1] > b[1] ? a : b)
        )[0];
        // console.log(topGenre)
        // Filters user lists to only derive shows of the top genre
        const friendsOnlyTopGenre = friendLists.map(function (doc) {
          return doc.filter(function (recipe: any) {
            return recipe.genres.includes(topGenre);
          });
        });
        // console.log(friendsOnlyTopGenre)
        // Removes the overlap between the user and their friends' watched shows
        const flatten = friendsOnlyTopGenre.flat();
        const userRecipeTitles = user.recipe_list.map(function (recipe) {
          return recipe.title;
        });
        const arrayDifference = flatten.filter(
          (x) => !userRecipeTitles.includes(x.title)
        );
        // console.log(arrayDifference)
        // Filters out repeated recipe in the list, recording how many times they occurred among friends
        const arrayDifferenceCounter = dictCounter(
          arrayDifference.map(function (recipe) {
            return recipe.title;
          })
        );
        const uniqueNames: any[] = [];
        const uniqueRecommendations = arrayDifference.filter(function (recipe) {
          if (uniqueNames.includes(recipe.title)) {
            return false;
          } else {
            uniqueNames.push(recipe.title);
            return true;
          }
        });
        // Comparator for ranking. As a reminder, b - a implies b > a.
        const mu = 20000; // average ratings required
        const sigmoid = (ratings: number) => {
          return 1 / (1 + Math.exp(-(ratings - mu) / 5000));
        };

        function rankingComparator(a: any, b: any) {
          const aVal =
            a.score *
            sigmoid(a.scored_by) *
            (arrayDifferenceCounter.get(a.title) ?? 1);
          const bVal =
            b.score *
            sigmoid(b.scored_by) *
            (arrayDifferenceCounter.get(b.title) ?? 1);
          return bVal - aVal;
        }
        const orderedRecommendations =
          uniqueRecommendations.sort(rankingComparator);

        const reccDiv = [];
        for (let i = 0; i < orderedRecommendations.length; i++) {
          reccDiv.push(
            <div key={i}>
              <img
                src={orderedRecommendations[i].thumbnail}
                alt={"cover picture of " + orderedRecommendations[i].title}
                onClick={() => {
                  window.open(orderedRecommendations[i].url);
                }}
              />
              <br></br>
              <div className="recipe-title" aria-label="recipe title">
                {orderedRecommendations[i].title}
              </div>
              <button
                onClick={() => {
                  devRef.doc(user.id).update({
                    recipe_list: firebase.firestore.FieldValue.arrayUnion(
                      orderedRecommendations[i]
                    ),
                  });
                }}
              >
                {" "}
                Add To List{" "}
              </button>
            </div>
          );
        }
        setRecommendList(reccDiv.slice(0, 3));
      });
  };

  return (
    <div className="recommended" aria-label="recommended">
      {recommendList}
    </div>
  );
}

export default Recommendations;
