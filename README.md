# rad-recipe-recommender

Our final project for CS32 features a recipe recommender and social web app for food lovers!

## Project Overview

Through our rad recipe recommender, users are able to add and request friends, make search queries,
view other users' recipe lists, and get recommended recipes based on their friends' recipe lists.

Home: Home page shows the top 6 recipes recommended based on your friends' recipes on the left side and your own recipe list on the right side.

Search: The user can search for an ingredient in the search bar and filter for cuisines and dietary restrictions, and the page would return 10 recipes that fulfill the specifications. The user can add the recipes to their recipe list, and clicking on the image would lead them to the website that details the recipe.

Gallery: searching for a friend's ID would return their recipe list.

Friends: the user can send friend requests here.

## Technologies Used

- [React.js](https://reactjs.org/)
- [Firestore Database](https://firebase.google.com/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Spoonacular API](https://spoonacular.com/)

## Getting Started

1. To get started, clone the repository to your own desktop.

> `git clone https://github.com/seehanah-tang/rad-recipe-recommender.git`

2. Run `npm install` in the `client` directory.

3. Run `npm start` in the same directory.

## Acknowledgments

Thanks first and foremost to Prof. Tim Nelson for an amazing semester! Additionally, we love our
beautiful and wonderfully helpful mentor Jimmy, who helped us with the template and backbone of our website. <3
