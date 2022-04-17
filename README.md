<div align="center">

 <img style="width: 50%; height: 50%;" src="images/webview.png" alt="">

# Shit-Post.tech

</div>

<div align="left">
  <h3>
    <a href="https://web.shitPost.tech">
      Demo
    </a>
  </h3>
</div>

<!-- TABLE OF CONTENTS -->
A fullstack project containerised with Docker and a reverse proxy nginx at the backend.

## Table of Contents

- [Built With](#built-with)
- [Features](#features)
- [setup guide](#setup-guide)


<!-- OVERVIEW -->



### Built With

<!-- This section should list any major frameworks that you built your project using. Here are a few examples.-->
## Frontend
- Next js
- TypeScript
- URQL  GraphQL client 
- Chakra UI
## Backend
- NodeJS 
- TypeScript
- GraphQL (Apollo)
- Type Orm
- Redis (Session storage)
- PostgreSQL (Database)
- Docker 
- Nginx (reverse proxy)

## Features

<!-- List the features of your application or follow the template. Don't share the figma file here :) -->

This application has features :
- User authentication 
  - Signin 
  - Register
  - Reset Password (forget password)
- User can 
  - Create post
  - Edit post
  - Delete post
  - Up vote or down vote others posts
- Pagination
- User sessions are stored in the in memory database (Redis)
## Setup guide
- fork the repo on github
- clone it to your local Setup
- make sure you have node installed of version 14 or above

# Backend

- Make sure to update your database and redis configuration in the env file

```
cd server 

# this will compile the ts file js and keep watching
yarn watch 

# open a new terminal

yarn dev

```


# Frontend 
- After making a clone to your local 
- open the folder `ShitPost` in your favorite code editor

```
cd Client
yarn install
yarn dev

``` 

## Yay ! 
your are done setting up now you can test out things and enjoy it


<p>
  <a href="https://twitter.com/Majjikishore1" target="_blank">
    <img alt="Twitter: Majjikishore1" src="https://img.shields.io/twitter/follow/Majjikishore1.svg?style=social" />
  </a>
</p>

> a redit clone

# Show your support

Give a ⭐️ if this project helped you!

